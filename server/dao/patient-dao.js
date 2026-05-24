const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const filePath = path.join(__dirname, "../data/patients.json");

function loadPatients() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function savePatients(patients) {
  fs.writeFileSync(filePath, JSON.stringify(patients, null, 2));
}

function create(patient) {
  const patients = loadPatients();

  const newPatient = {
    id: "PAT-" + crypto.randomUUID(),
    name: patient.name,
    birthNumber: patient.birthNumber,
    doctorNote: patient.doctorNote || ""
  };

  patients.push(newPatient);
  savePatients(patients);

  return newPatient;
}

function list() {
  return loadPatients();
}

function get(id) {
  const patients = loadPatients();
  return patients.find((patient) => patient.id === id);
}

function update(id, updatedData) {
  const patients = loadPatients();
  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    return null;
  }

  patients[index] = {
    ...patients[index],
    ...updatedData,
    id: patients[index].id
  };

  savePatients(patients);
  return patients[index];
}

function remove(id) {
  const patients = loadPatients();
  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    return null;
  }

  const deletedPatient = patients.splice(index, 1)[0];
  savePatients(patients);

  return deletedPatient;
}

module.exports = {
  create,
  list,
  get,
  update,
  remove
};