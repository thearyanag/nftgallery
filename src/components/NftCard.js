import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "@/components/NftCard.module.css"

function NftCard(props) {
  let { name, description, image, link } = props;

  description = description ? description : "No description available";

  return (
    <Card style={{ width: "20rem", padding: "1rem", margin: "1rem" }}>
      <Card.Img variant="top" src={image} width={"5rem"} height={"200rem"} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description.substring(0, 50)}...</Card.Text>
        <Button variant="primary" target="_blank" href={link}>
          View on X-Ray
        </Button>
      </Card.Body>
    </Card>
  );
}

export default NftCard;
