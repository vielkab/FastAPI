import { useState, useEffect } from 'react'
import './App.css'

// URL local por ahora. Cuando despliegues en AWS, cámbiala por la URL de App Runner
const API_URL = "https://backend-fastapi-app-env.eba-rdyaspgd.us-east-2.elasticbeanstalk.com";

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [editando, setEditando] = useState(null);
  const [tareaEditada, setTareaEditada] = useState("");

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
        headers: { "Content-Type": "application/json" },
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

  // 3. Iniciar edición de una tarea
  const iniciarEdicion = (tarea) => {
    setEditando(tarea.id);
    setTareaEditada(tarea.titulo);
  };

  // 4. Guardar cambios en la tarea editada
  const guardarEdicion = async (id) => {
    if (!tareaEditada.trim()) return;

    const tareaActual = tareas.find((t) => t.id === id);
    if (!tareaActual) return;

    const tareaActualizada = {
      id,
      titulo: tareaEditada,
      completada: tareaActual.completada
    };

    try {
      const response = await fetch(`${API_URL}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tareaActualizada)
      });

      if (response.ok) {
        setEditando(null);
        setTareaEditada("");
        cargarTareas();
      } else {
        const text = await response.text();
        console.error("Error al guardar edición:", response.status, text);
      }
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  };

  // 5. Cancelar edición
  const cancelarEdicion = () => {
    setEditando(null);
    setTareaEditada("");
  };

  // 6. Eliminar una tarea
  const eliminarTarea = async (id) => {
    try {
      await fetch(`${API_URL}/tareas/${id}`, { method: "DELETE" });
      cargarTareas(); // Refrescar la lista
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  // 7. Cambiar estado de una tarea (PATCH)
  const alternarTarea = async (id, estadoActual) => {
    try {
      await fetch(`${API_URL}/tareas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !estadoActual })
      });
      cargarTareas(); // Refrescar la lista
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
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
          <li key={tarea.id} style={{ 
            padding: '10px', 
            borderBottom: '1px solid #eee', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <span 
                onClick={() => alternarTarea(tarea.id, tarea.completada)}
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: tarea.completada ? 'line-through' : 'none',
                  color: tarea.completada ? 'gray' : 'black'
                }}
              >
                {tarea.completada ? '✅' : '🟩'}
                
              </span>

              {editando === tarea.id ? (
                <input
                  value={tareaEditada}
                  onChange={(e) => setTareaEditada(e.target.value)}
                  style={{ padding: '8px', width: '300px', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              ) : (
                <span style={{ flex: 1, cursor: 'default' }}>{tarea.titulo}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {editando === tarea.id ? (
                <>
                  <button
                    onClick={() => guardarEdicion(tarea.id)}
                    style={{ backgroundColor: '#11a28fb7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelarEdicion}
                    style={{ backgroundColor: '#999', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => iniciarEdicion(tarea)}
                    style={{ backgroundColor: '#11a28fb7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarTarea(tarea.id)}
                    style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
