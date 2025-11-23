export interface SmartContractState {
    isDeployed: boolean;
    targetAmount: number;
    currentAmount: number;
    investors: string[];
    isFunded: boolean;
}

class SmartContractService {
    private state: SmartContractState = {
        isDeployed: false,
        targetAmount: 0,
        currentAmount: 0,
        investors: [],
        isFunded: false,
    };

    async deployContract(startupId: string, targetAmount: number): Promise<string> {
        console.log(`Deploying smart contract for startup ${startupId} with target ${targetAmount}...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        this.state.isDeployed = true;
        this.state.targetAmount = targetAmount;
        return `0x${Math.random().toString(16).substr(2, 40)}`; // Mock contract address
    }

    async invest(contractAddress: string, amount: number, investorId: string): Promise<boolean> {
        if (!this.state.isDeployed) throw new Error("Contract not deployed");

        console.log(`Investor ${investorId} investing ${amount} into ${contractAddress}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.state.currentAmount += amount;
        this.state.investors.push(investorId);

        if (this.state.currentAmount >= this.state.targetAmount) {
            this.state.isFunded = true;
            console.log("Target reached! Funds released to startup.");
        }

        return true;
    }

    getStatus() {
        return { ...this.state };
    }
}

export const smartContractService = new SmartContractService();
