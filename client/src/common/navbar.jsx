import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Medicalendar
        </Navbar.Brand>

        <Nav>
          <Nav.Link as={Link} to="/">
            Calendar
          </Nav.Link>
          <Nav.Link as={Link} to="/patients">
            Patients
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;