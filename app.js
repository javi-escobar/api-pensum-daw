const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();
const bodyParser = require('body-parser')
const port = 3000;

app.use(bodyParser.json())
app.use(express.json())

const tecnicoComputacion = {
  ciclo1: {
    ANF231: { nombre: "Antropologia Filosofica", prerrequisito: "Bachillerato", UV: 3 },
    PAL404: {
      nombre: "Programacion de Algoritmos",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    ALG501: { nombre: "Algebra Vectorial y Matrices", prerrequisito: "Bachillerato", UV: 4 },
    LME404: {
      nombre: "Lenguajes de Marcado y  Estilo Web",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    REC404: { nombre: "Redes de Comunicación", prerrequisito: "Bachillerato", UV: 4 },
  },
  ciclo2: {
    PSC231: {
      nombre: "Pensamiento Social y Cristiano",
      prerrequisito: "Bachillerato",
      UV: 3,
    },
    POO404: {
      nombre: "Programacion a OrientadaObjetos",
      prerrequisito: "Programación de Algoritmos",
      UV: 4,
    },
    DAW404: {
      nombre: "Desarrollo de Aplicaciones Web con Software Interpretados en el Cliente",
      prerrequisito: "Lenguajes de Marcado y  Estilo Web",
      UV: 4,
    },
    DSP404: {
      nombre: "Desarrollo de Aplicaciones con Software Propietario",
      prerrequisito: "Programación de Algoritmos",
      UV: 4,
    },
    ASB404: {
      nombre: "Analisis y Diseño de Sistemas y Bases de Datos",
      prerrequisito: "Programación de Algoritmos",
      UV: 4,
    },
  },
};

const ingenieriaComputacion = {
  ciclo3: {
    CVV501: {
      nombre: "Calculo de Varias Variables",
      prerrequisito: "Calculo Integral",
      UV: 4,
    },
    CDP501: {
      nombre: "Cinemática y Dinámica de Particulas",
      prerrequisito: "Calculo Diferencial",
      UV: 4,
    },
    ADS104: {
      nombre: "Analisis y Diseño de Sistemas Informaticos",
      prerrequisito: "Modelamiento y Diseño de Bases de Datos",
      UV: 4,
    },
    PED104: {
      nombre: "Programacion con Estructuras de Datos",
      prerrequisito: "Programacion Orientada a Objetos",
      UV: 4,
    },
  },
  ciclo4: {
    EDI501: {
      nombre: "Ecunaciones Diferenciales",
      prerrequisito: "Calculo de Varias Variables",
      UV: 4,
    },
    EYM501: {
      nombre: "Electricidad y Magnetismo",
      prerrequisito: "Cinemática y Dinámica de Partículas",
      UV: 4,
    },
    DMD104: {
      nombre: "Datawarehouse y Mineria de Datos",
      prerrequisito: "Modelamiento y Diseño de Base de Datos",
      UV: 4,
    },
    ESA501: {
      nombre: "Estadísitca Aplicada",
      prerrequisito: "Cálculo Integral",
      UV: 4,
    }
  },
  ciclo5: {
    ACE102: {
      nombre: "Análisis de Circuitos Eléctricos",
      prerrequisito: "Electricidad y Magnetismo",
      UV: 4,
    },
    GEA106: {
      nombre: "Gestión Ambiental",
      prerrequisito: "Química General",
      UV: 4,
    },
    AEE106: {
      nombre: "Análisis y Evaluación Económica",
      prerrequisito: "Estadísitca Aplicada",
      UV: 4,
    },
    OFC501: {
      nombre: "Oscilaciones, Fluidos y Calor",
      prerrequisito: "Cinamática y Dinámica de Partículas",
      UV: 4,
    }
  }
};

const inscripciones = {};

//Rutas creadas

app.get("/", (req, res) => {
  res.send(
    "Rutas de Pensum: 'tecnicoComputacion/pensum' o '/ingenieriaComputacion/pensum' Rutas de Prerrequisitos por Materia: '/tecnicoComputacion/ + codigo de Materia(DAW404, DSP404, etc.)' o '/ingenieriaComputacion/ + codigo de Materia' Rutas Materias por Ciclo: '/tecnicoComputacion/ciclo (1 o 2)' o '/ingenieriaComputacion/ciclo (3, 4 o 5)'"
  );
});
//Pensum
app.get("/tecnicoComputacion/pensum", (req, res) => {
  res.send(tecnicoComputacion);
});
app.get("/ingenieriaComputacion/pensum", (req, res) => {
  res.send(ingenieriaComputacion);
});

//Prerrequisitos por codigo de materia
app.get("/:carrera/pre/:codigoMateria", (req, res) => {
  const carrera = req.params.carrera;
  const codigoMateria = req.params.codigoMateria;

  if (carrera !== 'tecnicoComputacion' && carrera !== 'ingenieriaComputacion') {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  const pensum = carrera === 'tecnicoComputacion' ? tecnicoComputacion : ingenieriaComputacion;

  let materiaEncontrada = null;
  let prerrequisitos = [];

  for (const ciclo in pensum) {
    if (pensum[ciclo][codigoMateria]) {
      materiaEncontrada = pensum[ciclo][codigoMateria];
      prerrequisitos = materiaEncontrada.prerrequisito.split(', ').filter(Boolean);
      break;
    }
  }

  if (materiaEncontrada) {
    res.send({
      carrera,
      codigoMateria,
      nombre: materiaEncontrada.nombre,
      prerrequisitos,
    });
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});


//Materias por ciclo
app.get("/:carrera/:ciclo", (req, res) => {
  const ciclo = req.params.ciclo;
  const carrera = req.params.carrera;


  var pensum = null;
  if (carrera === "tecnicoComputacion") {
    pensum = tecnicoComputacion;
  } else if (carrera === "ingenieriaComputacion") {
    pensum = ingenieriaComputacion;
  } else {
    res.status(404).json({ error: "Carrera no encontrada" });
  }

  if (pensum && pensum[ciclo]) {
    const materiasCiclo = Object.keys(pensum[ciclo]);
    res.send({ carrera, ciclo, materias: materiasCiclo });
  } else {
    res.status(404).json({ error: "Ciclo no encontrada" });
  }
});

//Ruta para inscripciones
app.post('/inscribir/:carrera', bodyParser.json(), (req, res) => {
  const carrera = req.params.carrera;
  const { codigoMateria } = req.body;

  if(carrera !== 'tecnicoComputacion' && carrera !== 'ingenieriaComputacion') {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  if(!codigoMateria || !Array.isArray(codigoMateria) || codigoMateria.length == 0) {
    return res.status(400).json({ error: "Se debe de inscribir al menos una materia" });
  }

  const pensum = carrera === 'tecnicoComputacion' ? tecnicoComputacion : ingenieriaComputacion;

  //Total de UV
  const UVS = codigoMateria.reduce((total, codigo) => {
    const ciclo = codigo.substring(0, 6);
    const materia = pensum[ciclo] && pensum[ciclo][codigo];
    if (materia) {
      return total + materia.UV;
    } else {
      return total;
    }
  }, 0)

  if(UVS>20) {
    return res.status(400).json({ error: "Límite de 20 UV para las inscripciones" });
  }

  //Registrar las inscripciones
  if(!inscripciones[carrera]) {
    inscripciones[carrera] = [];
  }

  inscripciones[carrera] = inscripciones[carrera].concat(codigoMateria);
  res.status(201).send( "Inscripcion correcta" );
})


//Ruta para eliminar inscripcion
app.delete('/eliminar/:carrera', (req, res) => {
  const carrera = req.params.carrera;
  const {codigoMateria} = req.body;

  if(carrera !== 'tecnicoComputacion' && carrera !== 'ingenieriaComputacion') {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  if(!codigoMateria || !Array.isArray(codigoMateria) || codigoMateria.length == 0) {
    return res.status(400).json({ error: "Se debe de inscribir al menos una materia" });
  }

  if (!inscripciones[carrera] || !codigoMateria.every((codigo) => inscripciones[carrera].includes(codigo))) {
    return res.status(400).json({ error: "No se puede eliminar la inscripcion" });
  }

  inscripciones[carrera] = inscripciones[carrera].filter((codigo) => !codigoMateria.includes(codigo));

  res.send("Inscripcion elimanada correctamente");

})

app.listen(port, () => {
  console.log("API escuchando en el puerto: " + port);
});
