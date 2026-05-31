import "bootstrap/dist/css/bootstrap.min.css";

import { Container } from "react-bootstrap";

import AppNavbar from "./common/navbar";
import { PatientProvider } from "./patient/patient-provider";
import PatientListPage from "./patient/patient-list-page";

function App() {
  return (
    <PatientProvider>
      <AppNavbar />

      <Container className="mt-4">
        <PatientListPage />
      </Container>
    </PatientProvider>
  );
}

export default App;