import os
import json
from deep_translator import GoogleTranslator
from tqdm import tqdm

# === Dossiers ===
BASE_DIR = os.path.dirname(__file__)
INPUT_DIR = os.path.join(BASE_DIR, "output", "insights_enriched_all")
OUTPUT_DIR = os.path.join(BASE_DIR, "translated_jsons")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Limite à 20 entreprises pour le test
N = 20

# === Fonction de traduction ===
def translate_text_to_french(text):
    try:
        return GoogleTranslator(source="auto", target="fr").translate(text)
    except Exception as e:
        print(f"⚠️ Erreur de traduction : {e}")
        return None

# === Pipeline de traitement ===
def main():
    files = [f for f in os.listdir(INPUT_DIR) if f.endswith(".json")][:N]
    print(f"🔁 Traduction de {len(files)} fichiers...")

    for filename in tqdm(files, desc="Traduction summary → summaryfr"):
        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)

        try:
            with open(input_path, "r") as f:
                data = json.load(f)

            if "summary" in data and data["summary"]:
                translated = translate_text_to_french(data["summary"])
                if translated:
                    data["summaryfr"] = translated
                else:
                    print(f"⚠️ Traduction échouée pour {filename}")
            else:
                print(f"⏭️ Aucun champ 'summary' dans {filename}")

            # Enregistrement du fichier dans le dossier de sortie
            with open(output_path, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

        except Exception as e:
            print(f"❌ Erreur sur {filename} → {e}")

    print(f"\n✅ Résultats sauvegardés dans : {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
