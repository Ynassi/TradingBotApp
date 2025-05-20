import pandas as pd
import feedparser
from transformers import pipeline
import urllib.parse
import time
import os
from tqdm import tqdm

# 📁 Répertoires
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_PATH = os.path.join(DATA_DIR, "sentiment_sample_test.csv")

# 📄 Chargement des tickers
df = pd.read_csv(os.path.join(DATA_DIR, "df_final_merged.csv"))
tickers = df["Ticker"].dropna().unique()

# 🤖 Chargement du modèle FinBERT
print("🔁 Chargement du modèle FinBERT...")
sentiment_model = pipeline("sentiment-analysis", model="ProsusAI/finbert", device=-1)

# 🔍 Fonction pour extraire titres + URL
def get_rss_entries(ticker):
    query = urllib.parse.quote(f"{ticker} stock")
    rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    feed = feedparser.parse(rss_url)
    entries = []
    for entry in feed.entries[:10]:
        title = entry.title.strip()
        url = entry.link.strip()
        date = entry.published[:10] if 'published' in entry else "unknown date"
        entries.append({"title": title, "url": url, "date": date})
    return entries

# 🚀 Traitement des tickers
results = []
print(f"🧠 Lancement de l'analyse de {len(tickers)} tickers...")
for ticker in tqdm(tickers, desc="Analyse des tickers"):
    entries = get_rss_entries(ticker)

    if not entries:
        results.append({
            "Ticker": ticker,
            "news_count": 0,
            "sentiment_score": None,
            "positive_ratio": None,
            "negative_ratio": None,
            "neutral_ratio": None,
            "source": None
        })
        continue

    titles = [e["title"] for e in entries]
    
    try:
        sentiments = sentiment_model(titles, batch_size=8)
    except Exception as e:
        print(f"[ERREUR] {ticker} : {e}")
        sentiments = [{"label": "NEUTRAL"}] * len(titles)  # Fallback neutre

    counts = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
    sources = []

    for entry, sent in zip(entries, sentiments):
        label = sent["label"].upper()
        if label in counts:
            counts[label] += 1
        score_txt = f'{entry["title"]} ({entry["url"]}): {label.capitalize()}'
        sources.append(score_txt)

    total = sum(counts.values())
    score = (counts["POSITIVE"] - counts["NEGATIVE"]) / total if total > 0 else None

    results.append({
        "Ticker": ticker,
        "news_count": total,
        "sentiment_score": round(score, 3) if total else None,
        "positive_ratio": round(counts["POSITIVE"] / total, 2) if total else None,
        "negative_ratio": round(counts["NEGATIVE"] / total, 2) if total else None,
        "neutral_ratio": round(counts["NEUTRAL"] / total, 2) if total else None,
        "source": " / ".join(sources)
    })

    time.sleep(1.2)  # Pause anti-bannissement

# 💾 Export
df_out = pd.DataFrame(results)
df_out.to_csv(OUTPUT_PATH, index=False)
print(f"✅ Résultats sauvegardés dans {OUTPUT_PATH}")
