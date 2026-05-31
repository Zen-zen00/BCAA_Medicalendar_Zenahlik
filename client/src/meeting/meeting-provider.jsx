import { createContext, useContext, useEffect, useState } from "react";

const MeetingContext = createContext();

function MeetingProvider({ children }) {
  const [meetingList, setMeetingList] = useState(null);
  const [error, setError] = useState(null);

  async function loadMeetings() {
    try {
      setError(null);

      const response = await fetch("http://localhost:3000/meeting/list");
      const data = await response.json();

      setMeetingList(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function createMeeting(dtoIn) {
    try {
      setError(null);

      const response = await fetch("http://localhost:3000/meeting/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtoIn),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create meeting.");
      }

      await loadMeetings();

      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function updateMeeting(id, dtoIn) {
  try {
    setError(null);

    const response = await fetch(
      `http://localhost:3000/meeting/update/${id}`,
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
      throw new Error(data.error || "Failed to update meeting.");
    }

    await loadMeetings();

    return data;
  } catch (e) {
    setError(e.message);
    throw e;
  }
}

  async function deleteMeeting(id) {
  try {
    setError(null);

    const response = await fetch(
      `http://localhost:3000/meeting/delete/${id}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete meeting.");
    }

    await loadMeetings();

    return data;
  } catch (e) {
    setError(e.message);
    throw e;
  }
}

  useEffect(() => {
    loadMeetings();
  }, []);

  const value = {
    data: meetingList,
    error,
    handlerMap: {
      loadMeetings,
      createMeeting,
      updateMeeting,
      deleteMeeting,
    },
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
}

function useMeeting() {
  return useContext(MeetingContext);
}

export { MeetingProvider, useMeeting };