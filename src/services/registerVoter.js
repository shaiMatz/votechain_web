import { initializeVoterSession } from "./initializeVoterSession";

export const registerVoter = async (voter, contract, session) => {
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
};
