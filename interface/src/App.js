/*
 * We are going to need to use state now! Don't forget to import useState
 */
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
/*
* Just add transformCharacterData!
*/
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  /*
  * Right under current account, setup this new state property
  */
  const [characterNFT, setCharacterNFT] = useState(null);
  /*
  * New state property added here
  */
  const [isLoading, setIsLoading] = useState(false);
  /*
   * Since this method will take some time, make sure to declare it as async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        /*
         * We set isLoading here because we use return in the next line
         */
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * We release the state property after all the function logic
     */
    setIsLoading(false);
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderContent = () => {
    /*
    * If the app is currently loading, just render out LoadingIndicator
    */
    if (isLoading) {
      return <LoadingIndicator />;
    }
    /*
    * Scenario #1
    */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media.tenor.com/YRAFFN7EnwUAAAAC/woo-cheer.gif"
            alt="Monty Python Gif"
          />
          { /*
             * Button that we will use to trigger wallet connect
             * Don't forget to add the onClick event to call your method!
             */ }
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
      * Scenario #2
      */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;	
    /*
    * If there is a connected wallet and characterNFT, it's time to battle!
    */
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />;
    }
  }; 

  // UseEffects
  useEffect(() => {
    /*
    * Anytime our component mounts, make sure to immiediately set our loading state
    */
    setIsLoading(true);

    checkIfWalletIsConnected();

    const checkNetwork = async () => {
      try { 
        if (window.ethereum.networkVersion !== '5') {
          alert("Please connect to Goerli!")
        }
      } catch(error) {
        console.log(error)
      }
    }
  }, []);

  /*
  * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
  */
  useEffect(() => {
    /*
    * The function we will call that interacts with our smart contract
    */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      console.log(txn);
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }

      /*
      * Once we are done with all the fetching, set loading state to false
      */
      setIsLoading(false);
    };

    /*
    * We only want to run this, if we have a connected wallet
    */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer : Teen Titans ⚔️</p>
          <p className="sub-text">Team up with Teen Titans to protect the Metaverse from Evil Bad Guys!</p>
       {/* This is where our button and image code used to be!
         *	Remember we moved it into the render method.
         */}
        {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
