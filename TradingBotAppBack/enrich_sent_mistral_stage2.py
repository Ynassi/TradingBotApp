# enrich_sent_mistral_stage2.py
import os
import json
import re
import pandas as pd
from transformers import pipeline
from tqdm import tqdm
from deep_translator import GoogleTranslator

# 📁 Dossiers
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_JSON_PATH = os.path.join(DATA_DIR, "mistral_raw_data.json")
CSV_PATH = os.path.join(DATA_DIR, "sentiment_news_summary_full.csv")
JSON_PATH = os.path.join(DATA_DIR, "news_summaries_full.json")

# 🤖 FinBERT
print("🔁 Chargement FinBERT...")
finbert = pipeline("sentiment-analysis", model="ProsusAI/finbert", device=-1)

# 🌍 Traduction
def translate_to_english(text):
    try:
        return GoogleTranslator(source='auto', target='en').translate(text)
    except:
        return text

# 🧠 FinBERT bullets
def analyze_bullet_points(bullets):
    try:
        results = finbert(bullets)
        labels = [r["label"].upper() for r in results]
        counts = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
        for label in labels:
            if label in counts:
                counts[label] += 1
        return counts
    except:
        return {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}

# 🧠 FinBERT résumé
def classify_summary(summary):
    try:
        text = translate_to_english(summary)
        sentences = re.split(r'(?<=[.!?]) +', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20][:8]
        if not sentences:
            return "NEUTRAL"
        results = finbert(sentences)
        labels = [r["label"].upper() for r in results]
        counts = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
        for label in labels:
            if label in counts:
                counts[label] += 1
        pos, neg, neu = counts["POSITIVE"], counts["NEGATIVE"], counts["NEUTRAL"]
        if pos > neg:
            return "POSITIVE"
        elif neg > pos:
            return "NEGATIVE"
        elif pos == neg and pos > 0:
            return "NEUTRAL"
        elif pos == 0 and neg == 0 and neu > 0:
            return "NEUTRAL"
        else:
            return "NEUTRAL"
    except:
        return "NEUTRAL"

# 🧪 Chargement
with open(RAW_JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

results = []
summaries_clean = {}

print(f"🧠 Analyse qualitative de {len(data)} tickers avec FinBERT...")

for ticker, content in tqdm(data.items()):
    titles = content.get("titles", [])
    summary = content.get("summary", "")
    bullets = content.get("bullets", [])

    mistral_label = classify_summary(summary)
    bullet_counts = analyze_bullet_points(bullets)

    sentiments = finbert(titles, batch_size=8) if titles else []
    counts = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
    sources = []

    for title, sent in zip(titles, sentiments):
        label = sent["label"].upper()
        if label in counts:
            counts[label] += 1
        sources.append(f"{title} → {label.title()}")

    total = sum(counts.values())
    score = (counts["POSITIVE"] - counts["NEGATIVE"]) / total if total else None

    results.append({
        "Ticker": ticker,
        "news_count": total,
        "sentiment_score": round(score, 3) if total else None,
        "positive_ratio": round(counts["POSITIVE"] / total, 2) if total else None,
        "negative_ratio": round(counts["NEGATIVE"] / total, 2) if total else None,
        "neutral_ratio": round(counts["NEUTRAL"] / total, 2) if total else None,
        "mistral_label": mistral_label,
        "bullet_positive_count": bullet_counts["POSITIVE"],
        "bullet_negative_count": bullet_counts["NEGATIVE"],
        "source": " / ".join(sources)
    })

    summaries_clean[ticker] = summary

# 💾 Export
df_out = pd.DataFrame(results)
df_out.to_csv(CSV_PATH, index=False, encoding="utf-8")
print(f"✅ Export CSV : {CSV_PATH}")

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(summaries_clean, f, indent=2, ensure_ascii=False)
print(f"✅ Export JSON : {JSON_PATH}")
