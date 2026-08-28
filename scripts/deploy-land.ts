import { ethers } from "hardhat";

async function main() {
  const Land = await ethers.getContractFactory("Land");
  const land = await Land.deploy();
  await land.waitForDeployment();

  console.log("Land deployed to:", await land.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
