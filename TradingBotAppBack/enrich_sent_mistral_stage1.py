# enrich_sent_mistral_stage1.py
import os
import urllib.parse
import feedparser
import requests
import json
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed

#  Dossiers
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_JSON_PATH = os.path.join(DATA_DIR, "mistral_raw_data.json")

#  Tickers
import pandas as pd
df = pd.read_csv(os.path.join(DATA_DIR, "df_final_merged.csv"))
tickers = df["Ticker"].dropna().unique()

#  Mistral API externe
MISTRAL_API = "https://fzhvs2csuz2ezl-8000.proxy.runpod.net/analyze"

#  RSS fetch
def get_rss_entries(ticker):
    try:
        query = urllib.parse.quote(f"{ticker} stock")
        rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(rss_url)
        return [e.title.strip() for e in feed.entries[:10]]
    except Exception:
        return []

#  Appel Mistral résumé
def call_mistral_summary(titles):
    try:
        full_text = "\n".join(titles)
        response = requests.post(MISTRAL_API, json={"task": "news_summary_global", "input": full_text}, timeout=90)
        if response.status_code == 200:
            data = response.json()
            return data["outputs"][0].strip()
    except:
        pass
    return ""

#  Appel Mistral bullets
def call_mistral_bullets(summary):
    try:
        response = requests.post(MISTRAL_API, json={"task": "news_bullet_points", "input": summary}, timeout=90)
        if response.status_code == 200:
            data = response.json()
            return data["outputs"][0].strip().split("\n")
    except:
        pass
    return []

#  Traitement parallèle
def process_ticker(ticker):
    titles = get_rss_entries(ticker)
    if not titles:
        return None
    summary = call_mistral_summary(titles)
    bullets = call_mistral_bullets(summary)
    return {
        "ticker": ticker,
        "titles": titles,
        "summary": summary,
        "bullets": [b.strip("-• ").strip() for b in bullets if b.strip()]
    }

print(f" Extraction & Résumé Mistral pour {len(tickers)} tickers...")

raw_data = {}
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(process_ticker, ticker) for ticker in tickers]
    for f in tqdm(as_completed(futures), total=len(futures)):
        result = f.result()
        if result:
            raw_data[result["ticker"]] = {
                "titles": result["titles"],
                "summary": result["summary"],
                "bullets": result["bullets"]
            }

#  Sauvegarde
with open(RAW_JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(raw_data, f, indent=2, ensure_ascii=False)
print(f" Données Mistral brutes exportées : {RAW_JSON_PATH}")
