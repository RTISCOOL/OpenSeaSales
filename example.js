var OpenSeaSales = require("./index"); // USE require("openseasales") if you are using npm and not cloning the repo.

var sales = OpenSeaSales({
  provider: "Your web3 provider url", // optional, defaults to https://cloudflare-eth.com/v1/mainnet
  interval: 1500, // optional, default is 1000
  token: "0x0000000000000000000000000000000000000000", // optional NFT contract address, default will return all sales from ANY NFT contract
});
sales.on("sale", (sale) => {
  console.log(sale);
  /*
        {
        salePrice: (PRICE OF THE SALE IN ETHEREUM BEFORE FEES) (Number),
        token: (TOKEN CONTRACT ADDRESS) (String , Ethereum address),
        identifier: (NFT IDENTIFIER e.g. 1245) (String),
        recipient: (RECIPIENT OF THE SALE) (String , Ethereum address),
        seller: (SELLER OF THE SALE) (String , Ethereum address),
        }
  */
});
