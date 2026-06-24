import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Modal, Button } from "react-bootstrap";

import StateResolver from "../common/state-resolver";
import { useMeeting } from "../meeting/meeting-provider";
import { usePatient } from "../patient/patient-provider";
import MeetingCreateModal from "../meeting/meeting-create-modal";
import MeetingUpdateModal from "../meeting/meeting-update-modal";

import { formatDateTime } from "../common/date-utils";

import { Link } from "react-router-dom";

function SchedulePage() {
  const {
    data: meetings,
    error: meetingError,
    handlerMap: meetingHandlerMap,
  } = useMeeting();

  const { data: patients, error: patientError } = usePatient();

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const events = meetings?.map((meeting) => {
    const patient = patients?.find(
      (patient) => patient.id === meeting.patientId
    );

    return {
      id: meeting.id,
      title: patient ? patient.name : meeting.name,
      start: meeting.startTime,
      end: meeting.endTime,
      extendedProps: {
        meeting,
        patient,
      },
    };
  });

  async function handleDeleteMeeting() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) return;

    await meetingHandlerMap.deleteMeeting(selectedMeeting.id);
    setSelectedMeeting(null);
  }

  return (
    <StateResolver
      data={meetings && patients}
      error={meetingError || patientError}
    >
      <div>
        <h1 className="mb-4">Medicalendar</h1>

        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowCreateModal(true)}
        >
          Add meeting
        </Button>

        <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView={localStorage.getItem("calendarView") || "timeGridDay"}
  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  }}
  datesSet={(info) => {
    localStorage.setItem("calendarView", info.view.type);
  }}
  events={events}
  eventClick={(info) => {
    setSelectedMeeting(info.event.extendedProps.meeting);
  }}
  height="auto"
  slotMinTime="06:00:00"
  slotMaxTime="22:00:00"
  allDaySlot={false}
/>

        <MeetingCreateModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
        />

        <MeetingUpdateModal
          meeting={selectedMeeting}
          show={showUpdateModal}
          onHide={() => {
            setShowUpdateModal(false);
            setSelectedMeeting(null);
          }}
        />

        <Modal
          show={!!selectedMeeting && !showUpdateModal}
          onHide={() => setSelectedMeeting(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Meeting detail</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedMeeting && (
              <>
                <p>
                  <strong>Name:</strong> {selectedMeeting.name}
                </p>
                <p>
                  <strong>Doctor:</strong> {selectedMeeting.doctor}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {formatDateTime(selectedMeeting.startTime)}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {formatDateTime(selectedMeeting.endTime)}
                </p>
                <p>
                  <strong>Status:</strong> {selectedMeeting.status}
                </p>
                <p>
                  <strong>Note:</strong>{" "}
                  {selectedMeeting.meetingNote || "No meeting note."}
                </p>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => setShowUpdateModal(true)}
            >
              Edit
            </Button>

            <Button variant="danger" onClick={handleDeleteMeeting}>
              Delete
            </Button>

            <Button
              variant="secondary"
              onClick={() => setSelectedMeeting(null)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </StateResolver>
  );
}

export default SchedulePage;