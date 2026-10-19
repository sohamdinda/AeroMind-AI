
# Import Libraries
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error
import pickle
import shap
import os
import csv
import numpy as np
from datetime import datetime
from unidecode import unidecode

# Create FastAPI App
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load Saved Machine Learning Model
with open("../models/aqi_model.pkl", "rb") as file:
    model = pickle.load(file)

# SHAP Explainer
explainer = shap.TreeExplainer(model)

# Load Environment Variables
load_dotenv()

# MySQL Connection Details
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# MySQL Connection
connection = None
cursor = None


def connect_db():
    global connection, cursor

    try:
        if connection is not None and connection.is_connected():
            return True

        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            connection_timeout=5
        )

        cursor = connection.cursor()
        print("MySQL Connected Successfully!")
        return True

    except Error as e:
        connection = None
        cursor = None
        print(f"MySQL Database Error: {e}")
        return False


# AQI Labels
aqi_labels = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
}

# Feature Names
feature_names = [
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Pressure",
    "Rainfall",
    "PM2.5",
    "PM10",
    "Carbon Monoxide",
    "Nitrogen Dioxide",
    "Ozone",
    "Sulphur Dioxide"
]


# Home Route
@app.get("/")
def home():
    return {"message": "AeroMind AI Backend Running"}


# Prediction Route
@app.get("/predict")
def predict_aqi(
    temperature: float,
    humidity: float,
    wind_kph: float,
    pressure_mb: float,
    precip_mm: float,
    pm25: float,
    pm10: float,
    carbon_monoxide: float,
    nitrogen_dioxide: float,
    ozone: float,
    sulphur_dioxide: float,
    location: str = "Unknown"
):
    # Validate Input Values
    if not -90 <= temperature <= 60:
        raise HTTPException(
            status_code=400,
            detail="Temperature must be between -90 and 60°C."
        )

    if not 0 <= humidity <= 100:
        raise HTTPException(
            status_code=400,
            detail="Humidity must be between 0 and 100%."
        )

    if not 0 <= wind_kph <= 400:
        raise HTTPException(
            status_code=400,
            detail="Wind speed must be between 0 and 400 kph."
        )

    if not 800 <= pressure_mb <= 1200:
        raise HTTPException(
            status_code=400,
            detail="Pressure must be between 800 and 1200 mb."
        )

    if precip_mm < 0:
        raise HTTPException(
            status_code=400,
            detail="Rainfall cannot be negative."
        )

    if any(value < 0 for value in [
        pm25, pm10, carbon_monoxide,
        nitrogen_dioxide, ozone, sulphur_dioxide
    ]):
        raise HTTPException(
            status_code=400,
            detail="Pollutant values cannot be negative."
        )

    # Create Input Sample
    sample = [[
        temperature,
        humidity,
        wind_kph,
        pressure_mb,
        precip_mm,
        pm25,
        pm10,
        carbon_monoxide,
        nitrogen_dioxide,
        ozone,
        sulphur_dioxide
    ]]

    # Predict AQI BEFORE calculating SHAP values
    prediction = int(model.predict(sample)[0])

    # Calculate SHAP Explanation
    try:
        shap_output = explainer.shap_values(
            np.asarray(sample, dtype=float)
        )

        # Handle different SHAP output formats
        if isinstance(shap_output, list):
            class_index = prediction - 1
            class_shap_values = np.asarray(
                shap_output[class_index]
            )[0]

        else:
            shap_array = np.asarray(shap_output)

            if shap_array.ndim == 3:
                # Common format: samples, features, classes
                if shap_array.shape[1] == len(feature_names):
                    class_shap_values = shap_array[
                        0, :, prediction - 1
                    ]
                else:
                    # Alternative: classes, samples, features
                    class_shap_values = shap_array[
                        prediction - 1, 0, :
                    ]

            elif shap_array.ndim == 2:
                # Single output: samples, features
                class_shap_values = shap_array[0]

            else:
                raise ValueError(
                    f"Unexpected SHAP output shape: {shap_array.shape}"
                )

        class_shap_values = np.asarray(
            class_shap_values
        ).reshape(-1)

        if len(class_shap_values) != len(feature_names):
            raise ValueError(
                "SHAP feature count does not match model inputs."
            )

        shap_contributions = [
            {
                "Feature": feature_names[i],
                "Value": float(sample[0][i]),
                "Impact": float(class_shap_values[i])
            }
            for i in range(len(feature_names))
        ]

        # Largest absolute SHAP impacts first
        shap_contributions.sort(
            key=lambda item: abs(item["Impact"]),
            reverse=True
        )

        top_shap_contributions = shap_contributions[:5]

    except Exception as e:
        print(f"SHAP explanation error: {e}")
        top_shap_contributions = []

    # Existing Global Feature Importance
    importance = model.feature_importances_

    feature_importance = dict(
        zip(feature_names, importance)
    )

    sorted_features = sorted(
        feature_importance.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_factors = [
        feature[0]
        for feature in sorted_features[:3]
    ]

    # Save Prediction Into MySQL
    sql = """
    INSERT INTO predictions
    (
        timestamp,
        location,
        aqi_value,
        aqi_status,
        temperature,
        humidity,
        pm25,
        pm10
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        datetime.now(),
        location,
        prediction,
        aqi_labels[prediction],
        temperature,
        humidity,
        pm25,
        pm10
    )

    history_saved = False

    try:
        if connect_db():
            cursor.execute(sql, values)
            connection.commit()
            history_saved = True
            print("Prediction saved to MySQL.")

    except Error as e:
        print(f"Could not save prediction: {e}")

        try:
            if connection and connection.is_connected():
                connection.rollback()
        except Error:
            pass

    # Return Prediction and SHAP Explanation
    return {
        "AQI_Value": prediction,
        "AQI_Status": aqi_labels[prediction],
        "Top_Factors": top_factors,
        "SHAP_Contributions": top_shap_contributions,
        "History_Saved": history_saved
    }


# History Route
@app.get("/history")
def get_history():
    if not connect_db():
        return []

    try:
        cursor.execute("""
            SELECT id, timestamp, location, aqi_value, aqi_status,
                   temperature, humidity, pm25, pm10
            FROM predictions
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()
        history = []

        for row in rows:
            history.append({
                "id": row[0],
                "timestamp": row[1],
                "location": row[2],
                "AQI_Value": row[3],
                "AQI_Status": row[4],
                "Temperature": row[5],
                "Humidity": row[6],
                "PM25": row[7],
                "PM10": row[8]
            })

        return history

    except Error as e:
        print(f"Could not load prediction history: {e}")
        return []


# Delete One Prediction
@app.delete("/delete/{prediction_id}")
def delete_prediction(prediction_id: int):
    if not connect_db():
        return {
            "success": False,
            "message": "Database unavailable"
        }

    try:
        cursor.execute(
            "DELETE FROM predictions WHERE id = %s",
            (prediction_id,)
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {
                "success": False,
                "message": "Prediction not found"
            }

        return {
            "success": True,
            "message": "Prediction deleted successfully"
        }

    except Error as e:
        print(f"Could not delete prediction: {e}")

        try:
            connection.rollback()
        except Error:
            pass

        return {
            "success": False,
            "message": "Could not delete prediction"
        }


# Delete All Predictions
@app.delete("/delete_all")
def delete_all():
    if not connect_db():
        return {
            "success": False,
            "message": "Database unavailable"
        }

    try:
        cursor.execute("DELETE FROM predictions")
        connection.commit()

        return {
            "success": True,
            "message": "All predictions deleted successfully"
        }

    except Error as e:
        print(f"Could not delete history: {e}")

        try:
            connection.rollback()
        except Error:
            pass

        return {
            "success": False,
            "message": "Could not delete history"
        }


# Export History as CSV
@app.get("/export")
def export_history():
    if not connect_db():
        return {
            "success": False,
            "message": "Database unavailable"
        }

    try:
        cursor.execute("""
            SELECT timestamp, location, aqi_value, aqi_status,
                   temperature, humidity, pm25, pm10
            FROM predictions
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()
        filename = "prediction_history.csv"

        with open(
            filename,
            "w",
            newline="",
            encoding="utf-8-sig"
        ) as file:
            writer = csv.writer(file)

            writer.writerow([
                "Timestamp", "Location", "AQI", "Status",
                "Temperature", "Humidity", "PM2.5", "PM10"
            ])

            for row in rows:
                row = list(row)

                if row[1]:
                    row[1] = unidecode(str(row[1]))

                writer.writerow(row)

        return FileResponse(
            filename,
            media_type="text/csv",
            filename=filename
        )

    except Exception as e:
        print(f"CSV export error: {e}")
        return {
            "success": False,
            "message": str(e)
        }
