import React, { useEffect, useState } from "react";
import "./button.css";


function checkIfWalletIsConnected(onConnected) { }

function connect(onConnected) { }


export function Connect({ setUserAddress }) {
    return (
        <button className="button" onClick={() => connect(setUserAddress)}>
            Connect to MetaMask
        </button>
    );
}


export function Address({ userAddress }) {
    return (
        <div>
            <span className="address">{userAddress.substring(0, 5)}…{userAddress.substring(userAddress.length - 4)}</span>
        </div>
    );
}

// export function MetaMaskAuth({ userAccount }) {
//     const [userAddress, setUserAddress] = useState("");

//     useEffect(() => {
//         setUserAddress(userAccount);
//         console.log("triggered : " + userAccount);
//     }, []);

//     return userAddress ? (
//         <div>
//             Connected with <Address userAddress={userAddress} />
//         </div>
//     ) : (
//         <Connect setUserAddress={setUserAddress} />
//     );
// }