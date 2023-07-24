import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import NavBar from "@/components/Navbar";
import NftCard from "@/components/NftCard";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const { publicKey, connected } = useWallet();
  let col = 3;

  const getNfts = async () => {
    if (!connected) {
      return;
    }
    const response = await fetch("/api/getNFT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerAddress: publicKey.toBase58(),
      }),
    });
    const { nfts } = await response.json();
    setNfts(nfts);
  };

  useEffect(() => {
    getNfts();
  }, [connected]);

  return (
    <>
    

      <NavBar />
      <Container>
        <br />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Row>
            {nfts.map((nft) => (
              <Col md={col} key={nft.link}>
                <NftCard
                  name={nft.title}
                  link={nft.link}
                  description={nft.description}
                  image={nft.image}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
}
