from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import pickle
from fastapi.middleware.cors import CORSMiddleware
import pickle, os

# ----------- CONFIG FASTAPI ------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- CARGAR MODELO ------------
ruta_modelo = os.path.join(os.path.dirname(__file__), "modelo.pkl")
with open(ruta_modelo, "rb") as file:
    modelo = pickle.load(file)

# ----------- MODELO DE DATOS DEL REQUEST -----------
class InputData(BaseModel):
    canal_origen: int
    tiempo_respuesta: float
    num_interacciones: float
    precio: float
    dias_consulta: float

# ----------- ENDPOINT -----------
@app.post("/predict")
def predict(data: InputData):
    df = pd.DataFrame([data.dict()])

    prob = modelo.predict_proba(df)[0][1]
    pred = modelo.predict(df)[0]

    return {
        "prediccion": int(pred),
        "probabilidad": float(prob),
        "mensaje": "Información" if pred == 1 else "Cita Agendada"
    }
