import { hashToHex, stringToUint64_t } from "./utils";

export const verifyAndFetchTokenId = async (voterSession, voterObject, election, contract) => {
    try {
        const unhashedToken = `${voterObject.username}${election.id}`;
        const hexToken = await hashToHex(unhashedToken);
        const hashedToken = await stringToUint64_t(hexToken);

        await voterSession.transact({
            action: contract.action("verifyvoters", {
                key: hashedToken,
                voter: voterObject.username,
                election_id: election.id,
            }),
        });

        return hashedToken;
    } catch (error) {
        console.error("Error verifying voter or fetching token:", error);
        throw new Error("Error verifying voter.");
    }
};
