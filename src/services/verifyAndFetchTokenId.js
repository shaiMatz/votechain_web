import { hashToHex, stringToUint64_t } from "./utils";
import { Name } from "@wharfkit/antelope";

export const verifyAndFetchTokenId = async (voterSession, voterObject, election, contract) => {
    try {
        //cast election id to number
        election.id = parseInt(election.id);
        const unhashedToken = `${voterObject.username}${election.id}`;
        const hexToken = await hashToHex(unhashedToken);
        const hashedToken = await stringToUint64_t(hexToken);
        if (!hashedToken || hashedToken === "") {
            throw new Error("Failed to hash token.");
        }

        console.log("Verifying voter:", voterObject.username);
        console.log("Election ID:", election.id);
        console.log("Token:", hashedToken);
        await voterSession.transact({
            action: contract.action("verifyvoters", {
                key: hashedToken,
                voter: Name.from(voterObject.username) ,
                election_id: election.id,
            }),
        });

        return hashedToken;
    } catch (error) {
        console.error("Error verifying voter or fetching token:", error);
        throw new Error("Error verifying voter.");
    }
};
