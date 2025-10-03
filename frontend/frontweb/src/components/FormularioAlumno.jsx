import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const FormularioAlumno = ({
  agregarAlumno,
  isEditing = false,
  alumnoEditando = null,
  onUpdate = () => {},
  onCancelEdit = () => {},
}) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [sexo, setSexo] = useState("masculino");
  const [hablaIngles, setHablaIngles] = useState(false);

  // Cargar datos al entrar en modo edición
  useEffect(() => {
    if (isEditing && alumnoEditando) {
      setNombre(alumnoEditando.nombre_alumno || "");
      setEmail(alumnoEditando.email_alumno || "");
      setCurso(alumnoEditando.curso_alumno || "");
      setSexo(alumnoEditando.sexo_alumno || "masculino");
      setHablaIngles(!!alumnoEditando.hablaIngles);
    } else {
      // limpiar si se cancela o no hay edición
      setNombre("");
      setEmail("");
      setCurso("");
      setSexo("masculino");
      setHablaIngles(false);
    }
  }, [isEditing, alumnoEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre_alumno: nombre.trim(),
      email_alumno: email.trim(),
      curso_alumno: curso,
      sexo_alumno: sexo,
      hablaIngles,
    };

    if (isEditing) {
      onUpdate(payload); // guardar cambios
    } else {
      agregarAlumno(payload); // crear nuevo
    }

    // si no estás en edición, limpia el formulario
    if (!isEditing) {
      setNombre("");
      setEmail("");
      setCurso("");
      setSexo("masculino");
      setHablaIngles(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="mb-3">
        <label className="form-label">Nombre del Alumno</label>
        <input
          type="text"
          name="nombre_alumno"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email del Alumno</label>
        <input
          type="email"
          name="email_alumno"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Seleccione el curso</label>
        <select
          name="curso_alumno"
          className="form-select"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          required
        >
          <option value="">Seleccione el curso</option>
          <option value="ReactJS">ReactJS</option>
          <option value="Python">Python</option>
          <option value="NodeJS">NodeJS</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Sexo del alumno</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sexo_alumno"
            id="masculino"
            value="masculino"
            checked={sexo === "masculino"}
            onChange={(e) => setSexo(e.target.value)}
            required
          />
          <label className="form-check-label" htmlFor="masculino">
            Masculino
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sexo_alumno"
            id="femenino"
            value="femenino"
            checked={sexo === "femenino"}
            onChange={(e) => setSexo(e.target.value)}
          />
          <label className="form-check-label" htmlFor="femenino">
            Femenino
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">¿Hablas Inglés?</label>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="habla_ingles"
            id="ingles"
            checked={hablaIngles}
            onChange={(e) => setHablaIngles(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="ingles">
            {hablaIngles ? "Sí" : "No"}
          </label>
        </div>
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn_add">
          {isEditing ? "Guardar cambios" : "Registrar Nuevo Alumno"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn btn-info"
            onClick={onCancelEdit}
            style={{ backgroundColor: "#6b7280" }} 
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

FormularioAlumno.propTypes = {
  agregarAlumno: PropTypes.func,
  isEditing: PropTypes.bool,
  alumnoEditando: PropTypes.object,
  onUpdate: PropTypes.func,
  onCancelEdit: PropTypes.func,
};

export default FormularioAlumno;
