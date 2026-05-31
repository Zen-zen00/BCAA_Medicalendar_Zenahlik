import { Navbar, Container, Nav } from "react-bootstrap";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          Medicalendar
        </Navbar.Brand>

        <Nav>
          <Nav.Link>Calendar</Nav.Link>
          <Nav.Link>Patients</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;