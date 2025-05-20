import os
import pandas as pd
import feedparser
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime, timezone
from tqdm import tqdm

#  API Key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Chargement des listes
df_short = pd.read_csv("data/list_short.csv")
df_midterm = pd.read_csv("data/list_midterm.csv")
df_shortterm = pd.read_csv("data/list_shortterm.csv")

# Attribution des labels sources
df_short["Source"] = "Short"
df_midterm["Source"] = "Midterm"
df_shortterm["Source"] = "Shortterm"
df_lists = pd.concat([df_short, df_midterm, df_shortterm], ignore_index=True)[["Ticker", "Source"]].drop_duplicates()

# Chargement de la table finale complète
df_final = pd.read_csv("data/df_final.csv")
df_final["Ticker"] = df_final["Ticker"].astype(str)
df_lists["Ticker"] = df_lists["Ticker"].astype(str)

# Merge pour enrichir les tickers sélectionnés avec leur source
df_filtered = df_final.merge(df_lists, on="Ticker", how="inner")

#  Actualités filtrées par date avec titres datés
def get_google_news_rss(ticker, max_articles=10):
    url = f"https://news.google.com/rss/search?q={ticker}+stock&hl=en-US&gl=US&ceid=US:en"
    feed = feedparser.parse(url)
    articles = []
    today = datetime.now(timezone.utc)

    for entry in feed.entries:
        try:
            pub_date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
        except:
            continue
        if pub_date.year == 2025 and pub_date.month in [2, 3, 4, 5]:
            date_str = pub_date.strftime('%Y-%m-%d')
            articles.append((pub_date, f"{date_str} – {entry.title}"))

    if not articles:
        return ["Aucune actualité récente disponible"]

    articles.sort(key=lambda x: x[0], reverse=True)
    return [title for _, title in articles[:max_articles]]

#  Résumé GPT
def summarize_with_gpt(headlines, ticker, fundamentals):
    headlines_formatted = "".join(headlines)
    current_date = datetime.now().strftime('%Y-%m-%d')
    prompt = f"""
Tu es un analyste financier professionnel. Nous sommes le {current_date}, et tu rédiges une **note de synthèse à l’intention d’un investisseur**.

L’entreprise analysée est **{ticker}**, qui a été classée dans la **liste stratégique “{fundamentals.get('Source')}”** (Short, Midterm ou Shortterm).

Merci de porter une attention particulière à la **date des actualités**. Si aucune information récente (90 jours avant {current_date}) n’est disponible, précise-le clairement dans ton analyse.

Voici les actualités récentes la concernant :

{headlines_formatted}

Voici les données financières et techniques disponibles :

🔹 **Données fondamentales**
- PE Ratio : {fundamentals.get('PE')}
- PB Ratio : {fundamentals.get('PB')}
- EV / Revenue : {fundamentals.get('EV_Revenue')}
- ROE : {fundamentals.get('ROE')}
- Marge brute : {fundamentals.get('GrossMargin')}
- Marge bénéficiaire nette : {fundamentals.get('ProfitMargin')}
- Volatilité 6M : {fundamentals.get('Volatility')}
- Bêta : {fundamentals.get('Beta')}
- Performance 6 mois : {fundamentals.get('Return_6M')}

🔹 **Indicateurs techniques**
- RSI (14 jours) : {fundamentals.get('RSI_14')}
- Momentum (10 jours) : {fundamentals.get('Momentum_10')}
- MACD : {fundamentals.get('MACD')}
- % position dans les bandes de Bollinger : {fundamentals.get('BB_Percent')}
- Moyenne mobile 20 au-dessus de 50 jours : {fundamentals.get('SMA20_above_SMA50')}

🔹 **Scores synthétiques**
- ValueScore : {fundamentals.get('ValueScore')}
- QualityScore : {fundamentals.get('QualityScore')}
- SignalScore : {fundamentals.get('SignalScore')}

Ta tâche est de produire un résumé d'analyse à destination d'un investisseur. Concentre-toi en priorité sur ce que les **actualités** révèlent :

- Quels sont les événements majeurs ou signaux de marché à retenir ?
- Les nouvelles sont-elles positives, négatives ou mixtes ?
- Existe-t-il un **signal d'achat, de vente ou d'attente** suggéré par l’actualité ?
- Si pertinent, indique en une phrase en quoi les fondamentaux confirment (ou non) ce signal.
- Prend en compte la liste input (si la compagnie analysée viens de la liste list_short, list_midterm ou list_shortterm) dans ton analyse. 
Exemple: si la compagnie vient de la liste "short", essaie de trouver des éléments qui pourraient justifier ce positionnement.
- Vérifie systématiquement que les actualités sont cohérentes avec la date du jour ({current_date}). 
Ignore ou corrige toute référence temporelle incohérente (ex: parler du Q3 alors que seul le Q1 est terminé). Ne reproduis jamais une information si sa date semble fausse.
- Chaque résumé doit etre le plus détaillé possible et bien organisé en plusieurs parties.

Fournis un résumé clair, professionnel et utile pour la prise de décision.
Cite systématiquement les sources (titres des news) avec leur date si pertinent.
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=1000
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[Erreur GPT] {e}"

#  Exécution boucle avec barre de progression
results = []
for _, row in tqdm(df_filtered.iterrows(), total=df_filtered.shape[0], desc="Génération des insights"):
    ticker = row['Ticker']
    news = get_google_news_rss(ticker, max_articles=10)
    summary = summarize_with_gpt(news, ticker, row.to_dict())

    results.append({
        "Ticker": ticker,
        "Company": row.get("Company", ""),
        "Sector": row.get("Sector", ""),
        "Source": row.get("Source", ""),
        "News_1": news[0] if len(news) > 0 else "",
        "News_2": news[1] if len(news) > 1 else "",
        "News_3": news[2] if len(news) > 2 else "",
        "News_4": news[3] if len(news) > 3 else "",
        "News_5": news[4] if len(news) > 4 else "",
        "News_6": news[5] if len(news) > 5 else "",
        "News_7": news[6] if len(news) > 6 else "",
        "News_8": news[7] if len(news) > 7 else "",
        "News_9": news[8] if len(news) > 8 else "",
        "News_10": news[9] if len(news) > 9 else "",
        "Summary": summary
    })

#  Sauvegarde CSV + Excel multi-onglets
os.makedirs("output", exist_ok=True)
insights_df = pd.DataFrame(results)
insights_df.to_csv("output/insights.csv", index=False)

with pd.ExcelWriter("output/insights_by_list.xlsx", engine="openpyxl") as writer:
    for source in ["Short", "Midterm", "Shortterm"]:
        df_filtered = insights_df[insights_df["Source"] == source]
        df_filtered.to_excel(writer, index=False, sheet_name=source)

print("\n Fichier CSV + Excel multi-onglets générés dans le dossier 'output'.")
