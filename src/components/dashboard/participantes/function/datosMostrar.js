const datosMostrar = [
  { titulo: "Cédula", campo: "cedula" },
  { titulo: "Edad", campo: "edad" },
  { titulo: "Nombre", campo: "nombre" },
  { titulo: "Segundo nombre", campo: "nombre_dos", condicional: true },
  { titulo: "Apellido", campo: "apellido" },
  { titulo: "Segundo apellido", campo: "apellido_dos", condicional: true },
  {
    titulo: "Género",
    campo: "genero",
    transformar: (valor) => (valor === "1" ? "Masculino" : "Femenino"),
  },
  { titulo: "Teléfono", campo: "telefono" },
  { titulo: "Correo", campo: "correo" },
  { titulo: "Actividad laboral", campo: "laboral" },
  { titulo: "Cargo", campo: "cargos" },
  { titulo: "Formación", campo: "formacion" },
];

export default datosMostrar;
