import { useState } from "react";
import "./App.css";
import FormularioAlumno from "./components/FormularioAlumno.jsx";
import ListaEstudiantes from "./components/ListaEstudiantes.jsx";

function App() {
  const [alumnos, setAlumnos] = useState([]);

  // estado de edición
  const [editIndex, setEditIndex] = useState(null);       
  const [alumnoEditando, setAlumnoEditando] = useState(null); 

  // Agregar
  const agregarAlumno = (nuevoAlumno) => {
    setAlumnos((prev) => [...prev, nuevoAlumno]);
  };

  // Preparar edición (desde la lista)
  const comenzarEdicion = (alumno, index) => {
    setEditIndex(index);
    setAlumnoEditando(alumno);
  };

  // Guardar cambios
  const guardarEdicion = (alumnoActualizado) => {
    setAlumnos((prev) =>
      prev.map((a, i) => (i === editIndex ? alumnoActualizado : a))
    );
    cancelarEdicion(); // limpiar estado
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditIndex(null);
    setAlumnoEditando(null);
  };

  // Eliminar
  const eliminarAlumno = (index) => {
    setAlumnos((prev) => prev.filter((_, i) => i !== index));
    
    if (editIndex === index) cancelarEdicion();
  };

  return (
    <div className="page">
      <div className="container">

        <div className="layout">
          {/* Izquierda: Formulario */}
          <div className="col">
            <div className="card">
              <h5 className="card-title">
                {editIndex !== null ? "Editar alumno" : "Formulario"}
              </h5>
              <FormularioAlumno
                agregarAlumno={agregarAlumno}
                isEditing={editIndex !== null}
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
              onEdit={comenzarEdicion}
              onDelete={eliminarAlumno}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
