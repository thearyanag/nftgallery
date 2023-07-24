import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import dynamic from "next/dynamic";
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function NavBar() {
  const { setVisible } = useWalletModal();

  const [image, setImage] = useState(null);

  const { connected, publicKey } = useWallet();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImage = (e) => {
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    console.log(image);
  };

  const handleUpload = () => {3
    console.log(image.split(',')[1])
    let imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    const response = fetch("/api/uploadNFT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerAddress: publicKey.toBase58(),
        imageLink: imageBuffer,
      }),
    });
  };

  const handleConnect = () => {
    setVisible(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload a NFT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Starting with Solana"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} maxLength={32} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Chose your NFT</Form.Label>
              <Form.Control type="file" onChange={handleImage} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">My NFT Gallery</Navbar.Brand>

          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Button
                variant={connected ? "primary" : "outline-warning"}
                disabled={!connected}
                onClick={handleShow}
              >
                Upload NFT
              </Button>
              <Button
                variant={connected ? "outline-warning" : "primary"}
                style={{ padding: "0.5rem" }}
                onClick={handleConnect}
              >
                {connected ? "Connected" : "Connect Wallet"}
              </Button>{" "}
            </Nav>
            <Navbar.Text>
              Made by : <a href="http://twitter.com/_0xaryan">0xaryan</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
