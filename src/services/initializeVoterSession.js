import { Session } from "@wharfkit/session"
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { Chains } from "@wharfkit/common";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { Name } from "@wharfkit/antelope";

export const initializeVoterSession = async (voterObject) => {
    console.log("Initializing voter session for:", voterObject);
    if (!voterObject || !voterObject.privatekey) {
        console.error("Voter information is missing or incomplete.");
        throw new Error("Voter information is missing or incomplete.");
    }
    const walletPlugin = new WalletPluginPrivateKey(voterObject.privatekey);
    return new Session(
        {
            actor: Name.from(voterObject.username),
            permission: "active",
            chain: Chains.Jungle4,
            walletPlugin,
        },
        {
            transactPlugins: [new TransactPluginResourceProvider()],
        }
    );
};
