import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import tokenContract from "../contracts/contract.json";  // Full artifact import including ABI and bytecode
import extContract from "../contracts/rawABI.json"; // Raw ABI import (pulled from etherscan)

export default function Home() {
  const CONTRACT_ADDRESS = "0x0556b26dEf59b23735f3170918225845da831C14";

  const [supplyData, setSupplyData] = useState("0");


  const contractConfig = {
    address: CONTRACT_ADDRESS,
    //abi: tokenContract.abi,
    abi: extContract,
  };

  /***************************************************************************** */
  // Mint Function - with payable option

  /** @dev Setup Prepare contract to grab information before button execution
   * The information is "Prepared" before you push the button for execution
   */
   const { config: paybableMinter, error: mintError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: tokenContract.abi,
    functionName: "mint",
    args: [],
    overrides: {
      value: ethers.utils.parseEther('0.01'),
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  /** @dev Pull the "adminMinter" config from the usePrepareContractWrite hook
   *  Put it into the "mintAdmin" function to execute in the front end
   */
  const {
    data: mintData,
    isMintDataLoading,
    write: mint,
  } = useContractWrite(paybableMinter);

  /* *************************************************************************** */



  /***************************************************************************** */
  // Admin Mint Function

  /** @dev Setup Prepare contract to grab information before button execution
   * The information is "Prepared" before you push the button for execution
   */
  const { config: adminMinter, error: adminError } = usePrepareContractWrite({
    ...contractConfig,
    // address: CONTRACT_ADDRESS,
    // abi: tokenContract.abi,
    functionName: "adminMint",
    args: ["0xe2b8651bF50913057fF47FC4f02A8e12146083B8"], //hardcoded address can create a state variable
    onError(error) {
      console.log("Error", error);
    },
  });

  /** @dev Pull the "adminMinter" config from the usePrepareContractWrite hook
   *  Put it into the "mintAdmin" function to execute in the front end
   */
  const {
    data: mintAdminData,
    isMintLoading,
    write: mintAdmin,
  } = useContractWrite(adminMinter);

  /* *************************************************************************** */



  /***************************************************************************** */
  // Read Function
  /** @dev Read the total supply of the token
   *  Data is set to "totalSupply" variable
   * NOTE, THERE IS CURRENTLY A CONSOLE BUG WITH THE READ FUNCTION HOOK
   * The isDataEqual option has been deprecated and will be removed in the next release....
   */
  const { data: totalSupplyData, error: totalError } = useContractRead({
    ...contractConfig,
    functionName: "totalSupply",
  });
  /* *************************************************************************** */


  useEffect(() => {
    if (totalSupplyData) {
      let temp = totalSupplyData;
      setSupplyData(temp.toString());
    }
  }, [totalSupplyData]);

  /* console.log data to view variables */
  useEffect(() => {
    console.log("mintData:", mintAdminData);
    console.log("isMintLoading:", isMintLoading);
    console.log("totalSupplyData:", totalSupplyData.toString());
    console.log("___________");
  }, [mintAdminData, isMintLoading, totalSupplyData]);

  return (
    <div className="container flex flex-col  items-center mt-10">
      <div className="flex mb-6">
        <ConnectButton showBalance={false} />
      </div>
      <h3 className="text-5xl font-bold mb-20">{"D_D's token drop"}</h3>

      <div className="flex flex-col space-y-5">
        <button
           onClick={() => mint?.()}
           className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
           disabled={isMintLoading}
        >
          Mint Tokens
        </button>

        <button
           onClick={() => mintAdmin?.()}
           className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
           disabled={isMintLoading}
        >
          Admin Tokens
        </button>

        <div className="text-center mt-5">
          <h3 className="text-lg ">Total minted</h3>

          <h3 className="text-lg">{supplyData}</h3>
        </div>
      </div>
    </div>
  );
}
