import { Session } from "@wharfkit/session"
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { Chains } from "@wharfkit/common";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";

export const initializeVoterSession = async (voterObject) => {
    const walletPlugin = new WalletPluginPrivateKey(voterObject.privatekey);
    return new Session(
        {
            actor: voterObject.username,
            permission: "active",
            chain: Chains.Jungle4,
            walletPlugin,
        },
        {
            transactPlugins: [new TransactPluginResourceProvider()],
        }
    );
};
