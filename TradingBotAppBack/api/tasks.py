import subprocess
import time
from tqdm import tqdm
import sys

PIPELINES = [
    {"name": "1️⃣ ETL Indices majeurs (S&P500, CAC40, Nikkei)", "script": "etl_pipeline.py", "steps": 14},
    {"name": "2️⃣ Enrichissement Small Caps (filtres supplémentaires)", "script": "enrich_etl.py", "steps": 2},
    {"name": "3️⃣ Fusion finale des données", "script": "merge_uniform.py", "steps": 2},

    {"name": "4️⃣ Analyse & Clustering", "script": "analysis_pipeline.py", "steps": 5},
    {"name": "5️⃣ Sentiment - News", "script": "enrich_sentiment_news.py", "steps": 3},
    {"name": "6️⃣ Sentiment - Social", "script": "enrich_sentiment_social.py", "steps": 3},

    {"name": "7️⃣ Génération Insights", "script": "generate_insights.py", "steps": 3},
    {"name": "8️⃣ Fiches descriptives enrichies", "script": "enrich_insights.py", "steps": 4},
    {"name": "9️⃣ Données Overview Générales", "script": "generate_overview_data.py", "steps": 5},
    {"name": "🔟 Données Boursières Indices", "script": "index_data.py", "steps": 3},
    {"name": "1️⃣1️⃣ Résumé Marchés (GPT)", "script": "generate_overview_summary.py", "steps": 2}
]


def run_pipeline_with_progress(pipeline):
    name = pipeline["name"]
    script = pipeline["script"]
    steps = pipeline["steps"]
    step_percent = 100 // steps

    print(f"\n🔧 Démarrage de : {name}")
    progress_bar = tqdm(total=100, desc=name, bar_format="{l_bar}{bar}| {n_fmt}%", ncols=100)

    process = subprocess.Popen(
        ["python", script],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        bufsize=1,
        universal_newlines=True
    )

    progress = 0
    for line in process.stdout:
        sys.stdout.write(line)
        sys.stdout.flush()
        if any(kw in line.lower() for kw in [
            "étape", "step", "extraction", "nettoyage", "short", "midterm", "shortterm",
            "résumé", "visualisation", "enrich", "fiche", "json"
        ]):
            progress = min(progress + step_percent, 100)
            progress_bar.n = progress
            progress_bar.refresh()

    process.stdout.close()
    returncode = process.wait()
    progress_bar.n = 100
    progress_bar.refresh()
    progress_bar.close()

    if returncode == 0:
        print(f"✅ {name} terminé avec succès.")
        return True
    else:
        print(f"❌ Erreur pendant l'exécution de {name}. Code de retour : {returncode}")
        return False

def run_all_pipelines():
    print("\n🚀 Lancement des pipelines de traitement complet...\n")
    for pipeline in PIPELINES:
        success = run_pipeline_with_progress(pipeline)
        if not success:
            print("⛔ Arrêt du pipeline suite à une erreur.")
            break
    else:
        print("\n🎯 Tous les pipelines ont été exécutés avec succès.")
