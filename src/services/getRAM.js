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
