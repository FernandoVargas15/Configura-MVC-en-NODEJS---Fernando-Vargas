export default function ListaEstudiantes({
  students = [],
  onEdit = () => {},
  onDelete = () => {},
}) {
  return (
    <div className="card">
      <h5 className="card-title">Lista de estudiantes</h5>

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Curso</th>
              <th>Sexo</th>
              <th>Inglés</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td className="td-center" colSpan={6}>
                  No hay estudiantes registrados.
                </td>
              </tr>
            ) : (
              students.map((al) => (
                <tr key={al.id ?? al.email_alumno}>
                  <td>{al.nombre_alumno}</td>
                  <td>{al.email_alumno}</td>
                  <td>{al.curso}</td>
                  <td>{al.sexo === "masculino" ? "Masculino" : "Femenino"}</td>
                  <td>{Number(al.habla_ingles) ? "Sí" : "No"}</td>
                  <td>
                    <div className="acciones">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => onEdit(al)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onDelete(al.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
