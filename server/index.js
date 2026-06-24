const express = require("express");
const cors = require("cors");

const patientDao = require("./dao/patient-dao");
const meetingDao = require("./dao/meeting-dao");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

function isMeetingOverlapping(existingMeeting, newStartTime, newEndTime) {
  const existingStart = new Date(existingMeeting.startTime);
  const existingEnd = new Date(existingMeeting.endTime);

  const newStart = new Date(newStartTime);
  const newEnd = new Date(newEndTime);

  return existingStart < newEnd && existingEnd > newStart;
}

/* PATIENT ENDPOINTS */

app.post("/patient/create", (req, res) => {
  const { name, birthNumber, doctorNote } = req.body;

  if (!name || !birthNumber) {
    return res.status(400).json({
      error: "Patient name and birth number are required."
    });
  }

  const patient = patientDao.create({
    name,
    birthNumber,
    doctorNote
  });

  res.json(patient);
});

app.get("/patient/list", (req, res) => {
  res.json(patientDao.list());
});

app.get("/patient/get/:id", (req, res) => {
  const patient = patientDao.get(req.params.id);

  if (!patient) {
    return res.status(404).json({
      error: "Patient not found."
    });
  }

  res.json(patient);
});

app.post("/patient/update/:id", (req, res) => {
  const updatedPatient = patientDao.update(req.params.id, req.body);

  if (!updatedPatient) {
    return res.status(404).json({
      error: "Patient not found."
    });
  }

  res.json(updatedPatient);
});

app.post("/patient/delete/:id", (req, res) => {
  const deletedPatient = patientDao.remove(req.params.id);

  if (!deletedPatient) {
    return res.status(404).json({
      error: "Patient not found."
    });
  }

  meetingDao.removeByPatientId(req.params.id);

  res.json({
    message: "Patient and assigned meetings deleted.",
    patient: deletedPatient
  });
});

/* MEETING ENDPOINTS */

app.post("/meeting/create", (req, res) => {
  const {
    name,
    doctor,
    startTime,
    endTime,
    meetingNote,
    patientId,
    status
  } = req.body;

  if (!name || !doctor || !startTime || !endTime || !patientId) {
    return res.status(400).json({
      error: "Missing required meeting fields."
    });
  }

  const patient = patientDao.get(patientId);

if (!patient) {
  return res.status(400).json({
    error: "Assigned patient does not exist."
  });
}

const startDate = new Date(startTime);
const endDate = new Date(endTime);
const now = new Date();

if (startDate < now) {
  return res.status(400).json({
    error: "Meeting cannot be created in the past."
  });
}

if (endDate <= startDate) {
  return res.status(400).json({
    error: "End time must be after start time."
  });
}

const allowedStatuses = ["Upcoming", "Finished", "Cancelled"];

if (status && !allowedStatuses.includes(status)) {
  return res.status(400).json({
    error: "Invalid meeting status."
  });
}

const patientMeetings = meetingDao
  .list()
  .filter((meeting) => meeting.patientId === patientId);

const conflict = patientMeetings.find((meeting) =>
  isMeetingOverlapping(meeting, startTime, endTime)
);

if (conflict) {
  return res.status(400).json({
    error: "This patient already has a meeting at this time."
  });
}

  const meeting = meetingDao.create({
    name,
    doctor,
    startTime,
    endTime,
    meetingNote,
    patientId,
    status
  });

  res.json(meeting);
});

app.get("/meeting/list", (req, res) => {
  res.json(meetingDao.list());
});

app.get("/meeting/get/:id", (req, res) => {
  const meeting = meetingDao.get(req.params.id);

  if (!meeting) {
    return res.status(404).json({
      error: "Meeting not found."
    });
  }

  res.json(meeting);
});

app.post("/meeting/update/:id", (req, res) => {
  const existingMeeting = meetingDao.get(req.params.id);

  if (!existingMeeting) {
    return res.status(404).json({
      error: "Meeting not found."
    });
  }

  const allowedStatuses = ["Upcoming", "Finished", "Cancelled"];
  const now = new Date();

  const existingStartDate = new Date(existingMeeting.startTime);
  const isExistingMeetingInPast = existingStartDate < now;

  // If meeting is already in the past, only status can be updated.
  if (isExistingMeetingInPast) {
    const requestKeys = Object.keys(req.body);
  const allowedKeys = ["status", "meetingNote"];
  const hasInvalidKey = requestKeys.some(
  (key) => !allowedKeys.includes(key)
  );

    if (hasInvalidKey) {
     return res.status(400).json({
       error: "Past meetings can only update status and meeting note."
    });
   }

    if (!req.body.status || !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        error: "Invalid meeting status."
      });
    }

    const updatedMeeting = meetingDao.update(req.params.id, {
     ...existingMeeting,
     status: req.body.status ?? existingMeeting.status,
     meetingNote:
        req.body.meetingNote ?? existingMeeting.meetingNote,
      id: existingMeeting.id,
    });

    return res.json(updatedMeeting);
  }

  // Future meetings can be updated normally.
  const updatedMeetingData = {
    ...existingMeeting,
    ...req.body,
    id: existingMeeting.id
  };

  if (
    !updatedMeetingData.name ||
    !updatedMeetingData.doctor ||
    !updatedMeetingData.startTime ||
    !updatedMeetingData.endTime ||
    !updatedMeetingData.patientId
  ) {
    return res.status(400).json({
      error: "Meeting name, doctor, start time, end time and patient are required."
    });
  }

  const patient = patientDao.get(updatedMeetingData.patientId);

  if (!patient) {
    return res.status(400).json({
      error: "Assigned patient does not exist."
    });
  }

  const startDate = new Date(updatedMeetingData.startTime);
  const endDate = new Date(updatedMeetingData.endTime);

  if (startDate < now) {
    return res.status(400).json({
      error: "Meeting cannot be moved into the past."
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      error: "End time must be after start time."
    });
  }

  if (
    updatedMeetingData.status &&
    !allowedStatuses.includes(updatedMeetingData.status)
  ) {
    return res.status(400).json({
      error: "Invalid meeting status."
    });
  }

  const patientMeetings = meetingDao
    .list()
    .filter(
      (meeting) =>
        meeting.patientId === updatedMeetingData.patientId &&
        meeting.id !== existingMeeting.id
    );

  const conflict = patientMeetings.find((meeting) =>
    isMeetingOverlapping(
      meeting,
      updatedMeetingData.startTime,
      updatedMeetingData.endTime
    )
  );

  if (conflict) {
    return res.status(400).json({
      error: "This patient already has a meeting at this time."
    });
  }

  const updatedMeeting = meetingDao.update(req.params.id, updatedMeetingData);

  res.json(updatedMeeting);
});

app.post("/meeting/delete/:id", (req, res) => {
  const deletedMeeting = meetingDao.remove(req.params.id);

  if (!deletedMeeting) {
    return res.status(404).json({
      error: "Meeting not found."
    });
  }

  res.json({
    message: "Meeting deleted.",
    meeting: deletedMeeting
  });
});

app.listen(PORT, () => {
  console.log(`Medicalendar backend running on http://localhost:${PORT}`);
});