const hre = require("hardhat")

async function main() {
    const Gaming  = await hre.ethers.getContractFactory("Gaming");
    // deploy contracts
    const gaming  = await Gaming.deploy();
    await gaming.waitForDeployment();
    console.log("gaming deployed to: ", await gaming.getAddress());
    const contractAddress  = await gaming.getAddress();
    saveFrontendFiles(contractAddress  , "Gaming");
}

function saveFrontendFiles(contractAddress, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }


  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

