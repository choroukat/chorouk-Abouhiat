# Wach Nqder? 🇲🇦 (واش نقدر؟)

> **Assistant Administratif Intelligent Marocain** — Aide les citoyens et étudiants à comprendre les démarches, préparer leurs checklists de documents officiels et rédiger leurs demandes administratives en Darija, Arabe et Français.

---

## 🔒 Avertissement & Transparence (Disclaimer)
**Application citoyenne indépendante.**
Cette application n'est affiliée à aucun organisme gouvernemental ni ministère marocain. Les informations proviennent de sources publiques officielles et doivent toujours être vérifiées auprès des administrations compétentes avant toute démarche.

---

## 🚀 Fonctionnalités Principales
- **🤖 Assistant IA RAG** : Réponses guidées par la base de données des démarches officielles marocaines (Faculté, Bourse Minhaty, Stage PFE, CNIE, Passeport, Permis, OFPPT, AMO Tadamon).
- **📋 Checklists Dynamiques** : Suivi des pièces requises avec calcul de progression et export PDF.
- **✍️ Générateur de Demandes Officielles** : Rédaction assistée de demandes de stage, d'inscription, d'attestation ou de retrait de diplôme en Français ou Arabe administratif.
- **📸 Scanner OCR de Documents** : Extraction optique des données de documents (optionnel, traitement sécurisé et suppression locale).
- **🇲🇦 Multilingue & RTL** : Support complet du Darija marocain, de l'Arabe littéraire (avec mise en page RTL native) et du Français.

---

## 💻 Installation & Lancement Local

### 1. Prérequis
- Node.js (v18+)
- Une clé API gratuite Google Gemini obtenue sur [Google AI Studio](https://aistudio.google.com).

### 2. Cloner le projet et installer les dépendances
```bash
git clone https://github.com/<your-username>/wach-nqder.git
cd wach-nqder
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine :
```bash
GEMINI_API_KEY="votre_cle_gemini"
GEMINI_MODEL="gemini-3.8-flash"
PORT=3000
```

### 4. Vérifier la connexion Gemini
```bash
npm run check:gemini
```

### 5. Lancer l'application en mode développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🛡️ Sécurité & Confidentialité
- **Helmet & En-têtes sécurisés** activés sur Express.
- **Limiteur de débit (Rate Limiting)** par adresse IP pour éviter les abus de quota.
- **Validation stricte des entrées** avec Zod sur chaque endpoint.
- **Aucune fausse donnée** : En l'absence de clé API ou en cas de dysfonctionnement, le serveur retourne une erreur explicite sans jamais inventer de fausses pièces d'identité.
- **Loi CNDP 09-08** : Toutes les données de documents sont stockées sur votre appareil et peuvent être supprimées définitivement en un clic.

---

## 📦 Scripts Disponibles
- `npm run dev` : Lance le serveur Express et l'environnement de développement Vite.
- `npm run build` : Compile l'application React pour la production.
- `npm run start` : Démarre le serveur Express en mode production.
- `npm run lint` : Vérifie la validité TypeScript sans émission de code.
- `npm run check:gemini` : Teste la validité de la clé API Gemini et du modèle configuré.
