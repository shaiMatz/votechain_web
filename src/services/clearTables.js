export const clearTables = async ( session, contract) => {
    try {
        await session.transact({
            action: contract.action("cleartables"),
        });
        return "tables cleared successfully.";
    } catch (error) {
        console.error("Error clearing tables:", error);
        throw new Error("Error clearing tables.");
    }
};
 