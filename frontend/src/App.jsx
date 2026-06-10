import { useState, useEffect } from 'react'
import './App.css'

// URL local por ahora. Cuando despliegues en AWS, cámbiala por la URL de App Runner
const API_URL = "http://localhost:8080";

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  // 1. Obtener tareas del backend (AWS)
  const cargarTareas = async () => {
    try {
      const response = await fetch(`${API_URL}/tareas`);
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error("Error al conectar con el backend de AWS:", error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  // 2. Enviar una nueva tarea al backend (AWS)
  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    const objetoTarea = {
      id: Date.now(),
      titulo: nuevaTarea,
      completada: false
    };

    try {
      const response = await fetch(`${API_URL}/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/飲食json", "Content-Type": "application/json" },
        body: JSON.stringify(objetoTarea)
      });

      if (response.ok) {
        setNuevaTarea("");
        cargarTareas(); // Recargar la lista para ver el cambio reflejado
      }
    } catch (error) {
      console.error("Error al enviar la tarea:", error);
    }
  };

  return (
    <div className="container">
      <h1>Lista de Tareas Multinube</h1>
      <p style={{ color: '#888' }}>Frontend corriendo en <b>Google Cloud Run</b></p>
      <p style={{ color: '#ff9900' }}>Consumiendo API de <b>Amazon Web Services (AWS)</b></p>

      <form onSubmit={agregarTarea} style={{ margin: '20px 0' }}>
        <input 
          type="text" 
          value={nuevaTarea} 
          onChange={(e) => setNuevaTarea(e.target.value)} 
          placeholder="Escribe una nueva tarea..."
          style={{ padding: '10px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Agregar Tarea</button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tareas.map((tarea) => (
          <li key={tarea.id} style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '18px' }}>
            🟩 {tarea.titulo}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App