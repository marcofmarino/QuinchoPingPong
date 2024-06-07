let participantes = [];
let resultados = {};
let resultadosIndividuales = {};

function agregarParticipante() {
  const nombre = document.getElementById("nombreParticipante").value;
  if (nombre && !participantes.includes(nombre)) {
    participantes.push(nombre);
    document.getElementById("nombreParticipante").value = "";
    actualizarVista();
  }
}

function actualizarVista() {
  mostrarParticipantes();
  const equipos = generarEquipos(participantes);
  mostrarEquipos(equipos);
  const enfrentamientos = generarEnfrentamientos(equipos);
  mostrarFormularioResultados(enfrentamientos);
  actualizarPosiciones();

  const enfrentamientosIndividuales =
    generarEnfrentamientosIndividuales(participantes);
  mostrarFormularioResultadosIndividuales(enfrentamientosIndividuales);
  actualizarPosicionesIndividuales();
}

function mostrarParticipantes() {
  const participantesDiv = document.getElementById("participantes");
  participantesDiv.innerHTML =
    "<h2>Participantes:</h2><ul>" +
    participantes.map((p) => `<li>${p}</li>`).join("") +
    "</ul>";
}

function mostrarEquipos(equipos) {
  const equiposDiv = document.getElementById("equipos");
  equiposDiv.innerHTML =
    "<h2>Equipos:</h2><ul>" +
    equipos.map((e) => `<li>${[...e].join(" y ")}</li>`).join("") +
    "</ul>";
}

function mostrarFormularioResultados(enfrentamientos) {
  const registroResultadosDiv = document.getElementById("registroResultados");
  registroResultadosDiv.innerHTML =
    "<h2>Registrar Resultados:</h2>" +
    Array.from(enfrentamientos)
      .map((e, index) => {
        const [equipo1, equipo2] = [...e].map((equipo) =>
          [...equipo].join(" y "),
        );
        return `
            <div>
                <span>${equipo1} vs ${equipo2}</span>
                <input type="number" id="resultado-${index}-equipo1" placeholder="0">
                <input type="number" id="resultado-${index}-equipo2" placeholder="0">
                <button onclick="registrarResultado(${index}, '${equipo1}', '${equipo2}')">Aceptar</button>
            </div>
        `;
      })
      .join("");
}

function registrarResultado(index, equipo1, equipo2) {
  const resultadoEquipo1 = parseInt(
    document.getElementById(`resultado-${index}-equipo1`).value,
  );
  const resultadoEquipo2 = parseInt(
    document.getElementById(`resultado-${index}-equipo2`).value,
  );

  if (!isNaN(resultadoEquipo1) && !isNaN(resultadoEquipo2)) {
    resultados[index] = {
      equipo1,
      resultadoEquipo1,
      equipo2,
      resultadoEquipo2,
    };
    actualizarPosiciones();
  }
}

function actualizarPosiciones() {
  const posiciones = {};

  participantes.forEach((participante) => {
    posiciones[participante] = {
      victorias: 0,
      puntosFavor: 0,
      puntosContra: 0,
      diferencia: 0,
    };
  });

  for (const key in resultados) {
    const { equipo1, resultadoEquipo1, equipo2, resultadoEquipo2 } =
      resultados[key];
    const jugadoresEquipo1 = equipo1.split(" y ");
    const jugadoresEquipo2 = equipo2.split(" y ");

    const equipo1Gano = resultadoEquipo1 > resultadoEquipo2;
    const equipo2Gano = resultadoEquipo2 > resultadoEquipo1;

    jugadoresEquipo1.forEach((jugador) => {
      posiciones[jugador].puntosFavor += resultadoEquipo1;
      posiciones[jugador].puntosContra += resultadoEquipo2;
      posiciones[jugador].diferencia += resultadoEquipo1 - resultadoEquipo2;
      if (equipo1Gano) posiciones[jugador].victorias += 1;
    });

    jugadoresEquipo2.forEach((jugador) => {
      posiciones[jugador].puntosFavor += resultadoEquipo2;
      posiciones[jugador].puntosContra += resultadoEquipo1;
      posiciones[jugador].diferencia += resultadoEquipo2 - resultadoEquipo1;
      if (equipo2Gano) posiciones[jugador].victorias += 1;
    });
  }

  const posicionesOrdenadas = Object.keys(posiciones).sort((a, b) => {
    const diffVictorias = posiciones[b].victorias - posiciones[a].victorias;
    if (diffVictorias !== 0) return diffVictorias;

    const diffDiferencia = posiciones[b].diferencia - posiciones[a].diferencia;
    if (diffDiferencia !== 0) return diffDiferencia;

    const diffPuntosFavor =
      posiciones[b].puntosFavor - posiciones[a].puntosFavor;
    if (diffPuntosFavor !== 0) return diffPuntosFavor;

    return 0;
  });

  const posicionesDiv = document.getElementById("posiciones");
  posicionesDiv.innerHTML =
    "<h2>Posiciones:</h2><table><tr><td>Nombre</td><td>Victorias</td><td>Tantos favor</td><td>Tantos contra</td><td>Diferencia</td></tr>" +
    posicionesOrdenadas
      .map((jugador) => {
        const { victorias, puntosFavor, puntosContra, diferencia } =
          posiciones[jugador];
        return `<tr> 
<td>${jugador}</td><td>${victorias}</td><td>${puntosFavor}</td><td>${puntosContra}</td><td>${diferencia}</td></tr>`;
      })
      .join("") +
    "</table>";
}

function mostrarFormularioResultadosIndividuales(enfrentamientos) {
  const registroResultadosDiv = document.getElementById(
    "registroResultadosIndividuales",
  );
  registroResultadosDiv.innerHTML =
    "<h2>Resultados:</h2>" +
    Array.from(enfrentamientos)
      .map((e, index) => {
        const [jugador1, jugador2] = [...e];
        return `
            <div>
                <span>${jugador1} vs ${jugador2}</span>
                <input type="number" id="resultadoIndividual-${index}-jugador1" placeholder="0">
                <input type="number" id="resultadoIndividual-${index}-jugador2" placeholder="0">
                <button onclick="registrarResultadoIndividual(${index}, '${jugador1}', '${jugador2}')">Aceptar</button>
            </div>
        `;
      })
      .join("");
}

function registrarResultadoIndividual(index, jugador1, jugador2) {
  const resultadoJugador1 = parseInt(
    document.getElementById(`resultadoIndividual-${index}-jugador1`).value,
  );
  const resultadoJugador2 = parseInt(
    document.getElementById(`resultadoIndividual-${index}-jugador2`).value,
  );

  if (!isNaN(resultadoJugador1) && !isNaN(resultadoJugador2)) {
    resultadosIndividuales[index] = {
      jugador1,
      resultadoJugador1,
      jugador2,
      resultadoJugador2,
    };
    actualizarPosicionesIndividuales();
  }
}

function actualizarPosicionesIndividuales() {
  const posiciones = {};

  participantes.forEach((participante) => {
    posiciones[participante] = {
      victorias: 0,
      puntosFavor: 0,
      puntosContra: 0,
      diferencia: 0,
    };
  });

  for (const key in resultadosIndividuales) {
    const { jugador1, resultadoJugador1, jugador2, resultadoJugador2 } =
      resultadosIndividuales[key];

    const jugador1Gano = resultadoJugador1 > resultadoJugador2;
    const jugador2Gano = resultadoJugador2 > resultadoJugador1;

    posiciones[jugador1].puntosFavor += resultadoJugador1;
    posiciones[jugador1].puntosContra += resultadoJugador2;
    posiciones[jugador1].diferencia += resultadoJugador1 - resultadoJugador2;
    if (jugador1Gano) posiciones[jugador1].victorias += 1;

    posiciones[jugador2].puntosFavor += resultadoJugador2;
    posiciones[jugador2].puntosContra += resultadoJugador1;
    posiciones[jugador2].diferencia += resultadoJugador2 - resultadoJugador1;
    if (jugador2Gano) posiciones[jugador2].victorias += 1;
  }

  const posicionesOrdenadas = Object.keys(posiciones).sort((a, b) => {
    const diffVictorias = posiciones[b].victorias - posiciones[a].victorias;
    if (diffVictorias !== 0) return diffVictorias;

    const diffDiferencia = posiciones[b].diferencia - posiciones[a].diferencia;
    if (diffDiferencia !== 0) return diffDiferencia;

    const diffPuntosFavor =
      posiciones[b].puntosFavor - posiciones[a].puntosFavor;
    if (diffPuntosFavor !== 0) return diffPuntosFavor;

    return 0;
  });

  const posicionesDiv = document.getElementById("posicionesIndividuales");
  posicionesDiv.innerHTML =
    "<h2>Posiciones:</h2><table><tr><td>Nombre</td><td>Victorias</td><td>Tantos favor</td><td>Tantos contra</td><td>Diferencia</td></tr>" +
    posicionesOrdenadas
      .map((jugador) => {
        const { victorias, puntosFavor, puntosContra, diferencia } =
          posiciones[jugador];
        return `<tr> 
<td>${jugador}</td><td>${victorias}</td><td>${puntosFavor}</td><td>${puntosContra}</td><td>${diferencia}</td></tr>`;
      })
      .join("") +
    "</table>";
}

function generarEnfrentamientosIndividuales(participantes) {
  const enfrentamientos = new Set();
  for (let i = 0; i < participantes.length; i++) {
    for (let j = i + 1; j < participantes.length; j++) {
      enfrentamientos.add(new Set([participantes[i], participantes[j]]));
    }
  }
  return enfrentamientos;
}

function generarEquipos(participantes) {
  const equipos = [];
  for (let i = 0; i < participantes.length; i++) {
    for (let j = i + 1; j < participantes.length; j++) {
      equipos.push(new Set([participantes[i], participantes[j]]));
    }
  }
  return equipos;
}

function generarEnfrentamientos(equipos) {
  const enfrentamientos = new Set();
  for (let i = 0; i < equipos.length; i++) {
    for (let j = i + 1; j < equipos.length; j++) {
      const equipo1 = equipos[i];
      const equipo2 = equipos[j];
      if ([...equipo1].every((jugador) => !equipo2.has(jugador))) {
        enfrentamientos.add(new Set([equipo1, equipo2]));
      }
    }
  }
  return enfrentamientos;
}
