import { useState } from "react";
import { predecir, predecirArbol } from "./api";
import "./App.css";

export default function App() {
  const especialidades = {
    Neuropsicologia: 60,
    Psicoeducacion: 30,
    Psicologia_clinica: 35,
    Psicopedagogia: 80,
    Psicoterapia: 40,
  };

  // FORMULARIO 1 (Regresión Logística)
  const [form1, setForm1] = useState({
    canal_origen: 0,
    tiempo_respuesta: 0,
    num_interacciones: 0,
    precio: 60,
    dias_consulta: 0,
    especialidad: "Neuropsicologia",
  });

  // FORMULARIO 2 (Árbol de Decisión)
  const [form2, setForm2] = useState({
    canal_origen: 0,
    tiempo_respuesta: 0,
    num_interacciones: 0,
    precio: 60,
    dias_consulta: 0,
    especialidad: "Neuropsicologia",
  });

  const [resultadoLog, setResultadoLog] = useState(null);
  const [resultadoArbol, setResultadoArbol] = useState(null);

  // CAMBIO DE CAMPOS — FORM 1
  const handleChange1 = (e) => {
    const { name, value } = e.target;

    if (name === "especialidad") {
      setForm1({
        ...form1,
        especialidad: value,
        precio: especialidades[value],
      });
    } else {
      setForm1({ ...form1, [name]: value });
    }
  };

  // CAMBIO DE CAMPOS — FORM 2
  const handleChange2 = (e) => {
    const { name, value } = e.target;

    if (name === "especialidad") {
      setForm2({
        ...form2,
        especialidad: value,
        precio: especialidades[value],
      });
    } else {
      setForm2({ ...form2, [name]: value });
    }
  };

  // SUBMIT FORM 1 (Regresión Logística)
  const enviar1 = async (e) => {
    e.preventDefault();

    const datos = {
      canal_origen: Number(form1.canal_origen),
      tiempo_respuesta: Number(form1.tiempo_respuesta),
      num_interacciones: Number(form1.num_interacciones),
      precio: Number(form1.precio),
      dias_consulta: Number(form1.dias_consulta),
    };

    const data = await predecir(datos);
    setResultadoLog(data);
  };

  // SUBMIT FORM 2 (Árbol de Decisión)
  const enviar2 = async (e) => {
    e.preventDefault();

    const datos = {
      canal_origen: Number(form2.canal_origen),
      tiempo_respuesta: Number(form2.tiempo_respuesta),
      num_interacciones: Number(form2.num_interacciones),
      precio: Number(form2.precio),
      dias_consulta: Number(form2.dias_consulta),
    };

    const data = await predecirArbol(datos);
    setResultadoArbol(data);
  };

  return (


    <div className="main-wrapper">
      <div className="formularios-doble">

        {/* ---------- FORMULARIO REGRESIÓN LOGÍSTICA ---------- */}
        <div className="container">
          <h2 className="title">Modelo: Regresión Logística</h2>

          <form onSubmit={enviar1} className="form">
            <label>Canal de Origen</label>
            <select name="canal_origen" onChange={handleChange1}>
              <option value="0">Facebook</option>
              <option value="1">Instagram</option>
              <option value="2">TikTok</option>
              <option value="3">Página Web</option>
              <option value="4">WhatsApp</option>
            </select>

            <label>Especialidad</label>
            <select name="especialidad" onChange={handleChange1}>
              {Object.keys(especialidades).map((esp) => (
                <option key={esp} value={esp}>
                  {esp.replace("_", " ")}
                </option>
              ))}
            </select>

            <label>Precio</label>
            <input type="number" name="precio" value={form1.precio} readOnly />

            <label>Tiempo de Respuesta (min)</label>
            <input type="number" name="tiempo_respuesta" onChange={handleChange1} />

            <label>N° Interacciones</label>
            <input type="number" name="num_interacciones" onChange={handleChange1} />

            <label>Días de Consulta</label>
            <input type="number" name="dias_consulta" onChange={handleChange1} />

            <button className="btn">Predecir Logística</button>
          </form>

          {resultadoLog && (
            <div className="resultado">
              <h3>Resultado: <span>{resultadoLog.mensaje}</span></h3>
              <p>
                Probabilidad:{" "}
                <strong>{(resultadoLog.probabilidad * 100).toFixed(2)}%</strong>
              </p>
            </div>
          )}
        </div>

        {/* ---------- FORMULARIO ÁRBOL DE DECISIÓN ---------- */}
        <div className="container">
          <h2 className="title">Modelo: Árbol de Decisión</h2>

          <form onSubmit={enviar2} className="form">
            <label>Canal de Origen</label>
            <select name="canal_origen" onChange={handleChange2}>
              <option value="0">Facebook</option>
              <option value="1">Instagram</option>
              <option value="2">TikTok</option>
              <option value="3">Página Web</option>
              <option value="4">WhatsApp</option>
            </select>

            <label>Especialidad</label>
            <select name="especialidad" onChange={handleChange2}>
              {Object.keys(especialidades).map((esp) => (
                <option key={esp} value={esp}>
                  {esp.replace("_", " ")}
                </option>
              ))}
            </select>

            <label>Precio</label>
            <input type="number" name="precio" value={form2.precio} readOnly />

            <label>Tiempo de Respuesta (min)</label>
            <input type="number" name="tiempo_respuesta" onChange={handleChange2} />

            <label>N° Interacciones</label>
            <input type="number" name="num_interacciones" onChange={handleChange2} />

            <label>Días de Consulta</label>
            <input type="number" name="dias_consulta" onChange={handleChange2} />

            <button className="btn">Predecir Árbol</button>
          </form>

          {resultadoArbol && (
            <div className="resultado">
              <h3>Resultado: <span>{resultadoArbol.mensaje}</span></h3>
              <p>
                Probabilidad:{" "}
                <strong>{(resultadoArbol.probabilidad * 100).toFixed(2)}%</strong>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>

  );
}
