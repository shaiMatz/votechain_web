import { isEligible, hashToken } from "./utils";
import { session, loadContract } from "./sessionService";
import { Name } from "@wharfkit/antelope";

export const mintNftToUser = async (voterObject, eligibleElections) => {
    try {
        const contract = await loadContract(session);
        if (!voterObject || !contract || !session || !eligibleElections) {
            throw new Error("Invalid parameters provided.");
        }
        console.log("Minting NFTs for voter:", voterObject.username);

        const now = new Date();
        console.log("Current timestamp:", now);
        console.log("Eligible Elections:", eligibleElections);
        const openElections = eligibleElections.filter(election => {
            const endTime = new Date(election.enddate);
            console.log(`Election ID: ${election.id}, End Time: ${endTime}, Is Open: ${endTime > now}`);
            return endTime > now;
        });

        console.log("Open Elections:", openElections);

        if (openElections.length === 0) {
            console.log("No open elections found.");
            return; // Exit early as there are no open elections
        }

        // Batch query to check for existing NFTs
        let existingNfts;
        try {
            console.log("Querying all NFTs...");
            existingNfts = await contract.table("nftstb").all({
                code: contract.account,
                table: "nftstb"
            });
            console.log("All NFTs for user:", existingNfts);

            // Ensure existingNfts is defined and an array
            if (!Array.isArray(existingNfts)) {
                console.warn("Unexpected structure of existingNfts, expected an array.");
                existingNfts = []; // Fallback to an empty array if it's not an array
            }

        } catch (error) {
            console.error("Error querying existing NFTs:", error);
            throw new Error("Failed to query existing NFTs.");
        }

        console.log("Existing NFTs:", existingNfts);

        // Convert owner.value and election_id.value to strings for comparison
        const mintedElectionIds = new Set(
            existingNfts.length > 0
                ? existingNfts
                    .filter(nft => {
                        const ownerString = String(nft.owner); // Convert to string
                        console.log(`Comparing owner: ${ownerString} with voter: ${voterObject.username}`);
                        return ownerString === voterObject.username;
                    })
                    .map(nft => nft.election_id.value.toString()) // Convert BN to string
                : []
        );
        console.log("Minted Election IDs:", mintedElectionIds);

        for (const election of openElections) {
            // Check if already minted
            console.log("Checking if NFT already exists for election:", election.id);
            if (mintedElectionIds.has(election.id.toString())) { // Convert election.id to string for comparison
                console.log(`NFT already exists for election: ${election.id}, skipping...`);
                continue;
            }

            const birthdateTimestamp = new Date(voterObject.birthdate).getTime();

            // Use `voterscriteria` instead of `criteria`
            if (!election.voterscriteria) {
                console.log("No specific criteria or invalid election ID:", election.id);
                continue;
            }

            const criteria = election.voterscriteria;
            if (!isEligible(voterObject, criteria, birthdateTimestamp)) {
                console.log("Voter not eligible for election:", election.id);
                continue;
            }

            const unhashedToken = `${voterObject.username}${election.id}`;
            const hashedToken = await hashToken(unhashedToken);
            console.log("Token:", hashedToken);

            // Mint the NFT if it doesn't already exist
            try {
                await session.transact({
                    action: contract.action("mintnft", {
                        owner: Name.from(voterObject.username),
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
