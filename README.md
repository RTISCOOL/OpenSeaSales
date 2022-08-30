
# Opensea Sales Tracker

This package tracks all opensea NFT sales without using any API. It connects directly to a web3 node and parses all transactions on the chain. 

You can specify a specific token contract address if you would only like to track one NFT collection. 





## Installation

Install openseasales with npm

```bash
  npm install openseasales
```
    
## Usage/Examples
A full example is availible in ./example.js 

Feel free to check it out.
```javascript
var OpenSeaSales = require("openseasales"); 

var sales = OpenSeaSales({
  provider: "Your web3 provider url", // optional ethereum RPC provider. 
  interval: 1500, // optional, default is 1000
  token: "0x0000000000000000000000000000000000000000", // optional NFT contract address
});

sales.on("sale", (sale) => {
  console.log(sale);
});


```

Object that is returned in the event handler
```javascript
 {
    salePrice: (PRICE OF THE SALE IN ETHEREUM BEFORE FEES) (Number),
    token: (TOKEN CONTRACT ADDRESS) (String , Ethereum address),
    identifier: (NFT IDENTIFIER e.g. 1245) (String),
    recipient: (RECIPIENT OF THE SALE) (String , Ethereum address),
    seller: (SELLER OF THE SALE) (String , Ethereum address),
}

```
## Recommended: Use a custom RPC Node

This project defaults to using cloudflares public RPC node for requesting transactions from the chain. 

I **STRONGLY** reccomend that you provide your own in the parameters. 

You can run one yourself, use a free private one, or purchase one. I reccomend https://quicknode.com
## How to find your contract address

If you want to only track one nft collection, 
find your contract address in the details section of opensea, and put it as the token parameter.

![Contract address](https://i.imgur.com/0YCty8z.png)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## Authors

- Ryan Trattner [@RTISCOOL](https://www.github.com/RTISCOOL)

(Sorry, I get angry at relying on 3rd party APIs so I make stuff harder on myself)
## License

[MIT](https://choosealicense.com/licenses/mit/)

