import { ethers } from "hardhat";

async function getBalance() {
  try {
    const contractAddress = "0x1F859401781029e86D0fe4981b8061a9314f7D41";

    const vendingMachine = await ethers.getContractAt(
      "VendingMachine",
      contractAddress
    );

    const balance = await vendingMachine.cupcakeBalances(contractAddress);
    console.log("Cupcake balance of contract:", balance.toString());
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}

getBalance();
