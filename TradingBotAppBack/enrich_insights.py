import os
import pandas as pd
import json
import requests
import yfinance as yf
from dotenv import load_dotenv

# === Chargement des fichiers ===
df_short = pd.read_csv("data/list_short.csv")
df_midterm = pd.read_csv("data/list_midterm.csv")
df_shortterm = pd.read_csv("data/list_shortterm.csv")
df_final = pd.read_csv("data/df_final.csv")

insights_path = "output/insights.csv"
df_insights = pd.read_csv(insights_path) if os.path.exists(insights_path) else pd.DataFrame(columns=["Ticker", "Summary"])

# === Chargement de la clé Finnhub ===
load_dotenv()
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")

# === Création du dossier de sortie ===
output_dir = "output/insights_enriched"
os.makedirs(output_dir, exist_ok=True)

# Harmonisation
df_final["Ticker"] = df_final["Ticker"].astype(str)
df_insights["Ticker"] = df_insights["Ticker"].astype(str)

df_short["Source"] = "Short"
df_midterm["Source"] = "Midterm"
df_shortterm["Source"] = "Shortterm"
df_sources = pd.concat([df_short, df_midterm, df_shortterm], ignore_index=True)[["Ticker", "Source"]]
df_final = df_final.merge(df_sources, on="Ticker", how="inner")

# === Fonction pour adapter les tickers aux formats attendus ===
def normalize_ticker(ticker, target="tradingview"):
    if ".T" in ticker and target == "tradingview":
        return f"TSE:{ticker.replace('.T', '')}"
    if ".TO" in ticker and target == "tradingview":
        return f"TSX:{ticker.replace('.TO', '')}"
    if ".L" in ticker and target == "tradingview":
        return f"LSE:{ticker.replace('.L', '')}"
    return ticker

# === Finnhub : rating + metrics ===
def get_finnhub_rating(ticker):
    try:
        url_base = "https://finnhub.io/api/v1/stock/recommendation?symbol={ticker}&token=" + FINNHUB_API_KEY
        url = url_base.format(ticker=ticker)
        response = requests.get(url)
        data = response.json()
        if isinstance(data, list) and data:
            return data[0]
        if "." in ticker:
            ticker_clean = ticker.split(".")[0]
            url = url_base.format(ticker=ticker_clean)
            response = requests.get(url)
            data = response.json()
            if isinstance(data, list) and data:
                print(f"[Fallback rating] {ticker} → {ticker_clean}")
                return data[0]
        print(f"[Rating] No data for: {ticker}")
        return None
    except Exception as e:
        print(f"[Rating ERROR] {ticker} → {e}")
        return None

def get_finnhub_metrics(ticker):
    try:
        url_base = "https://finnhub.io/api/v1/stock/metric?symbol={ticker}&metric=all&token=" + FINNHUB_API_KEY
        url = url_base.format(ticker=ticker)
        response = requests.get(url)
        data = response.json()
        if "metric" in data and data["metric"]:
            return data["metric"]
        if "." in ticker:
            ticker_clean = ticker.split(".")[0]
            url = url_base.format(ticker=ticker_clean)
            response = requests.get(url)
            data = response.json()
            if "metric" in data and data["metric"]:
                print(f"[Fallback metrics] {ticker} → {ticker_clean}")
                return data["metric"]
        print(f"[Metrics] No data for: {ticker}")
        return {}
    except Exception as e:
        print(f"[Metrics ERROR] {ticker} → {e}")
        return {}

# === Yahoo Finance ===
def get_yahoo_analyst_data(ticker):
    try:
        yf_ticker = yf.Ticker(ticker)
        info = yf_ticker.info
        return {
            "target_mean_price": info.get("targetMeanPrice"),
            "recommendation": info.get("recommendationKey"),
            "number_of_analysts": info.get("numberOfAnalystOpinions"),
            "forward_PE": info.get("forwardPE"),
            "trailing_PE": info.get("trailingPE"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "beta": info.get("beta"),
            "dividend_yield": info.get("dividendYield"),
            "long_name": info.get("longName", ticker)
        }
    except Exception as e:
        print(f"[Yahoo ERROR] {ticker} → {e}")
        return {}

# === Génération des fiches enrichies ===
for _, row in df_final.iterrows():
    ticker = row["Ticker"]
    tv_ticker = normalize_ticker(ticker, target="tradingview")

    # Ignore Finnhub for FR & JP tickers
    if ".PA" in ticker or ".T" in ticker:
        rating = None
        metrics = {}
        print(f"[Finnhub] Ignoré pour {ticker} (FR/JP)")
    else:
        rating = get_finnhub_rating(ticker)
        metrics = get_finnhub_metrics(ticker)

    yahoo_data = get_yahoo_analyst_data(ticker)

    fiche = {
        "ticker": ticker,
        "name": yahoo_data.get("long_name", row["Company"]),
        "sector": yahoo_data.get("sector", row["Sector"]),
        "market_cap": row["MarketCap"],
        "source_list": row["Source"],
        "fundamentals": {
            "PE": row["PE"],
            "PB": row["PB"],
            "EV_Revenue": row["EV_Revenue"],
            "ROE": row["ROE"],
            "ProfitMargin": row["ProfitMargin"],
            "GrossMargin": row["GrossMargin"],
            "DividendYield": yahoo_data.get("dividend_yield", metrics.get("dividendYield"))
        },
        "technical_indicators": {
            "RSI_14": row["RSI_14"],
            "Momentum_10": row["Momentum_10"],
            "MACD": row["MACD"],
            "BB_Percent": row["BB_Percent"],
            "SMA20_above_SMA50": row["SMA20_above_SMA50"],
        },
        "scores": {
            "ValueScore": row["ValueScore"],
            "QualityScore": row.get("QualityScore", None),
            "SignalScore": row["SignalScore"]
        },
        "volatility": row["Volatility"],
        "beta": row["Beta"],
        "return_6m": row["Return_6M"],
        "recommendation_summary": df_insights[df_insights["Ticker"] == ticker]["Summary"].values[0]
            if ticker in df_insights["Ticker"].values else None,
        "analyst_rating": {
            "recommendation": yahoo_data.get("recommendation"),
            "analyst_count": yahoo_data.get("number_of_analysts"),
            "target_mean_price": yahoo_data.get("target_mean_price"),
        },
        "chart_embed_url": f"https://www.tradingview.com/symbols/{tv_ticker}/"
    }

    path_out = os.path.join(output_dir, f"{ticker}.json")
    with open(path_out, "w", encoding="utf-8") as f:
        json.dump(fiche, f, indent=4, ensure_ascii=False)

print(f"\n Fiches enrichies générées dans : {output_dir}")
