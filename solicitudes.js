const axios = require("axios");
const carrera = "tecnicoComputacion"; 
const materiasAInscribir = ["ANF231", "PAL404", "LME404", "REC404"]; 

axios
  .post(`http://localhost:3000/inscribir/${carrera}`, {
    codigoMateria: materiasAInscribir,
  })
  .then((response) => {
    if (response.status === 201) {
      console.log("Materias inscritas correctamente");
    } else {
      console.error("Error al inscribir materias:", response.data.error);
    }
  })
  .catch((error) => {
    console.error("Error al inscribir materias:", error.message);
  });