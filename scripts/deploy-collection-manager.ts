import { ethers } from "hardhat";

// Existing deployments on Fuji
const MTV_TOKEN_ADDRESS = "0x9d23B68De5CB977a43Df2d002083be5Dab1b74bD";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1. Deploy Rarities with the standard 7-tier set
  const rarityTiers = [
    { name: "common", maxSupply: 100000, price: ethers.parseEther("0") },
    { name: "uncommon", maxSupply: 10000, price: ethers.parseEther("50") },
    { name: "rare", maxSupply: 5000, price: ethers.parseEther("100") },
    { name: "epic", maxSupply: 1000, price: ethers.parseEther("250") },
    { name: "legendary", maxSupply: 100, price: ethers.parseEther("750") },
    { name: "mythic", maxSupply: 10, price: ethers.parseEther("2500") },
    { name: "unique", maxSupply: 1, price: ethers.parseEther("5000") },
  ];

  const Rarities = await ethers.getContractFactory("Rarities");
  const rarities = await Rarities.deploy(rarityTiers);
  await rarities.waitForDeployment();
  const raritiesAddress = await rarities.getAddress();
  console.log("Rarities deployed to:", raritiesAddress);

  // 2. Deploy Committee, owned by the deployer, with the deployer as the sole member
  const Committee = await ethers.getContractFactory("Committee");
  const committee = await Committee.deploy(deployer.address, [deployer.address]);
  await committee.waitForDeployment();
  const committeeAddress = await committee.getAddress();
  console.log("Committee deployed to:", committeeAddress);

  // 3. Deploy ERC721CollectionManager, allowing the committee to call setApproved
  const setApprovedSelector = ethers
    .id("setApproved(bool)")
    .slice(0, 10); // first 4 bytes (function selector)

  const ERC721CollectionManager = await ethers.getContractFactory("ERC721CollectionManager");
  const manager = await ERC721CollectionManager.deploy(
    deployer.address, // _owner
    MTV_TOKEN_ADDRESS, // _acceptedToken
    committeeAddress, // _committee
    deployer.address, // _feesCollector
    raritiesAddress, // _rarities
    [setApprovedSelector], // _committeeMethods
    [true] // _committeeValues
  );
  await manager.waitForDeployment();
  const managerAddress = await manager.getAddress();
  console.log("ERC721CollectionManager deployed to:", managerAddress);

  console.log("\nDeployed addresses:");
  console.log({
    raritiesAddress,
    committeeAddress,
    managerAddress,
    acceptedToken: MTV_TOKEN_ADDRESS,
    feesCollector: deployer.address,
    owner: deployer.address,
    setApprovedSelector,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
