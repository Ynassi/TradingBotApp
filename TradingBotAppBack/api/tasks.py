import subprocess
import time
from tqdm import tqdm
import sys
import os

# 🧭 Se positionner dans le dossier racine du projet (là où sont les scripts)
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
os.chdir(ROOT_DIR)

PIPELINES = [
    {"name": "1️⃣ ETL Indices majeurs (S&P500, CAC40, Nikkei)", "script": "etl_pipeline.py", "steps": 14},
    {"name": "2️⃣ Enrichissement Small Caps (filtres supplémentaires)", "script": "enrich_etl.py", "steps": 2},
    {"name": "3️⃣ Fusion finale des données", "script": "merge_uniform.py", "steps": 2},

    {"name": "4️⃣ Données Overview Générales", "script": "generate_overview_data.py", "steps": 5},
    {"name": "5️⃣ Résumé Marchés (GPT)", "script": "generate_overview_summary.py", "steps": 2},

    {"name": "6️⃣ Enrichissement Compagnies", "script": "enrich_companies.py", "steps": 3},
    {"name": "7️⃣ Raffinement Compagnies", "script": "refine_companies.py", "steps": 2},

    {"name": "8️⃣ Analyse News (Mistral – Étape 1)", "script": "enrich_sent_mistral_stage1.py", "steps": 2},
    {"name": "8️⃣ Analyse News (Mistral – Étape 2)", "script": "enrich_sent_mistral_stage2.py", "steps": 2},

    {"name": "9️⃣ Fusion News", "script": "merge_news.py", "steps": 2}
]

def run_pipeline_with_progress(pipeline):
    name = pipeline["name"]
    script = pipeline["script"]
    steps = pipeline["steps"]
    step_percent = 100 // steps

    print(f"\n🔧 Démarrage de : {name}")
    progress_bar = tqdm(total=100, desc=name, bar_format="{l_bar}{bar}| {n_fmt}%", ncols=100)

    process = subprocess.Popen(
        ["python", f"{script}"],
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
            "résumé", "visualisation", "enrich", "fiche", "json", "bullet", "finbert"
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

    # Batch 1 - ETL Companies (séquentiel)
    for i in range(3):
        if not run_pipeline_with_progress(PIPELINES[i]):
            print("⛔ Arrêt du pipeline suite à une erreur (Batch 1).")
            return

    # Batch 2 - Overview (parallélisable)
    overview_proc = []
    for i in range(3, 5):
        name = PIPELINES[i]["name"]
        script = PIPELINES[i]["script"]
        print(f"▶️ Lancement parallèle : {name}")
        overview_proc.append(subprocess.Popen(["python", script]))

    # Batch 3 - Compagnies
    if not run_pipeline_with_progress(PIPELINES[5]):
        print("⛔ Arrêt du pipeline suite à une erreur (Batch 3.1).")
        return
    if not run_pipeline_with_progress(PIPELINES[6]):
        print("⛔ Arrêt du pipeline suite à une erreur (Batch 3.2).")
        return

    # Batch 4 - Analyse Mistral (étapes 1 puis 2)
    if not run_pipeline_with_progress(PIPELINES[7]):
        print("⛔ Arrêt du pipeline suite à une erreur (Batch 4.1).")
        return
    if not run_pipeline_with_progress(PIPELINES[8]):
        print("⛔ Arrêt du pipeline suite à une erreur (Batch 4.2).")
        return

    # Batch 5 - Fusion News
    if not run_pipeline_with_progress(PIPELINES[9]):
        print("⛔ Arrêt du pipeline suite à une erreur (Batch 5).")
        return

    # Fin des scripts parallèles (overview)
    for p in overview_proc:
        p.wait()

    print("\n🎯 Tous les pipelines ont été exécutés avec succès.")

if __name__ == "__main__":
    run_all_pipelines()
