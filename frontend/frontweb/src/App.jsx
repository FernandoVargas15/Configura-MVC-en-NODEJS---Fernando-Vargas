import { useEffect, useState } from "react";
import "./App.css";
import FormularioAlumno from "./components/FormularioAlumno.jsx";
import ListaEstudiantes from "./components/ListaEstudiantes.jsx";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API = `${BASE}/api/alumnos`;

function App() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoEditando, setAlumnoEditando] = useState(null); // objeto completo o null

  // Cargar lista al iniciar
  const cargar = async () => {
    try {
      const r = await fetch(API);
      const data = await r.json();
      setAlumnos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar alumnos:", e);
      setAlumnos([]);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // Crear
  const agregarAlumno = async (nuevoAlumno) => {
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoAlumno),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        alert(err.mensaje || "Error al crear alumno");
        return;
      }
      await cargar();
    } catch (e) {
      console.error(e);
      alert("No se pudo crear el alumno");
    }
  };

  // Editar (preparar)
  const comenzarEdicion = (alumno) => setAlumnoEditando(alumno);

  // Guardar edición (PUT)
  const guardarEdicion = async (alumnoActualizado) => {
    if (!alumnoEditando?.id) return;
    try {
      const r = await fetch(`${API}/${alumnoEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumnoActualizado),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        alert(err.mensaje || "Error al actualizar");
        return;
      }
      setAlumnoEditando(null);
      await cargar();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar");
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => setAlumnoEditando(null);

  // Eliminar (DELETE por id)
  const eliminarAlumno = async (id) => {
    if (!id) return;
    if (!confirm("¿Eliminar este estudiante?")) return;
    try {
      const r = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        alert(err.mensaje || "Error al eliminar");
        return;
      }
      await cargar();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="layout">
          {/* Izquierda: Formulario */}
          <div className="col">
            <div className="card">
              <h5 className="card-title">
                {alumnoEditando ? "Editar alumno" : "Formulario"}
              </h5>
              <FormularioAlumno
                agregarAlumno={agregarAlumno}
                isEditing={!!alumnoEditando}
                alumnoEditando={alumnoEditando}
                onUpdate={guardarEdicion}
                onCancelEdit={cancelarEdicion}
              />
            </div>
          </div>

          {/* Derecha: Lista */}
          <div className="col">
            <ListaEstudiantes
              students={alumnos}
              onEdit={comenzarEdicion}       // recibe objeto alumno
              onDelete={eliminarAlumno}      // recibe id
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
