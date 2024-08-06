import { mintNftToUser } from "./mintNftToUser";
import { initializeVoterSession } from "./initializeVoterSession";

export const registerVoter = async (voter, contract, session, eligibleElections) => {
    console.log("Registering voter:", voter.username);
    console.log("session:", session);
    if (!voter) {
        throw new Error("Voter not found.");
    }
    const voterSession = await initializeVoterSession(voter);

    await voterSession.transact({
      action: contract.action("regvoter", {
          voter: voter.username,
      }),
    });
    console.log("Voter registered successfully.");
    try {
        if (!eligibleElections||eligibleElections.length === 0) {
            console.log("No eligible elections found for voter.");
            return "No eligible elections found for voter.";
        }
        await mintNftToUser(voter, contract, session, eligibleElections)
        return "Voter registered and NFT minted successfully.";
    } catch (error) {
        console.error("Error registering voter:", error);
        throw new Error("Error registering voter.");
    }
};
