import { initializeVoterSession } from "./initializeVoterSession";
import { verifyAndFetchTokenId } from "./verifyAndFetchTokenId";

export const castVote = async (voter, candidate, electionId, contract, voters) => {
    const voterObject = voters.find((v) => v.username.equals(voter));
    if (!voterObject) {
        throw new Error("Invalid voter.");
    }

    const allElections = await contract.table("electiontb").all();
    if (!allElections) {
        throw new Error("No elections found.");
    }

    const election = allElections.find((e) => e.id == electionId);
    if (!election) {
        throw new Error("Invalid election ID.");
    }

    const voterSession = await initializeVoterSession(voterObject);
    const tokenId = await verifyAndFetchTokenId(voterSession, voterObject, election, contract);

    try {
        const response = await voterSession.transact({
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
