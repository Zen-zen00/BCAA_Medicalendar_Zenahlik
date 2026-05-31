import { Card } from "react-bootstrap";

function PatientCard({ patient }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{patient.name}</Card.Title>

        <Card.Text className="mb-1">
          <strong>ID:</strong> {patient.id}
        </Card.Text>

        <Card.Text className="mb-1">
          <strong>Birth number:</strong> {patient.birthNumber}
        </Card.Text>

        <Card.Text>
          <strong>Doctor note:</strong>{" "}
          {patient.doctorNote || "No doctor note."}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PatientCard;