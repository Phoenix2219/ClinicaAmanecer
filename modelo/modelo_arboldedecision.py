import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix

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

# Arbol de decisión
modelo = DecisionTreeClassifier(random_state = 2, max_depth = 3) # max_depth es un hyperparametro
modelo.fit(X_train, y_train)

y_pred = modelo.predict(X_test)
cm = confusion_matrix(y_test, y_pred) # accuracy = (101 + 44)/(101 + 11 + 23 + 44) = 81%
acc = accuracy_score(y_test, y_pred)

print(f"Matriz de Confusión:\n{cm}")
print(f"Accuracy: {acc:.2f}")

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

proba = modelo.predict_proba(nuevo)[0]
print("Probabilidad por clase:", proba)

print(modelo.predict(nuevo))

with open("../backend/modeloarbol.pkl", "wb") as file:
    pickle.dump(modelo, file)
