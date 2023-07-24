const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const url = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

const getAssetsByOwner = async (ownerAddress) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: ownerAddress,
        page: 1, // Starts at 1
        limit: 100,
      },
    }),
  });
  const { result } = await response.json();

  let nfts = [];

  result.items.map((item) => {
    let nft = {
      title: item["content"]["metadata"]["name"],
      description: item["content"]["metadata"]["description"],
      image: item["content"]["files"][0]
        ? item["content"]["files"][0]["cdn_uri"] == null
          ? item["content"]["files"][0]["uri"]
          : item["content"]["files"][0]["cdn_uri"]
        : null,
      link: `https://xray.helius.xyz/token/${item.id}`,
    };
    nfts.push(nft);
  });

  return nfts;
};

export default async function handler(req, res) {
  let ownerAddress = req.body.ownerAddress;

  console.log(ownerAddress);

  let response = await getAssetsByOwner(ownerAddress);

  res.status(200).json({ nfts: response });
}
