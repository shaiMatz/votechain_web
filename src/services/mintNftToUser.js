import { isEligible, hashToken } from "./utils";

export const mintNftToUser = async (voterObject, contract, session, eligibleElections) => {
    try {
        if (!voterObject || !contract || !session || !eligibleElections) {
            throw new Error("Invalid parameters provided.");
        }
        console.log("Minting NFTs for voter:", voterObject.username);

        const now = new Date();
        console.log("Current timestamp:", now);

        const openElections = eligibleElections.filter(election => {
            const endTime = new Date(election.end_time);
            console.log(`Election ID: ${election.id}, End Time: ${endTime}, Is Open: ${endTime > now}`);
            return endTime > now;
        });

        console.log("Open Elections:", openElections);

        if (openElections.length === 0) {
            console.log("No open elections found.");
            return; // Exit early as there are no open elections
        }

        // Batch query to check for existing NFTs
        const electionIds = openElections.map(e => e.id);
        const existingNfts = await contract.table("nftstb").all({
            scope: voterObject.username,
            code: contract.account,
            table: "nftstb",
            lower_bound: Math.min(...electionIds),
            upper_bound: Math.max(...electionIds),
        });

        console.log("Existing NFTs:", existingNfts);

        const mintedElectionIds = new Set(existingNfts.rows.map(nft => nft.election_id));

        for (const election of openElections) {
            const birthdateTimestamp = new Date(voterObject.birthdate).getTime();

            // Ensure criteria exist in each election item
            if (!election.criteria) {
                console.log("No specific criteria or invalid election ID:", election.id);
                continue;
            }

            const { criteria } = election;
            if (!isEligible(voterObject, criteria, birthdateTimestamp)) {
                console.log("Voter not eligible for election:", election.id);
                continue;
            }

            if (mintedElectionIds.has(election.id)) {
                console.log(`NFT already exists for election: ${election.id}, skipping...`);
                continue;
            }

            const unhashedToken = `${voterObject.username}${election.id}`;
            const hashedToken = await hashToken(unhashedToken);
            console.log("Token:", hashedToken);

            // Mint the NFT if it doesn't already exist
            try {
                await session.transact({
                    action: contract.action("mintnft", {
                        owner: voterObject.username,
                        election_id: election.id,
                        hashedtoken: hashedToken,
                    }),
                });
                console.log(`NFT minted for election: ${election.id}`);
            } catch (error) {
                console.error("Error during NFT minting:", error);
                continue;
            }
        }
    } catch (error) {
        console.error("Error processing elections:", error);
        throw new Error("Error processing elections.");
    }
};
