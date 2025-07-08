import React,{ useState, useEffect } from 'react'
import { ethers, BrowserProvider } from "ethers";
import { providers } from 'ethers/providers';
import GamingAbi from './contractsData/Gaming.json'
import GamingAddress from './contractsData/Gaming-address.json'

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [result, setResult] = useState("");
  const [wager, setWager] = useState("");
  const [display, setDisplay] = useState("");
  const [guess, setGuess] = useState(true); // true for higher, false for lower
  const [playerSessions, setPlayerSessions] = useState([]);

  useEffect(() => {
     // Connect to Ethereum
    const initialize = async () => {
    // const web3Provider = new ethers.JsonRpcProvider("http://ec2-18-118-218-38.us-east-2.compute.amazonaws.com:8545");
    const web3Provider = new BrowserProvider(window.ethereum);
    setProvider(web3Provider);
    const signer = await web3Provider.getSigner(0);
    setSigner(signer);
    const GamingContract = new ethers.Contract(GamingAddress.address, GamingAbi.abi, signer);
    setContract(GamingContract);
 };
    initialize();
  }, [GamingAddress, GamingAbi]);

  const fundGame = async () => {
    var line = ""
    const tx1 = await contract.fundGame({ value: ethers.parseEther("100.0")})
    await tx1.wait();
  }

  const playGame = async () => {
     var line = ""
     const tx = await contract.winOrLose(display , guess , {from: signer[0] ,value: ethers.parseEther(wager) })
     await tx.wait();
     const events = await contract.queryFilter("RoundComplete");
     const objectLength = Object.keys(events).length
     console.log("objectLength=>", objectLength)
     console.log("events=>",events)

     const sessions = events.map((event) => ({
       wager: ethers.formatEther(event.args[0]),
       playerNumber: event.args[1].toString(),
       mysteryNumber: event.args[2].toString(),
       guess: event.args[3],
       result: event.args[4],
     }));
     setPlayerSessions(sessions.reverse()); // Show latest first
  };

 return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gaming DApp</h1>
    <div>
            <h3>Play Game</h3>
            <input
              type="number"
              placeholder="Wager (ETH)"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
            />
            <input
              type="number"
              placeholder="Your Number (Display)"
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
            />
            <div>
              <label>
                <input
                  type="radio"
                  name="guess"
                  checked={guess}
                  onChange={() => setGuess(true)}
                />
                Higher
              </label>
              <label>
                <input
                  type="radio"
                  name="guess"
                  checked={!guess}
                  onChange={() => setGuess(false)}
                />
                Lower
              </label>
            </div>
          </div>

        <div style={{ marginTop: "20px" }}>
        <button onClick={fundGame}>Fund Game</button>
        <button onClick={playGame}>Play Game</button>

        </div>
        <div style={{ marginTop: "20px" }}>
            <h3>Player Sessions</h3>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
                border: "1px solid #ccc",
                padding: "10px",
              }}
         >
       {playerSessions.length === 0 ? (
                <p>No sessions found</p>
              ) : (
                playerSessions.map((session, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <p><b>Wager:</b> {session.wager} ETH</p>
                    <p><b>Your Number:</b> {session.playerNumber}</p>
                    <p><b>Mystery Number:</b> {session.mysteryNumber}</p>
                    <p><b>Guess:</b> {session.guess ? "Higher" : "Lower"}</p>
                    <p><b>Result:</b> {session.result}</p>
                    <hr />
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
  );
};

export default App;

