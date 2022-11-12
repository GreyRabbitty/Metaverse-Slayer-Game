const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(                     
      ["Robin", "Cyborg", "Beast Boy", "Star Fire", "Terra", "Reven"],
      ["https://www.pngkey.com/png/detail/336-3369002_teen-titans-go-robin-download-teen-titans-go.png",
      "https://www.pngkey.com/png/detail/210-2109544_cyborg-teen-titans-go-drawing-download-cartoon-cyborg.png", 
      "https://www.pngkey.com/png/detail/131-1311924_clip-art-images-beast-boy-bro-down-book.png",
      "https://www.pngkey.com/png/detail/160-1600471_starfire-star-fire-teen-titans-go.png",
      "https://www.pngkit.com/png/detail/192-1922585_view-samegoogleiqdbsaucenao-terrahdpure-teen-titans-go-terra.png",
      "https://www.kindpng.com/picc/m/18-186343_raven-teen-titans-go-lady-legasus-hd-png.png"],
      [500, 300, 300, 400, 400, 450],                    
      [100, 25, 25, 50, 50, 75],
      "Dead Pool",
      "https://www.pngkit.com/png/detail/307-3074386_slade-wilson-teen-titans-go-deadpool.png",
      750,
      100                  
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
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