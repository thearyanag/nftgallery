import axios from "axios";
import { Buffer } from "buffer";

const { NFTStorage, File } = require("nft.storage");

const uploadToIPFS = async (imageBuffer, name) => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

  name = name.replace(" ", "_");

  let image = new File([imageBuffer], `${name}.png` , { type: "image/png" });

  const metadata = await client.store({
    name: name,
    description: `${name} is a unique NFT generated and stored on IPFS.`,
    image: image,
  });

  let url = metadata.data.image.href;
  let cid = url.split("/")[2];
  let fileName = url.split("/")[3];
  let httpURL = `https://${cid}.ipfs.dweb.link/${fileName}`;
  return httpURL;
};

const uploadToUnderdog = async (name, ipfsLink, receiverAddress) => {
  let data = JSON.stringify({
    name: name,
    image: ipfsLink,
    receiverAddress: receiverAddress,
  });

  console.log(data);

  const token = process.env.UNDERDOG_PROTOCOL_API_KEY;

  let config = {
    method: "post",
    url: "https://api.underdogprotocol.com/v2/projects/1/nfts",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  const result = await axios(config);
  console.log(result.data.mintAddress);
  return result.data.mintAddress;
};

export default async function handler(req, res) {
  let { ownerAddress, imageLink , name , description } = req.body;

  let imageBuffer = Buffer.from(imageLink, "base64");
  let ipfsLink = await uploadToIPFS(imageBuffer, ownerAddress);
  console.log(ipfsLink);
}
