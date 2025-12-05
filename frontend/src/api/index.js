export async function predecir(datos) {
  const res = await fetch("https://clinicaamanecer.onrender.com/predict/logistica", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}

export async function predecirArbol(datos) {
  const res = await fetch("https://clinicaamanecer.onrender.com/predict/arbol", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}
