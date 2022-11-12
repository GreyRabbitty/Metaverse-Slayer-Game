import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from "../../Components/LoadingIndicator";
/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
/*
* We are going to need to update our character NFT so pass setCharacterNFT here.
*/
const Arena = ({ characterNFT, setCharacterNFT, currentAccount }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  /*
  * State that will hold our boss metadata
  */
  const [boss, setBoss] = useState(null);
  /*
  * We are going to use this to add a bit of fancy animations during attacks
  */
  const [attackState, setAttackState] = useState('');
  /*
  * Toast state management
  */
  const [showToast, setShowToast] = useState(false);
  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  // UseEffects
  useEffect(() => {
    /*
    * Setup async function that will get the boss from our contract and sets in state
    */
    const fetchBoss = async () => {
        const bossTxn = await gameContract.getBigBoss();
        console.log('Boss:', bossTxn);
        setBoss(transformCharacterData(bossTxn));
    };

    if (gameContract) {
        /*
        * gameContract is ready to go! Let's fetch our boss
        */
        fetchBoss();
    }
  }, [gameContract]);

  // Actions
  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('attacking');
        console.log('Attacking boss...');
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');
        /*
        * Set your toast state to true and then false 5 seconds later
        */
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
    }
  };

  // UseEffects
  useEffect(() => {
    const fetchBoss = async () => {
        const bossTxn = await gameContract.getBigBoss();
        console.log('Boss:', bossTxn);
        setBoss(transformCharacterData(bossTxn));
    };

    /*
    * Setup logic when this event is fired off
    */
    const onAttackComplete = (from, newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();
        const sender = from.toString();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * If player is our own, update both player and boss Hp
        */
        if (currentAccount === sender.toLowerCase()) {

          setBoss((prevState) => {
              return { ...prevState, hp: bossHp };
          });
          setCharacterNFT((prevState) => {
              return { ...prevState, hp: playerHp };
          });
        }
        /*
        * If player isn't ours, update boss Hp only
        */
        else {
          setBoss((prevState) => {
              return { ...prevState, hp: bossHp };
          });
        }
    }

    if (gameContract) {
        fetchBoss();
        gameContract.on('AttackComplete', onAttackComplete);
    }

    /*
    * Make sure to clean up this event when this component is removed
    */
    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
  }, [gameContract]);


  return (
    <div className="arena-container">
      {/* Add your toast HTML right here */}
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}

      {/* Boss */}
      {boss && (
        <div className="boss-container">
        {/* Add attackState to the className! After all, it's just class names */}
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
            {/* Add this right under your attack button */}
            {attackState === 'attacking' && (
              <div className="loading-indicator">
                <LoadingIndicator />
                <p>Attacking ⚔️</p>
              </div>
            )}
          </div>
        </div>
      )}
  
      {/* Replace your Character UI with this */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;