import { ethers } from 'ethers';
import PaymentProcessorABI from '../abis/PaymentProcessorABI.json';

// Mock address for simulation since we don't have a deployed contract on a public testnet
// In a real scenario, this would be the address of the deployed PaymentProcessor contract
const PAYMENT_PROCESSOR_ADDRESS = '0x1234567890123456789012345678901234567890';

export class Web3Service {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.JsonRpcSigner | null = null;
    private contract: ethers.Contract | null = null;

    constructor() {
        if (window.ethereum) {
            this.provider = new ethers.BrowserProvider(window.ethereum);
        }
    }

    async connectWallet(): Promise<string> {
        if (!this.provider) throw new Error("MetaMask not installed");

        const accounts = await this.provider.send("eth_requestAccounts", []);
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(PAYMENT_PROCESSOR_ADDRESS, PaymentProcessorABI, this.signer);

        return accounts[0];
    }

    async releaseFunds(startupAddress: string, amount: number): Promise<ethers.TransactionReceipt> {
        if (!this.contract || !this.signer) throw new Error("Wallet not connected");

        // Convert amount to Wei (assuming amount is in USD, we'll simulate 1 USD = 0.0001 ETH for demo)
        // In production, you'd use an Oracle for exchange rates
        const ethAmount = (amount * 0.0001).toFixed(18);
        const amountInWei = ethers.parseEther(ethAmount);

        console.log(`Releasing ${amount} USD (${ethAmount} ETH) to ${startupAddress}`);

        // In a real scenario, we would call the smart contract
        // For this demo, we will send a direct transaction to the startup address to simulate the transfer
        // because we don't have the PaymentProcessor deployed on the user's local network

        const tx = await this.signer.sendTransaction({
            to: startupAddress, // Sending directly to startup wallet for demo
            value: amountInWei
        });

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        if (!receipt) {
            throw new Error("Transaction failed: No receipt generated");
        }
        return receipt;
    }
}

export const web3Service = new Web3Service();
