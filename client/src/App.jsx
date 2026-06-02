import "bootstrap/dist/css/bootstrap.min.css";

import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppNavbar from "./common/navbar";

import { PatientProvider } from "./patient/patient-provider";
import { MeetingProvider } from "./meeting/meeting-provider";

import PatientListPage from "./patient/patient-list-page";
import SchedulePage from "./schedule/schedule-page";

function App() {
  return (
    <BrowserRouter>
      <PatientProvider>
        <MeetingProvider>
          <AppNavbar />

          <Container fluid className="mt-4 px-4">
            <Routes>
              <Route path="/" element={<SchedulePage />} />
              <Route path="/patients" element={<PatientListPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </MeetingProvider>
      </PatientProvider>
    </BrowserRouter>
  );
}

export default App;