import { useState } from "react";
import { predecir } from "./api";
import "./App.css";

export default function App() {
  const especialidades = {
    Neuropsicologia: 60,
    Psicoeducacion: 30,
    Psicologia_clinica: 35,
    Psicopedagogia: 80,
    Psicoterapia: 40,
  };

  const [form, setForm] = useState({
    canal_origen: 0,
    tiempo_respuesta: 0,
    num_interacciones: 0,
    precio: 60,
    dias_consulta: 0,
    especialidad: "Neuropsicologia",
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cambia precio automáticamente según especialidad
    if (name === "especialidad") {
      setForm({
        ...form,
        especialidad: value,
        precio: especialidades[value],
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const enviar = async (e) => {
    e.preventDefault();

    const datosEnviar = {
      canal_origen: Number(form.canal_origen),
      tiempo_respuesta: Number(form.tiempo_respuesta),
      num_interacciones: Number(form.num_interacciones),
      precio: Number(form.precio),
      dias_consulta: Number(form.dias_consulta),
    };

    const data = await predecir(datosEnviar);
    setResultado(data);
  };

  return (
    <div className="container">
      <h2 className="title">Predictivo de Conversión de Leads</h2>

      <form onSubmit={enviar} className="form">
        
        <label>Canal de Origen</label>
        <select name="canal_origen" onChange={handleChange}>
          <option value="0">Facebook</option>
          <option value="1">Instagram</option>
          <option value="2">TikTok</option>
          <option value="3">Página Web</option>
          <option value="4">WhatsApp</option>
        </select>

        <label>Especialidad</label>
        <select name="especialidad" onChange={handleChange}>
          {Object.keys(especialidades).map((esp) => (
            <option key={esp} value={esp}>
              {esp.replace("_", " ")}
            </option>
          ))}
        </select>

        <label>Precio</label>
        <input type="number" name="precio" value={form.precio} readOnly />

        <label>Tiempo de Respuesta (min)</label>
        <input type="number" name="tiempo_respuesta" onChange={handleChange} />

        <label>N° Interacciones</label>
        <input type="number" name="num_interacciones" onChange={handleChange} />

        <label>Días de Consulta</label>
        <input type="number" name="dias_consulta" onChange={handleChange} />

        <button className="btn">Predecir</button>
      </form>

      {resultado && (
        <div className="resultado">
          <h3>Resultado: <span>{resultado.mensaje}</span></h3>
          <p>
            Probabilidad:{" "}
            <strong>{(resultado.probabilidad * 100).toFixed(2)}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}
