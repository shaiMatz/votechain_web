import { TimePointSec } from "@wharfkit/antelope";

export const updateElections = async (session, contract, election, manager) => {
    try {
        if (!election) throw new Error("Election data is required.");
        console.log("updating election with data:", election);

        const startTime = TimePointSec.fromMilliseconds(new Date(election.startdate).getTime());
        const endTime = TimePointSec.fromMilliseconds(new Date(election.enddate).getTime());
        console.log("Formatted start time:", startTime);
        console.log("Formatted end time:", endTime);

        const formattedCandidates = election.candidates.map(candidate => candidate.name);
        console.log("Formatted candidates:", formattedCandidates);

        const transaction = {
            action: contract.action(manager ? "updtlectmng":"updatelect", {
                election_id: election.election_id,
                new_title: election.name,
                new_start_time: startTime,
                new_end_time: endTime,
                new_candidates: formattedCandidates,
                ...(manager && { manager_code: 123 })
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
