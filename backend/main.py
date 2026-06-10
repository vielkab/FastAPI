from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="API de Tareas - AWS Backend",
    description="Backend en AWS que expone una lista de tareas y su documentación",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos para las tareas
class Tarea(BaseModel):
    id: int
    titulo: str
    completada: bool

# Base de datos simulada en memoria
base_de_datos_tareas = [
    {"id": 1, "titulo": "Aprender despliegues en AWS App Runner", "completada": False},
    {"id": 2, "titulo": "Configurar Google Cloud Run para Frontend", "completada": False},
    {"id": 3, "titulo": "Automatizar todo con CI/CD", "completada": False}
]

@app.get("/")
def inicio():
    return {"status": "online", "mensaje": "Servidor FastAPI funcionando desde AWS"}

# Endpoint para obtener todas las tareas
@app.get("/tareas", response_model=List[Tarea])
def obtener_tareas():
    return base_de_datos_tareas

# Endpoint para agregar una nueva tarea
@app.post("/tareas", response_model=Tarea)
def crear_tarea(tarea: Tarea):
    base_de_datos_tareas.append(tarea.dict())
    return tarea