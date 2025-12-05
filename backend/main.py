from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import pickle
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- CARGA DE MODELOS -----------
ruta_regresion = os.path.join(os.path.dirname(__file__), "modelo.pkl")
ruta_arbol = os.path.join(os.path.dirname(__file__), "modeloarbol.pkl")

with open(ruta_regresion, "rb") as file:
    modelo = pickle.load(file)

with open(ruta_arbol, "rb") as file:
    modelo_arbol = pickle.load(file)

# ----------- ESTRUCTURA DEL REQUEST -----------
class InputData(BaseModel):
    canal_origen: int
    tiempo_respuesta: float
    num_interacciones: float
    precio: float
    dias_consulta: float

# ----------- ENDPOINT 1: REGRESIÓN LOGÍSTICA -----------
@app.post("/predict/logistica")
def predict_logistica(data: InputData):
    df = pd.DataFrame([data.dict()])

    prob = modelo.predict_proba(df)[0][1]
    pred = modelo.predict(df)[0]

    return {
        "modelo": "Regresión Logística",
        "prediccion": int(pred),
        "probabilidad": float(prob),
        "prob_porcentaje": round(prob * 100, 2),
        "mensaje": "Información" if pred == 1 else "Cita Agendada",
    }

# ----------- ENDPOINT 2: ÁRBOL DE DECISIÓN -----------
@app.post("/predict/arbol")
def predict_arbol(data: InputData):
    df = pd.DataFrame([data.dict()])

    pred = modelo_arbol.predict(df)[0]

    return {
        "modelo": "Árbol de Decisión",
        "prediccion": int(pred),
        "probabilidad": None,  # El árbol no tiene predict_proba si no lo entrenaste con eso
        "mensaje": "Información" if pred == 1 else "Cita Agendada",
    }

