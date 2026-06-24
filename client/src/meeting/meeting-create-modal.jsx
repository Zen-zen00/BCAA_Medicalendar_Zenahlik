import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useMeeting } from "./meeting-provider";
import { usePatient } from "../patient/patient-provider";

function MeetingCreateModal({ show, onHide }) {
  const { handlerMap } = useMeeting();
  const { data: patients } = usePatient();

  const [name, setName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingNote, setMeetingNote] = useState("");
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError(null);

      await handlerMap.createMeeting({
        name,
        doctor,
        startTime: `${date}T${startTime}:00`,
        endTime: `${date}T${endTime}:00`,
        meetingNote,
        patientId,
        status: "Upcoming",
      });

      setName("");
      setDoctor("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setMeetingNote("");
      setPatientId("");

      onHide();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add meeting</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Meeting name</Form.Label>
            <Form.Control
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Doctor</Form.Label>
            <Form.Control
              value={doctor}
              onChange={(event) => setDoctor(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Patient</Form.Label>
            <Form.Select
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              required
            >
              <option value="">Select patient</option>
              {patients?.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.birthNumber})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start time</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End time</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meeting note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={meetingNote}
              onChange={(event) => setMeetingNote(event.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>

          <Button variant="primary" type="submit">
            Add meeting
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default MeetingCreateModal;