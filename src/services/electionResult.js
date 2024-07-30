import { loadContract } from '../services/sessionService';

export const electionResult = async (electionId) => {
    try {
        if (!electionId) throw new Error("Election ID is required.");

        console.log("Getting election result for election ID:", electionId);
        const contract = await loadContract();
        if (!contract) {
            throw new Error("Failed to load the contract.");
        }

        // Access the specific election result directly
        const electionResult = await contract.table("electionresb").get(Number(electionId));
        console.log("Election Result:", electionResult);

        if (!electionResult) {
            throw new Error(`Election result for ID ${electionId} not found.`);
        }

        return electionResult;
    } catch (error) {
        console.error("Error getting election result:", error);
        throw new Error(`Error getting election result: ${error.message}`);
    }
};
