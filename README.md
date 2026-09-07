\# AI-Powered Email Threat Detection Platform



\## SIH 2026 — SIH26106



An AI-powered cybersecurity platform for detecting suspicious and malicious emails using machine learning, email authentication analysis, URL analysis, relay analysis, and IP intelligence.



\## Features



\- AI/ML-based email threat detection

\- SPF, DKIM and DMARC analysis

\- Reply-To mismatch detection

\- Suspicious URL detection

\- Email relay/header analysis

\- IP address classification

\- IP geolocation using IP2Location

\- Hybrid ML + forensic risk scoring

\- MongoDB storage

\- Simple web-based interface



\## Project Structure



```text

email-threat-platform/

│

├── backend/

│   ├── routes/

│   ├── services/

│   ├── models/

│   └── database/

│

├── frontend/

│   ├── index.html

│   ├── style.css

│   └── script.js

│

├── ml/

│   ├── dataset/

│   ├── models/

│   ├── preprocessing/

│   ├── prepare\_data.py

│   ├── train\_model.py

│   ├── predictor.py

│   └── ml\_api.py

│

├── .gitignore

└── README.md

