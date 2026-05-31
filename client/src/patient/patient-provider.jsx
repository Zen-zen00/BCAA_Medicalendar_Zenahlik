import { createContext, useContext, useEffect, useState } from "react";

const PatientContext = createContext();

function PatientProvider({ children }) {
  const [patientList, setPatientList] = useState(null);
  const [error, setError] = useState(null);

  async function loadPatients() {
    try {
      setError(null);

      const response = await fetch(
        "http://localhost:3000/patient/list"
      );

      const data = await response.json();

      setPatientList(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function createPatient(dtoIn) {
    try {
      setError(null);

      const response = await fetch(
        "http://localhost:3000/patient/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dtoIn),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create patient.");
      }

      await loadPatients();

      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function updatePatient(id, dtoIn) {
    try {
      setError(null);

      const response = await fetch(
        `http://localhost:3000/patient/update/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dtoIn),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update patient.");
      }

      await loadPatients();

      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function deletePatient(id) {
  try {
    setError(null);

    const response = await fetch(
      `http://localhost:3000/patient/delete/${id}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete patient.");
    }

    await loadPatients();

    return data;
  } catch (e) {
    setError(e.message);
    throw e;
  }
}

  useEffect(() => {
    loadPatients();
  }, []);

  const value = {
    data: patientList,
    error,
    handlerMap: {
      loadPatients,
      createPatient,
      updatePatient,
      deletePatient,
    },
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

function usePatient() {
  return useContext(PatientContext);
}

export { PatientProvider, usePatient };