import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { usePatient } from "./patient-provider";
import PatientUpdateModal from "./patient-update-modal";

function PatientDetailModal({ patient, show, onHide }) {
  const { handlerMap } = usePatient();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  if (!patient) return null;

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient? Assigned meetings will also be deleted."
    );

    if (!confirmed) return;

    await handlerMap.deletePatient(patient.id);
    onHide();
  }

  return (
    <>
      <Modal show={show && !showUpdateModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Patient detail</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>ID:</strong> {patient.id}</p>
          <p><strong>Birth number:</strong> {patient.birthNumber}</p>
          <p>
            <strong>Doctor note:</strong>{" "}
            {patient.doctorNote || "No doctor note."}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowUpdateModal(true)}
          >
            Edit
          </Button>

          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>

          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <PatientUpdateModal
        patient={patient}
        show={showUpdateModal}
        onHide={() => {
          setShowUpdateModal(false);
          onHide();
        }}
      />
    </>
  );
}

export default PatientDetailModal;