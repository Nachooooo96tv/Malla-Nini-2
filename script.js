const asignaturas = [
  { codigo: "CBI111", nombre: "Biología Celular", prereqs: [] },
  { codigo: "LIC001", nombre: "Fund. del actuar comunitario", prereqs: [] },
  { codigo: "MAT110", nombre: "Introd. a la Matemática Aplicada", prereqs: [] },
  { codigo: "VYF101", nombre: "Morfología y Función", prereqs: [] },
  { codigo: "ENF102", nombre: "Int. a los Estudios de la Enfermería", prereqs: [] },
  { codigo: "ENF101", nombre: "Primeros Auxilios", prereqs: ["ENF102"] },
  { codigo: "ENF201", nombre: "Humanas", prereqs: ["ENF102", "ENF101"] },
  { codigo: "CBI202", nombre: "Histomorfobiología", prereqs: ["CBI111", "VYF101"] },
  { codigo: "CUQ203", nombre: "Fund. de Química y Bioquímica", prereqs: [] },
  { codigo: "CCU203", nombre: "Bioquímica para Enfermería", prereqs: ["CUQ203", "MAT110"] },
  { codigo: "AES199", nombre: "Bioestadística", prereqs: ["MAT110"] },
  { codigo: "LIC030", nombre: "Salud Pública", prereqs: ["LIC001"] },
  { codigo: "ENF301", nombre: "Proc. Atención Enfermería I", prereqs: ["VYF101", "CBI202"] },
  { codigo: "CBI302", nombre: "Microbiología y Parasitología", prereqs: ["CBI111", "CBI202"] },
  { codigo: "ENF302", nombre: "Patología", prereqs: ["ENF301"] },
  { codigo: "ENF404", nombre: "Proc. Atención Enfermería II", prereqs: ["ENF301", "ENF302"] },
  { codigo: "ENF403", nombre: "Fisiología General", prereqs: ["VYF101", "CBI202"] },
  // Agrega el resto de los ramos aquí si lo deseas
];

let estado = {};

function guardarEstado() {
  localStorage.setItem("estadoMallaEnfermeria", JSON.stringify(estado));
}

function cargarEstado() {
  const data = localStorage.getItem("estadoMallaEnfermeria");
  if (data) {
    estado = JSON.parse(data);
  } else {
    asignaturas.forEach((r) => (estado[r.codigo] = false));
  }
}

function crearMalla() {
  cargarEstado();
  const malla = document.getElementById("malla");
  malla.innerHTML = ""; // Limpiar por si acaso

  asignaturas.forEach((ramo) => {
    const div = document.createElement("div");
    div.className = "card";
    div.id = ramo.codigo;
    div.textContent = `${ramo.codigo}\n${ramo.nombre}`;
    div.addEventListener("click", () => toggleRamo(ramo.codigo));
    malla.appendChild(div);
  });

  actualizarVista();
}

function toggleRamo(codigo) {
  estado[codigo] = !estado[codigo];
  guardarEstado();
  actualizarVista();
}

function actualizarVista() {
  asignaturas.forEach((ramo) => {
    const div = document.getElementById(ramo.codigo);
    const aprobado = estado[ramo.codigo];
    const habilitado = ramo.prereqs.every((req) => estado[req]);

    if (aprobado) {
      div.classList.add("active");
      div.classList.remove("locked");
    } else {
      div.classList.remove("active");
      if (habilitado) {
        div.classList.remove("locked");
      } else {
        div.classList.add("locked");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", crearMalla);
