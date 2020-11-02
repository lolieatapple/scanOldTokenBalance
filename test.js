const erc20Abi = require('./ERC20.json');

const Web3 = require('web3');

const rpcUrl = "http://192.168.1.2:9545";

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const sc = new web3.eth.Contract(erc20Abi, '0x28362cd634646620ef2290058744f9244bb90ed9');


async function main() {
  let balance = await sc.methods.balanceOf('0x7a333ba427fce2e0c6dd6a2d727e5be6beb13ac2').call();
  console.log('balance', balance, web3.utils.fromWei(balance));

  console.log(web3.utils.toBN(balance.toString()).add(web3.utils.toBN('1053928692538026678')).toString());
}

main();

// 1281631692538026678
// 1281631692538026678