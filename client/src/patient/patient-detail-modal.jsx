import { Modal, Button } from "react-bootstrap";

function PatientDetailModal({ patient, show, onHide }) {
  if (!patient) return null;

  return (
    <Modal show={show} onHide={onHide}>
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
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PatientDetailModal;