export const confirmVote = async (trxId, session, contract) => {
    try {
        await session.transact({
            action: contract.action("confirmvote", {
                trx_id: trxId,
            }),
        });
        return "Vote confirmed successfully.";
    } catch (error) {
        console.error("Error confirming vote:", error);
        throw new Error("Error confirming vote.");
    }
};
