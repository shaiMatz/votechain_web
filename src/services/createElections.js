import { TimePointSec } from "@wharfkit/antelope";

export const createElections = async (session, contract, election) => {
    try {
        console.log("Creating election with session:", session);
        if (!election) throw new Error("Election data is required.");
        console.log("Creating election with data:", election);

        const startTime = TimePointSec.fromMilliseconds(new Date(election.startdate).getTime());
        const endTime = TimePointSec.fromMilliseconds(new Date(election.enddate).getTime());
        console.log("Formatted start time:", startTime);
        console.log("Formatted end time:", endTime);

        const formattedCandidates = election.candidates.map(candidate => candidate.name);
        console.log("Formatted candidates:", formattedCandidates);

        const transaction = {
            action: contract.action("createlect", {
                election_id: election.election_id,
                title: election.name,
                start_time: startTime,
                end_time: endTime,
                candidates: formattedCandidates,
            }),
        };

        console.log("Prepared transaction:", transaction);

        const result = await session.transact(transaction);
        console.log("Transaction result:", result);

        return "Election created successfully.";
    } catch (error) {
        console.error("Error creating election:", error);
        throw new Error(`Error creating election: ${error.message}`);
    }
};
