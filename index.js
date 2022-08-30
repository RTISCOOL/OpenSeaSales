var OpenSeaSales = (options = {}) => {
    var Web3 = require("web3");
  
    const Web3EthAbi = require("web3-eth-abi");
    const EventEmitter = require("events");
  
    var provider = options.provider || "https://cloudflare-eth.com/v1/mainnet";
    var web3Provider = new Web3.providers.HttpProvider(provider);
    var web3 = new Web3(web3Provider);
    const eventEmitter = new EventEmitter();
  
    var topicHash = web3.utils.sha3(
      web3.utils.toHex(
        "OrderFulfilled(bytes32,address,address,address,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256,address)[])"
      ),
      { encoding: "hex" }
    );
    var logDecoder = [
      {
        type: "bytes32",
        name: "orderHash",
      },
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "tuple[]",
        name: "offer",
        components: [
          {
            type: "uint8",
            name: "itemType",
          },
          {
            type: "address",
            name: "token",
          },
          {
            type: "uint256",
            name: "identifier",
          },
          {
            type: "uint256",
            name: "amount",
          },
        ],
      },
      {
        type: "tuple[]",
        name: "consideration",
        components: [
          {
            type: "uint8",
            name: "itemType",
          },
          {
            type: "address",
            name: "token",
          },
          {
            type: "uint256",
            name: "identifier",
          },
          {
            type: "uint256",
            name: "amount",
          },
          {
            type: "address",
            name: "recipient",
          },
        ],
      },
    ];
  
    async function getTransactionLogs(blockid) {
      var block = await web3.eth.getBlock(blockid);
      var ts = [];
      for (var i = 0; i < block.transactions.length; i++) {
        var transaction = await getTransaction(block.transactions[i]);
        for (var x = 0; x < transaction.logs.length; x++) {
          var log = transaction.logs[x];
          if (log.topics.includes(topicHash)) {
            ts.push(log);
            break;
          }
        }
      }
      return ts;
    }
    async function getTransaction(txid) {
      var tx = await web3.eth.getTransactionReceipt(txid);
      return tx;
    }
    function parseTransaction(transactionData, onlyToken) {
      var log = null;
      try {
        log = Web3EthAbi.decodeLog(logDecoder, transactionData, []);
      } catch (e) {
        return false;
      }
      if (onlyToken) {
        try {
          if (log.offer[0].token != onlyToken) {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
      if (log.offer.length == 0) {
        return false;
      }
      var totalPrice = 0;
      var highest = 0;
      var seller = "";
      for (var i = 0; i < log.consideration.length; i++) {
        var price = log.consideration[i].amount / 1000000000000000000;
        totalPrice += price;
        if (price > highest) {
          highest = price;
          seller = log.consideration[i].recipient;
        }
      }
      return {
        salePrice: totalPrice,
        token: log.offer[0].token,
        identifier: log.offer[0].identifier,
        recipient: log.recipient,
        seller: seller,
      };
    }
    async function doTransactionParsing(log) {
      var parsedTransaction = parseTransaction(log.data, options.token || null);
      if (parsedTransaction) {
        eventEmitter.emit("sale", parsedTransaction);
      }
    }
    async function loop(lastCheckedBlock = 0) {
      var latestBlock = await web3.eth.getBlockNumber();
      if (latestBlock > lastCheckedBlock) {
        if (lastCheckedBlock == 0) {
          await checkBlock(latestBlock);
        } else {
          for (var i = 1; i <= latestBlock - lastCheckedBlock; i++) {
            await checkBlock(lastCheckedBlock + i);
          }
        }
      }
      setTimeout(() => loop(latestBlock), options.interval || 1000);
    }
    async function checkBlock(blockid) {
     // console.log("Checking Block " + blockid);
      var logs = await getTransactionLogs(blockid);
      for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        doTransactionParsing(log);
      }
    }
    loop();
    return eventEmitter;
  };
  
  
  module.exports = OpenSeaSales;
  
  