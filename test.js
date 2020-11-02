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

// USDT 	1351926595
//        1351926595

// SAI    2150006
//        2150006000000000000

// MKR    0.031925
//        31924999999999995

// AURA   4.180005
//        4180005000000000000

// LRC    8.180104
//        8180104000000000001

// LINK   14.276548
//        14276548000000000000

// GUSD   0.11
//        11

// TUSD
//        0

// USDC
//        0

// ZXC    0.01
//        10000000000000000

// EURS
//        0

// WETH   0.79974469
//        1281631692538026678