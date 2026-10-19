# AeroMind AI — Air Quality Prediction

AeroMind AI is a machine-learning web application that predicts air-quality categories from weather and pollutant measurements. It combines a React frontend with a FastAPI backend and provides model predictions, prediction history, and SHAP-based feature explanations.

## Features

- Air-quality category prediction using a trained machine-learning model
- Weather and pollutant input form
- SHAP-based feature contribution explanations
- Prediction history and CSV export
- Interactive charts and history search
- React frontend and FastAPI backend

## Technology Stack

- **Frontend:** React, Chart.js
- **Backend:** Python, FastAPI
- **Machine Learning:** scikit-learn, NumPy, SHAP
- **Database:** MySQL Connector
- **Dataset:** Global Weather Repository dataset

## Project Structure

```text
AeroMind AI/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── dataset/
│   └── GlobalWeatherRepository.csv
├── frontend/
├── models/
│   └── aqi_model.pkl
├── notebooks/
└── .gitignore
```

## Setup

### 1. Backend

From the project root, create and activate a virtual environment:

```powershell
python -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

Start the API:

```powershell
uvicorn main:app --reload
```

Run that command from the `backend` directory.

The API should be available at `http://127.0.0.1:8000`.

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm start
```

The React development server should open in your browser.

## Model Notes

The application predicts air-quality categories from the input features used by the trained model. Predictions are estimates and should not be treated as official environmental monitoring measurements or health advice.

## Security

- Do not commit `.env` files, passwords, API keys, or database credentials.
- Keep local prediction history and virtual environments out of version control.
- Configure database credentials through environment variables.

## License

No license has been added yet. Add an appropriate license before allowing others to reuse the project.
