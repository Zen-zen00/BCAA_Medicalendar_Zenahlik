const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const filePath = path.join(__dirname, "../data/meetings.json");

function loadMeetings() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function saveMeetings(meetings) {
  fs.writeFileSync(filePath, JSON.stringify(meetings, null, 2));
}

function create(meeting) {
  const meetings = loadMeetings();

  const newMeeting = {
    id: "MEET-" + crypto.randomUUID(),
    name: meeting.name,
    doctor: meeting.doctor,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    meetingNote: meeting.meetingNote || "",
    patientId: meeting.patientId,
    status: meeting.status || "upcoming"
  };

  meetings.push(newMeeting);
  saveMeetings(meetings);

  return newMeeting;
}

function list() {
  return loadMeetings();
}

function get(id) {
  const meetings = loadMeetings();
  return meetings.find((meeting) => meeting.id === id);
}

function update(id, updatedData) {
  const meetings = loadMeetings();
  const index = meetings.findIndex((meeting) => meeting.id === id);

  if (index === -1) {
    return null;
  }

  meetings[index] = {
    ...meetings[index],
    ...updatedData,
    id: meetings[index].id
  };

  saveMeetings(meetings);
  return meetings[index];
}

function remove(id) {
  const meetings = loadMeetings();
  const index = meetings.findIndex((meeting) => meeting.id === id);

  if (index === -1) {
    return null;
  }

  const deletedMeeting = meetings.splice(index, 1)[0];
  saveMeetings(meetings);

  return deletedMeeting;
}

function removeByPatientId(patientId) {
  const meetings = loadMeetings();
  const remainingMeetings = meetings.filter(
    (meeting) => meeting.patientId !== patientId
  );

  saveMeetings(remainingMeetings);
}

module.exports = {
  create,
  list,
  get,
  update,
  remove,
  removeByPatientId
};