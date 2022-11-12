const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Robin", "Cyborg", "Beast-Boy"],       // Names
    ["https://www.pngkey.com/png/detail/336-3369002_teen-titans-go-robin-download-teen-titans-go.png", // Images
    "https://www.pngkey.com/png/detail/210-2109544_cyborg-teen-titans-go-drawing-download-cartoon-cyborg.png", 
    "https://www.pngkey.com/png/detail/131-1311924_clip-art-images-beast-boy-bro-down-book.png"],
    [100, 200, 300],                    // HP values
    [100, 50, 25],
    "Terra", // Boss name
    "https://www.pngkit.com/png/detail/192-1922585_view-samegoogleiqdbsaucenao-terrahdpure-teen-titans-go-terra.png", // Boss image
    1000, // Boss hp
    50 // Boss attack damage                       // Attack damage values
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
  
  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);

  // let txn;
  // txn = await gameContract.mintCharacterNFT(0);
  // await txn.wait();
  console.log("Minted NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #2");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Minted NFT #3");

  txn = await gameContract.mintCharacterNFT(3);
  await txn.wait();
  console.log("Minted NFT #4");

  txn = await gameContract.mintCharacterNFT(4);
  await txn.wait();
  console.log("Minted NFT #5");

  txn = await gameContract.mintCharacterNFT(5);
  await txn.wait();
  console.log("Minted NFT #6");

  console.log("Done deploying and minting!");

  txn = await gameContract.attackBoss();
  await txn.wait(); 

  txn = await gameContract.attackBoss();
  await txn.wait();

  console.log("Done!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();