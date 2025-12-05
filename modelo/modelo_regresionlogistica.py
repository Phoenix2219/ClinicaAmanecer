import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
data = pd.read_csv('datos.csv', encoding='latin-1')
data.head()
print(data.shape)

data = data[['canal_origen','estado_lead','tiempo_respuesta','num_interacciones','precio','dias_consulta']]
data.head(10)

data['canal_origen'] = data['canal_origen'].map( {'Facebook':0,'Instagram':1,'TikTok':2,'Web':3,'WhatsApp':4} )
data['estado_lead'] = data['estado_lead'].map( {'Cita agendada':0,'Informacion':1} )
#data['especialidad'] = data['especialidad'].map( {'Neuropsicologia':0,'Psicoeducacion':1,'Psicologia clinica':2,'Psicopedagogia':3,'Psicoterapia':4,'Psiquiatria general':5,'Psiquiatria geriatrica':6,'Psiquiatria infantil y del adolescente':7,'Rehabilitacion psicosocial':8,'Terapia de pareja y familiar':9} )

data.isnull().sum()
data.info()

print(data.head(10))

# Variable dependiente y covariables (variables independientes)
X = data.drop('estado_lead',axis=1) # covariables
y = data['estado_lead'] # variable dependiente --> Tag - Lo que quiero predecir

# Dividir data en train y test
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state =1) # 25% base de test

# Regresión logistica
from sklearn.linear_model import LogisticRegression
lr = LogisticRegression(class_weight="balanced", max_iter=2000)
lr.fit(X_train, y_train)
print(lr.intercept_) # Beta 0 - Segun Y
print(lr.coef_) # Beta 1,...,Beta 5 - Segun X

# Evaluación del modelo - Procentaje de acierto del modelo tiene que ser mayor a 80 el accuracy
y_pred = lr.predict(X_test)
from sklearn.metrics import confusion_matrix # genera matriz de confusion
confusion_matrix(y_test, y_pred)

from sklearn.metrics import accuracy_score # Obtiene metrica accuracy
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")

from sklearn.metrics import classification_report # Genera todas las metricas
print(f"Reporte: {classification_report(y_test, y_pred)}")

# Predicciones a partir del uso del modelo
print(lr.predict_proba(X_test)[:,1]) # Obtiene probabilidades que sean clasificados 1
print(lr.predict(X_test)) # Clasifica en funcion de las probabilidades punto corte 0.5

diccionario = {'Probabilidad':lr.predict_proba(X_test)[:,1],
               'Clasif. Real':y_test,
               'Clasif. Pronostico':lr.predict(X_test)}
pd.DataFrame(diccionario)


'''nuevo = pd.DataFrame([{
    'canal_origen': 0,
    'tiempo_respuesta': 20,
    'num_interacciones': 1,
    'precio': 80,
    'dias_consulta': 7
}]) #[1] Informacion'''


nuevo = pd.DataFrame([{
    'canal_origen': 4,
    'tiempo_respuesta': 14,
    'num_interacciones': 4,
    'precio': 35,
    'dias_consulta': 7
}]) #[0] Genera cita

print(lr.predict_proba(nuevo))
print(lr.predict(nuevo))

with open("../backend/modelo.pkl", "wb") as file:
    pickle.dump(lr, file)
