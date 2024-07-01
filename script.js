//Prelimanary steps:
//1. deploy dca contract
//2. transfer usdc to dca contract


const ethers =  require("ethers");
// const Contract = require("ethers");
require('dotenv').config();

const {Contract} = ethers;

const budget = 1000*(10^6);
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" ;
const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const DCA_ADDRESS= "";


const init = async () =>{
    const API_KEY = process.env.INFURA_KEY;
//1. connect to chain
const provider = new ethers.InfuraProvider(
    "mainnet",
    API_KEY
);
//2. create obeject to interact with uniswap 
const connectRouter = new Contract(
    ROUTER_ADDRESS,
    ["function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)"],
    provider
);
//3. get current price of ether,and set our tolerance (slippage)
const amountsOut = await connectRouter.getAmountsOut(budget, [USDC_ADDRESS,WETH_ADDRESS]);
// console.log(amountsOut[0].toString());
// console.log(amountsOut[1].toString());

const ethMin = amountsOut[1] * BigInt(95) / BigInt(100);
const timestamp = (await provider.getBlock('latest')).timestamp;
const timeLimit = timestamp + 60 * 10;
// console.log(ethMin.toString());

//4. create object to interact with dca smart contract 
const signer = provider.getSigner();
const connectDCA = new Contract(
    DCA_ADDRESS,
    ["function invest(uint ethMin,uint deadline) external "],
    signer
);
//5. send a txn to call invest() fn
    const txn = await connectDCA.invest(ethMin,timeLimit);
    await txn.wait();
    window.location.reload();
}

init();

// setInterval(init,86400*1000*30);