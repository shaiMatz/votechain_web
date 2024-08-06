import { TimePointSec } from "@wharfkit/antelope";

export const createElections = async (session, contract, election) => {
    try {
        if (!election)
            throw new Error("Election data is required.");
        console.log("Creating election:", election);

        const startTime = TimePointSec.fromMilliseconds(new Date(election.startdate).getTime());
        const endTime = TimePointSec.fromMilliseconds(new Date(election.enddate).getTime());

        const formattedCandidates = election.candidates.map(candidate => candidate.name);

        await session.transact({
            action: contract.action("createlect", {
                election_id: election.election_id,
                title: election.name,
                start_time: startTime,
                end_time: endTime,
                candidates: formattedCandidates,
            }),
        });
        console.log("Election created successfully.");
        return "Election created successfully.";
    } catch (error) {
        console.error("Error creating election:", error);
        throw new Error(`Error creating election: ${error.message}`);
    }
};
