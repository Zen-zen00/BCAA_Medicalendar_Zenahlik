import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useMeeting } from "./meeting-provider";
import { usePatient } from "../patient/patient-provider";

function MeetingUpdateModal({ meeting, show, onHide }) {
  const { handlerMap } = useMeeting();
  const { data: patients } = usePatient();

  const [name, setName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingNote, setMeetingNote] = useState("");
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (meeting) {
      setName(meeting.name || "");
      setDoctor(meeting.doctor || "");
      setStartTime(meeting.startTime || "");
      setEndTime(meeting.endTime || "");
      setMeetingNote(meeting.meetingNote || "");
      setPatientId(meeting.patientId || "");
      setStatus(meeting.status || "upcoming");
      setError(null);
    }
  }, [meeting]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError(null);

      await handlerMap.updateMeeting(meeting.id, {
        name,
        doctor,
        startTime,
        endTime,
        meetingNote,
        patientId,
        status,
      });

      onHide();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!meeting) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit meeting</Modal.Title>
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
            <Form.Label>Start time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
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
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default MeetingUpdateModal;