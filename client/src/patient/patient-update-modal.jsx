import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { usePatient } from "./patient-provider";

function PatientUpdateModal({ patient, show, onHide }) {
  const { handlerMap } = usePatient();

  const [name, setName] = useState("");
  const [birthNumber, setBirthNumber] = useState("");
  const [doctorNote, setDoctorNote] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patient) {
      setName(patient.name || "");
      setBirthNumber(patient.birthNumber || "");
      setDoctorNote(patient.doctorNote || "");
      setError(null);
    }
  }, [patient]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError(null);

      await handlerMap.updatePatient(patient.id, {
        name,
        birthNumber,
        doctorNote,
      });

      onHide();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!patient) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit patient</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Patient name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Birth number</Form.Label>
            <Form.Control
              type="text"
              value={birthNumber}
              onChange={(event) => setBirthNumber(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Doctor note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={doctorNote}
              onChange={(event) => setDoctorNote(event.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>

          <Button variant="primary" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PatientUpdateModal;