
export const getRAM = async (session) => {
    try {
        await session.transact({
            actions: [
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
                        receiver: "votechain111",
                        bytes: 108192,
                    },
                },
            ],
        });
        return "RAM bought successfully";
    } catch (error) {
        console.error("Error getting RAM:", error);
        throw new Error("Error getting RAM.");
    }
};
export const delegate = async (session) => {
    try{
        await session.transact({
            actions: [
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
                        receiver: "votechain111",
                        stake_net_quantity: "1.0000 EOS",
                        stake_cpu_quantity: "1.0000 EOS",
                        transfer: false,
                    },
                },
            ],
        });
        return "Delegated successfully";
    }
    catch(error){
        console.error("Error delegating:", error);
        throw new Error("Error delegating.");
    }
};
