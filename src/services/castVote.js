import { initializeVoterSession } from "./initializeVoterSession";
import { verifyAndFetchTokenId } from "./verifyAndFetchTokenId";
import { session } from "./sessionService";
export const castVote = async (voter, candidate, electionId, contract, voters) => {
    if (!voter || !candidate || !electionId || !contract || !voters) {
        throw new Error("Invalid parameters provided.");
    }

    //consvert the electionId to a number
    electionId = parseInt(electionId);


    const allElections = await contract.table("electiontb").all();
    if (!allElections) {
        throw new Error("No elections found.");
    }

    const election = allElections.find((e) => e.id == electionId);
    if (!election) {
        throw new Error("Invalid election ID.");
    }
    console.log("Election found:", election);
    console.log("Voter:", voter);
    const voterSession = await initializeVoterSession(voter);
    const tokenId = await verifyAndFetchTokenId(voterSession, voter, election, contract);

    console.log("Token ID:", tokenId);
    if (!tokenId) {
        throw new Error("Failed to fetch token ID.");
    }

    try {
        const response = await session.transact({
            action: contract.action("vote", {
                token_id: tokenId,
                election_id: election.id,
                candidate,
            }),
        });
        const trx_id = response.response.transaction_id;
        return { trxId: trx_id, message: `Vote cast successfully. Please confirm your vote using this link: https://jungle4.eosq.eosnation.io/tx/${trx_id}` };
    } catch (error) {
        console.error("Error casting vote:", error);
        throw new Error("Error casting vote.");
    }
};
