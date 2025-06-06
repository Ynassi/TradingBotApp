from fastapi.responses import JSONResponse
import pandas as pd
import json
import os
from dotenv import load_dotenv
from api.tasks import run_all_pipelines
from pydantic import BaseModel
from fastapi import FastAPI, Request
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import math
from fastapi.responses import JSONResponse


#  Corrigé : dossier racine du projet (pas "api/")
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_FOLDER = os.path.join(BASE_DIR, "data")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "output")

#  Chargement sécurisé du fichier .env depuis la racine
dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path)

#  Vérification d'une variable critique
if not os.getenv("OPENAI_API_KEY"):
    raise EnvironmentError(" Variable OPENAI_API_KEY manquante dans .env")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API opérationnelle"}

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

@app.post("/api/run-pipelines")
def run_pipelines():
    run_all_pipelines()
    return {"status": "Pipelines exécutés avec succès"}

@app.get("/api/df_final")
def get_df_final():
    path = os.path.join(DATA_FOLDER, "df_final.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Fichier df_final introuvable"})

@app.get("/api/df_final_merged")
def get_df_final_merged():
    path = os.path.join(DATA_FOLDER, "df_final_merged.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        df = df.replace({np.nan: None, np.inf: None, -np.inf: None})
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Fichier df_final introuvable"})


@app.get("/api/list-short")
def get_list_short():
    path = os.path.join(DATA_FOLDER, "list_short.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Liste SHORT introuvable"})

@app.get("/api/list-midterm")
def get_list_midterm():
    path = os.path.join(DATA_FOLDER, "list_midterm.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Liste MIDTERM introuvable"})

@app.get("/api/list-shortterm")
def get_list_shortterm():
    path = os.path.join(DATA_FOLDER, "list_shortterm.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Liste SHORTTERM introuvable"})

@app.get("/api/insights")
def get_insights():
    path = os.path.join(OUTPUT_FOLDER, "insights.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Fichier insights.csv introuvable"})

@app.get("/api/fiche/{ticker}")
def get_company_fiche(ticker: str):
    path = os.path.join(OUTPUT_FOLDER, "insights_enriched_all", f"{ticker}.json")
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data
        except json.JSONDecodeError:
            return JSONResponse(status_code=500, content={"error": f"Erreur JSON pour {ticker}"})
    return JSONResponse(status_code=404, content={"error": f"Fiche non trouvée pour {ticker}"})

@app.get("/api/selection-criteria")
def get_selection_criteria():
    path = os.path.join(OUTPUT_FOLDER, "selection_criteria.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return JSONResponse(status_code=404, content={"error": "Fichier selection_criteria.json introuvable"})

@app.get("/api/cluster-description")
def get_cluster_description():
    path = os.path.join(OUTPUT_FOLDER, "cluster_descriptions.txt")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return {"description": f.read()}
    return JSONResponse(status_code=404, content={"error": "Fichier cluster_descriptions.txt introuvable"})

@app.get("/api/tsne")
def get_tsne_data():
    path = os.path.join(DATA_FOLDER, "df_kmeans_clusters.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return JSONResponse(status_code=404, content={"error": "Fichier tsne introuvable"})

@app.get("/api/overview-data")
def get_overview_data():
    try:
        # 1. Fear & Greed Index
        with open(os.path.join(DATA_FOLDER, "fear_greed.json")) as f:
            fear_greed = json.load(f)

        # 2. VIX
        with open(os.path.join(DATA_FOLDER, "vix.json")) as f:
            vix = json.load(f)

        # 3. Indices comparés
        index_path = os.path.join(DATA_FOLDER, "indices.csv")
        df_indices = pd.read_csv(index_path) if os.path.exists(index_path) else pd.DataFrame()
        index_comparison = df_indices.replace({pd.NA: None, float('nan'): None}).to_dict(orient="records")

        # 4. Heatmap sectorielle
        with open(os.path.join(DATA_FOLDER, "sector_heatmap.json")) as f:
            sector_heatmap = json.load(f)

        # 5. Performance sectorielle
        with open(os.path.join(DATA_FOLDER, "sector_performance.json")) as f:
            sector_performance = json.load(f)

        # 6. Actualités financières
        with open(os.path.join(DATA_FOLDER, "news.json")) as f:
            news = json.load(f)

        # 7. Sparklines des indices
        with open(os.path.join(DATA_FOLDER, "index_sparklines.json")) as f:
            sparklines = json.load(f)

        # 8. Volatilité moyenne par secteur
        with open(os.path.join(DATA_FOLDER, "sector_volatility.json")) as f:
            sector_volatility = json.load(f)

        # 9. Timestamp de génération
        with open(os.path.join(DATA_FOLDER, "generated_at.json")) as f:
            generated_at = json.load(f)

        # 10. Résumé narratif automatique
        with open(os.path.join(DATA_FOLDER, "headline_summary.json")) as f:
            headline_summary = json.load(f)

        return {
            "fear_greed_index": fear_greed,
            "vix": vix,
            "index_comparison": index_comparison,
            "sector_heatmap": sector_heatmap,
            "sector_performance": sector_performance,
            "financial_news": news,
            "index_sparklines": sparklines,
            "sector_volatility": sector_volatility,
            "generated_at": generated_at,
            "headline_summary": headline_summary
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Erreur overview-data : {str(e)}"})

@app.get("/api/headline-summary")
def get_headline_summary():
    path = os.path.join(DATA_FOLDER, "headline_summary.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return JSONResponse(status_code=404, content={"error": "Résumé non disponible"})

@app.get("/api/data/{symbol}")
def get_index_data(symbol: str):
    valid_symbols = ["spy", "ewq", "ewj"]
    if symbol not in valid_symbols:
        return JSONResponse(status_code=400, content={"error": "Symbole non reconnu"})

    path = os.path.join(DATA_FOLDER, f"{symbol}_data.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return JSONResponse(status_code=404, content={"error": f"Données indisponibles pour {symbol.upper()}"})


def clean_json(obj):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    elif isinstance(obj, dict):
        return {k: clean_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_json(i) for i in obj]
    else:
        return obj

@app.get("/api/companies")
def get_companies():
    import traceback

    directory = os.path.join(OUTPUT_FOLDER, "insights_enriched_all")
    companies = []
    erreurs = []

    if not os.path.exists(directory):
        return JSONResponse(status_code=404, content={"error": "Dossier JSON introuvable"})

    for filename in sorted(os.listdir(directory)):
        if filename.endswith(".json"):
            path = os.path.join(directory, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    raw = f.read()

                    # Remplacement brut NaN/inf → null
                    for bad in ["NaN", "Infinity", "-Infinity"]:
                        if bad in raw:
                            raw = raw.replace(bad, "null")

                    data = json.loads(raw)
                    data = clean_json(data)
                    companies.append(data)

            except Exception as e:
                erreurs.append(f"{filename}: {str(e)}")
                print(f"❌ ERREUR FICHIER : {filename}")
                print(traceback.format_exc())

    if erreurs:
        return JSONResponse(status_code=207, content={
            "error": "Certains fichiers JSON sont invalides",
            "errors": erreurs[:5],  # Limiter le retour à 5 erreurs pour éviter de tout casser
            "loaded": len(companies)
        })

    return JSONResponse(content=companies)


MISTRAL_API_URL = "https://8ug9pcnn4g0xwy-8000.proxy.runpod.net/analyze"

@app.post("/api/mistral-analyze")
async def mistral_proxy(req: Request):
    try:
        body = await req.json()
        task = body.get("task")
        input_data = body.get("input")

        if not task or not input_data:
            return JSONResponse(status_code=400, content={"error": "task ou input manquant"})

        response = requests.post(
            MISTRAL_API_URL,
            json={"task": task, "input": input_data},
            timeout=60
        )
        response.raise_for_status()
        return response.json()

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

