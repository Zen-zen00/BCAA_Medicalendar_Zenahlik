import { useState } from "react";

import { Button } from "react-bootstrap";
import StateResolver from "../common/state-resolver";
import { usePatient } from "./patient-provider";
import PatientDetailModal from "./patient-detail-modal";
import PatientCreateModal from "./patient-create-modal";
import { Link } from "react-router-dom";

function PatientListPage() {
  const { data, error } = usePatient();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <StateResolver data={data} error={error}>
      <div>
        <h1 className="mb-4">Patient list</h1>

        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowCreateModal(true)}
        >
          Add patient
        </Button>

        {data?.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <ul>
            {data?.map((patient) => (
              <li key={patient.id}>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setSelectedPatient(patient)}
                >
                  {patient.name}
                </button>{" "}
                ({patient.birthNumber})
              </li>
            ))}
          </ul>
        )}

        <PatientDetailModal
          patient={selectedPatient}
          show={!!selectedPatient}
          onHide={() => setSelectedPatient(null)}
        />

        <PatientCreateModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
        />
      </div>
    </StateResolver>
  );
}

export default PatientListPage;