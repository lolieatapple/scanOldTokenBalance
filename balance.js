const erc20Abi = require('./ERC20.json');
const tokens = require('./tokens.json');
const addresses = require('./scan_result.json');
const fs = require('fs');

const Web3 = require('web3');

const rpcUrl = "http://192.168.1.2:9545";

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

async function main() {
  const blockNumber = await web3.eth.getBlockNumber();
  console.log('block Number:', blockNumber);

  const results = [];

  const scanFunc = async (v)=>{
    console.log('check balance event', v.symbol, 'at', v.tokenWanAddr);
    const sc = new web3.eth.Contract(erc20Abi, v.tokenWanAddr);
    const totalSupply = await sc.methods.totalSupply().call();
    let totalBalance = web3.utils.toBN('0');
    for (let i=0; i<addresses[v.symbol].length; i++) {
      const addr = addresses[v.symbol][i];
      const balance = await sc.methods.balanceOf(addr).call();
      const ret = {
        symbol: v.symbol,
        address: addr,
        amount: (balance.toString() / (10 ** v.decimals)).toFixed(4),
        rawAmount: balance.toString(),
        decimals: v.decimals,
      };
      
      if (balance.toString() !== '0') {
        results.push(ret);
      }
      totalBalance = totalBalance.add(web3.utils.toBN(balance.toString()));
    }
    console.log('totalSupply', totalSupply.toString(), 'totalBalance', totalBalance.toString(), 'result', totalSupply.toString() === totalBalance.toString());
  }

  for (let m=0; m<tokens.length; m++) {
    await scanFunc(tokens[m]);
  }

  fs.writeFileSync('balance_result.json', JSON.stringify(results, null, 2));
  console.log('all finish');
  process.exit(0);
}

main();
