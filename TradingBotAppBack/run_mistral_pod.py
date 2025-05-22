import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RUNPOD_API_KEY")
POD_ID = os.getenv("RUNPOD_POD_ID")
MISTRAL_API = f"https://{POD_ID}-8000.proxy.runpod.net/analyze"
GRAPHQL_URL = "https://api.runpod.io/graphql"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# 1️⃣ Vérifie que le pod est bien configuré avec GPU
def check_gpu_config():
    query = {
        "query": """
        query GetPod($id: ID!) {
            pod(id: $id) {
                id
                name
                gpuCount
                gpuTypeId
                status
            }
        }
        """,
        "variables": {"id": POD_ID}
    }

    r = requests.post(GRAPHQL_URL, headers=HEADERS, json=query)
    data = r.json().get("data", {}).get("pod", {})
    gpu_count = data.get("gpuCount", 0)
    status = data.get("status", "UNKNOWN")

    print(f"🔍 Pod status: {status}, GPU count: {gpu_count}")
    if gpu_count == 0:
        raise Exception("❌ Ce pod n'a pas de GPU attaché. Abandon du démarrage.")
    return status

# 2️⃣ Lance le pod s’il est stoppé
def start_pod():
    print("🚀 Démarrage du pod via RunPod...")
    mutation = {
        "query": """
        mutation StartPod($podId: ID!) {
            podStart(input: { podId: $podId }) {
                id
                desiredStatus
            }
        }
        """,
        "variables": {"podId": POD_ID}
    }
    r = requests.post(GRAPHQL_URL, headers=HEADERS, json=mutation)
    result = r.json()
    if "errors" in result:
        raise Exception("❌ Erreur au démarrage du pod :", result["errors"])
    print("✅ Pod en cours de démarrage...")

# 3️⃣ Attend que le pod soit RUNNING
def wait_for_pod_running(max_attempts=30):
    print("⏳ Attente que le pod passe en RUNNING...")
    for _ in range(max_attempts):
        query = {
            "query": """
            query GetPod($id: ID!) {
                pod(id: $id) {
                    status
                }
            }
            """,
            "variables": {"id": POD_ID}
        }
        r = requests.post(GRAPHQL_URL, headers=HEADERS, json=query)
        status = r.json().get("data", {}).get("pod", {}).get("status", "")
        print(f"   ➤ État actuel : {status}")
        if status == "RUNNING":
            print("✅ Pod est maintenant RUNNING.")
            return True
        time.sleep(10)
    raise Exception("❌ Le pod ne démarre pas après plusieurs tentatives.")

# 4️⃣ Vérifie que l'API Mistral répond
def wait_for_mistral_api(max_attempts=30):
    print(f"⏳ Attente de la disponibilité de l'API Mistral sur {MISTRAL_API}")
    for _ in range(max_attempts):
        try:
            r = requests.post(MISTRAL_API, json={"inputs": "Health check"}, timeout=10)
            if r.status_code == 200 and "outputs" in r.json():
                print("✅ L'API Mistral est prête à recevoir des requêtes.")
                return True
        except Exception as e:
            print("   ➤ En attente de réponse API...")
        time.sleep(10)
    raise Exception("❌ L'API Mistral ne répond pas après plusieurs tentatives.")

# 🔁 Orchestration complète
def main():
    try:
        status = check_gpu_config()
        if status == "STOPPED":
            start_pod()
        if status != "RUNNING":
            wait_for_pod_running()
        wait_for_mistral_api()
        print("🎯 Pod Mistral prêt pour enrich_sent_mistral.py")

    except Exception as e:
        print(str(e))

if __name__ == "__main__":
    main()
