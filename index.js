const erc20Abi = require('./ERC20.json');
const tokens = require('./tokens.json');
const fs = require('fs');

const Web3 = require('web3');

const rpcUrl = "http://192.168.1.2:9545";

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

async function main() {
  const blockNumber = await web3.eth.getBlockNumber();
  console.log('block Number:', blockNumber);
  const blockCntPerRequest = 10000;
  const addressList = {};

  const scanFunc = async (v)=>{
    console.log('scan Transfer event', v.symbol, 'at', v.tokenWanAddr);
    const sc = new web3.eth.Contract(erc20Abi, v.tokenWanAddr);
    addressList[v.symbol] = [];

    for(let p = 0; p < blockNumber / blockCntPerRequest; p++) {
      const ret = await sc.getPastEvents('Transfer', {
        fromBlock: p * blockCntPerRequest,
        toBlock: (p+1) * blockCntPerRequest,
      });
  
      for (let i=0; i<ret.length; i++) {
        console.log(v.symbol, ret[i].returnValues.to);
        if (!addressList[v.symbol].includes(ret[i].returnValues.to)) {
          addressList[v.symbol].push(ret[i].returnValues.to);
        }
      }
    }
  }

  for (let m=0; m<tokens.length; m++) {
    await scanFunc(tokens[m]);
  }

  fs.writeFileSync('scan_result.json', JSON.stringify(addressList, null, 2));
  console.log('all finish');
  process.exit(0);
}

main();