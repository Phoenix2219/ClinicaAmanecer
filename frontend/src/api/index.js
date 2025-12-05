export async function predecir(datos) {
  const res = await fetch("https://clinicaamanecer.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return res.json();
}
