import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { APIClient } from "@wharfkit/antelope";
import { ContractKit } from "@wharfkit/contract";

const accountName = "votechain111";
const permissionName = "active";
const privateKey = "5K6x2VoZZZUUx9SXqgbqprJRfXKWq5qSs4JRSZ8K6myzkdQi3Z3";
const walletPlugin = new WalletPluginPrivateKey(privateKey);
const chain = {
    id: "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d",
    url: "https://jungle4.greymass.com",
};

const session = new Session(
    {
        actor: accountName,
        permission: permissionName,
        chain,
        walletPlugin: walletPlugin,
    },
    {
        transactPlugins: [new TransactPluginResourceProvider()],
    }
);

const client = new APIClient({ url: "https://jungle4.greymass.com" });
const contractKit = new ContractKit({ client: client });

const loadContract = async () => {
    try {
        console.log("Loading contract for account:", accountName);
        const contract = await contractKit.load(accountName);
        console.log("Contract loaded successfully:", contract);
        const actionNames = contract.actionNames;
        console.log("Available actions:", actionNames);
        return contract;
    } catch (error) {
        console.error("An error occurred while loading the contract:", error);
        throw error;
    }
};


export { session, loadContract };
