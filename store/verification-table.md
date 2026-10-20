# Official Moroccan Administrative Procedures Verification Table

> **Important**: This table contains all administrative procedures currently registered in `src/data/procedures.ts`.
> To prevent misinformation and comply with official Moroccan administrative regulations, **do not release Phase 4 while any procedure showing a fee or official requirement is still marked "Unverified"**, unless you explicitly accept that risk.
>
> When you verify a procedure on its official government portal, tell me:
> 1. The procedure ID (e.g. `proc_cnie_carte_nationale`)
> 2. The date you verified it (e.g. `2026-10-18`)
> 3. Any corrections needed to the fee, required documents, or appointment requirements.
> I will then update the code and set `verificationStatus: 'verified'` and `userVerificationDate`.

---

| ID | Title (FR) | Fee (MAD) | Required Documents | Location | Appt. Req. | Official Source URL | Last Code Date | My Verification Date | Status |
|---|---|---|---|---|---|---|---|---|---|
| `proc_univ_inscription` | Inscription Universitaire (Facultés & Accès Ouvert) | 0 DH | Diplôme original Bac, 4 copies certifiées Bac, 3 copies CNIE, 4 photos identité, Reçu préinscription en ligne, Dossier médical scolaire | Service de scolarité de la faculté concernée | Non | https://www.enssup.gov.ma | 2026-09-01 | _Pending_ | ⚠️ Unverified |
| `proc_stage_pfe` | Convention et Demande de Stage (Stage d’initiation / PFE) | 0 DH | Demande de stage, Convention tripartite (3x), Attestation assurance responsabilité civile, CV, Copie carte étudiant | Administration établissement & Entreprise d’accueil | Non | https://www.enssup.gov.ma | 2026-03-15 | _Pending_ | ⚠️ Unverified |
| `proc_minhaty` | Bourse d’Enseignement Supérieur (Portail Minhaty - منحتي) | 0 DH | N° CNIE candidat, Code MASSAR, Identifiant RSU/IDCS, Renseignements revenus parents (DGI) | Portail minhaty.ma & Préfecture | Non | https://www.minhaty.ma | 2026-05-10 | _Pending_ | ⚠️ Unverified |
| `proc_cnie_carte_nationale` | Carte d’Identité Nationale Électronique (CNIE 2ème Génération) | 75 DH | Extrait acte naissance ou livret état civil, Certificat résidence police/gendarmerie, 2 photos réglementaires 35x45mm, Quittance timbre 75 DH, Ancienne CNIE si renouvellement | Centre d'enregistrement DGSN | Oui (cnie.ma) | https://www.cnie.ma | 2026-02-01 | _Pending_ | ⚠️ Unverified |
| `proc_passeport_biometrique` | Passeport Biométrique Marocain | 500 DH | Formulaire imprimé signé passeport.ma, Photocopie CNIE valide, 2 photos ICAO 35x45mm, Timbre électronique 500 DH (300 DH mineur), Ancien passeport si renouvellement | Annexe administrative (Al Mouqata'a) / Caïdat | Non | https://www.passeport.ma | 2026-01-10 | _Pending_ | ⚠️ Unverified |
| `proc_permis_conduire` | Permis de Conduire (Catégorie B - Véhicules Légers) | 450 DH | Certificat médical aptitude (-3 mois), Copie certifiée CNIE (2x), 3 photos fond bleu clair, Quittance droits examen & timbre 450 DH | Auto-école agréée & Centre NARSA | Oui | https://narsa.gov.ma | 2026-01-20 | _Pending_ | ⚠️ Unverified |
| `proc_attestation_scolarite` | Attestation de Scolarité et Relevé de Notes Officiel | 0 DH | Carte d’étudiant de l'année, Reçu d'inscription, Copie CNIE | Service scolarité faculté ou lycée | Non | https://www.enssup.gov.ma | 2026-02-15 | _Pending_ | ⚠️ Unverified |
| `proc_legalisation_copies` | Légalisation de Signature et Certification Conforme (Al Mouqata’a) | 2 DH | Document original à signer devant agent, CNIE originale valide | Annexe administrative (Al Mouqata'a) | Non | https://www.idarati.ma | 2026-01-05 | _Pending_ | ⚠️ Unverified |
| `proc_ofppt_inscription` | Inscription en Formation Professionnelle (OFPPT / ISTA / ITA) | 50 DH | Formulaire takwine.ofppt.ma, Copie certifiée Bac/certificat scolarité (2x), Relevé notes Bac, Copie CNIE (2x), 2 photos, Frais dossier 50 DH | Institut ISTA / ITA de 1er choix | Non | https://www.ofppt.ma | 2026-04-12 | _Pending_ | ⚠️ Unverified |
| `proc_amo_tadamon` | Assurance Maladie Obligatoire (AMO Tadamon / Ex-RAMED) | 0 DH | Score RSU éligible (< 9.326), Copies CNIE des membres majeurs | macnss.ma & Agences CNSS / Cash Plus | Non | https://www.macnss.ma | 2026-03-01 | _Pending_ | ⚠️ Unverified |
| `proc_logement_onousc` | Logement en Cité Universitaire (ONOUSC) | 50 DH | Reçu logement.onousc.ma, Copie CNIE étudiant & parents, Attestation revenu global DGI parents, Attestation inscription fac, 4 photos | Cité Universitaire publique | Non | https://logement.onousc.ma | 2026-08-15 | _Pending_ | ⚠️ Unverified |
| `proc_retrait_diplome` | Retrait Définitif du Diplôme Universitaire Original | 0 DH | Attestation réussite provisoire originale, Quitus bibliothèque universitaire, CNIE originale, Carte étudiant originale | Service des diplômes faculté / Présidence | Non | https://www.enssup.gov.ma | 2026-03-20 | _Pending_ | ⚠️ Unverified |

---

## What to Check for Each Official Portal:

1. **`https://www.cnie.ma` (DGSN)**:
   - Check current timbre fee (75 MAD).
   - Check if appointment is mandatory at the local police station or identity center.
   - Check list of required documents (birth certificate / RNP exemption, residence certificate, photos).

2. **`https://www.passeport.ma` (Ministère de l'Intérieur)**:
   - Check timbre fee (500 MAD adult / 300 MAD minor).
   - Check electronic stamp code delivery via SMS and form submission.

3. **`https://www.minhaty.ma` and `https://www.rsu.ma`**:
   - Check RSU (Registre Social Unifié) prerequisite requirement.
   - Confirm application window for new Bac holders.

4. **`https://narsa.gov.ma` (NARSA)**:
   - Check exam rights fee and medical checkup requirements.

5. **`https://www.idarati.ma` (Idarati - Loi 55-19)**:
   - Check signature legalization fee (2 MAD per signature).
   - Confirm abolition of unjustified certified copies.

6. **`https://www.macnss.ma` (CNSS - AMO Tadamon)**:
   - Check eligibility criteria based on the RSU threshold (score < 9.326).
