import { ethers } from "hardhat";

// Existing deployments on Fuji
const FORWARDER_ADDRESS = "0xb6f959A85949000bcc6cF1fC34231e8A1e87a26c";
const FACTORY_ADDRESS = "0xcfEE6fE617C90FBDB38BB43231041b7b2a74999B";
const MANAGER_ADDRESS = "0xA0E7B3c996e54592C6B90DD1d1864c954074E4F7";

async function main() {
  const [deployer] = await ethers.getSigners();

  const manager = await ethers.getContractAt("ERC721CollectionManager", MANAGER_ADDRESS);
  const factory = await ethers.getContractAt("ERC721CollectionFactory", FACTORY_ADDRESS);

  const salt = ethers.hexlify(ethers.randomBytes(32));
  const items = [
    {
      rarity: "common",
      price: 0, // item-level primary sale price, unrelated to the rarity creation fee
      beneficiary: ethers.ZeroAddress, // must be zero when price is 0
      metadata: "test item metadata",
    },
  ];

  console.log("Creating collection...");
  const tx = await manager.createCollection(
    FORWARDER_ADDRESS,
    FACTORY_ADDRESS,
    salt,
    "Test Collection",
    "TEST",
    "https://example.com/metadata/",
    deployer.address, // _creator
    items
  );
  console.log("Tx sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Tx mined in block:", receipt?.blockNumber);

  const collectionsSize = await factory.collectionsSize();
  console.log("Total collections in factory:", collectionsSize.toString());

  const newCollectionAddress = await factory.collections(collectionsSize - 1n);
  console.log("New collection deployed to:", newCollectionAddress);

  const isFromFactory = await factory.isCollectionFromFactory(newCollectionAddress);
  console.log("isCollectionFromFactory:", isFromFactory);

  const collection = await ethers.getContractAt("ERC721Collection", newCollectionAddress);
  console.log("Collection name:", await collection.name());
  console.log("Collection symbol:", await collection.symbol());
  console.log("Collection owner:", await collection.owner());
  console.log("Collection isApproved:", await collection.isApproved());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
