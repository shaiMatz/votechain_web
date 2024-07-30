import { PrivateKey, APIClient } from "@wharfkit/antelope";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { Chains } from "@wharfkit/common";
import { Name } from "@wharfkit/antelope";


const createEOSAccount = async (username, adminPrivateKey) => {
  try {
    
    // Generate keys
    const privateKey = PrivateKey.generate("K1");
    const publicKey = privateKey.toPublic();

    // Admin wallet plugin
    const walletPlugin = new WalletPluginPrivateKey(adminPrivateKey);
    const session = new Session(
      {
        actor: "votechain111",
        permission: "active",
        chain: Chains.Jungle4,
        walletPlugin,
      },
      {
        transactPlugins: [new TransactPluginResourceProvider()],
      }
    );

    const name = Name.from(username);

    // Create new EOS account
    await session.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "newaccount",
            authorization: [
              {
                actor: "votechain111",
                permission: "active",
              },
            ],
            data: {
              creator: "votechain111",
              name: name,
              owner: {
                threshold: 1,
                keys: [{ key: String(publicKey), weight: 1 }],
                accounts: [],
                waits: [],
              },
              active: {
                threshold: 1,
                keys: [{ key: String(publicKey), weight: 1 }],
                accounts: [],
                waits: [],
              },
            },
          },
          {
            account: "eosio",
            name: "buyrambytes",
            authorization: [
              {
                actor: "votechain111",
                permission: "active",
              },
            ],
            data: {
              payer: "votechain111",
              receiver: name,
              bytes: 8192,
            },
          },
          {
            account: "eosio",
            name: "delegatebw",
            authorization: [
              {
                actor: "votechain111",
                permission: "active",
              },
            ],
            data: {
              from: "votechain111",
              receiver: name,
              stake_net_quantity: "1.0000 EOS",
              stake_cpu_quantity: "1.0000 EOS",
              transfer: false,
            },
          },
        ],
      },
      {
        expireSeconds: 30,
      }
    );

    return { publicKey: String(publicKey), privateKey: String(privateKey) };
  } catch (error) {
    if (error.message.includes("assertion failure with message: no active bid for name") || error.message.includes("assertion failure with message: only suffix may create this account")) {
      throw new Error("only suffix may create this account");
    }
    throw new Error("Error creating account: " + error.message);
  }
};
export { createEOSAccount };
