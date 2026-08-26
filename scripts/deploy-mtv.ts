import { ethers } from "hardhat";

async function main() {
  const MTVERC20 = await ethers.getContractFactory("MTVERC20");
  const token = await MTVERC20.deploy();
  await token.waitForDeployment();

  console.log("MTVERC20 deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
