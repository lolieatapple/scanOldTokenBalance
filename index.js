const erc20Abi = require('./ERC20.json');
const tokens = require('./tokens.json');
const smgErc20Abi = require('./smgERC20.json');
const smgWethAbi = require('./smgWETH.json');

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
    const smgErc20 = new web3.eth.Contract(smgErc20Abi, '0x71d23563729f81fc535cbb772e52660ca5be755e');
    const smgWeth = new web3.eth.Contract(smgWethAbi, '0x7a333ba427fce2e0c6dd6a2d727e5be6beb13ac2');

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

      const retErc20 = await smgErc20.getPastEvents('InboundRedeemLogger', {
        fromBlock: p * blockCntPerRequest,
        toBlock: (p+1) * blockCntPerRequest,
      });

      for (let i=0; i<retErc20.length; i++) {
        console.log(v.symbol, retErc20[i].returnValues.wanAddr);
        if (!addressList[v.symbol].includes(retErc20[i].returnValues.wanAddr)) {
          addressList[v.symbol].push(retErc20[i].returnValues.wanAddr);
        }
      }

      const retWeth = await smgWeth.getPastEvents('ETH2WETHRefund', {
        fromBlock: p * blockCntPerRequest,
        toBlock: (p+1) * blockCntPerRequest,
      });

      for (let i=0; i<retWeth.length; i++) {
        console.log(v.symbol, retWeth[i].returnValues.wanAddr);
        if (!addressList[v.symbol].includes(retWeth[i].returnValues.wanAddr)) {
          addressList[v.symbol].push(retWeth[i].returnValues.wanAddr);
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