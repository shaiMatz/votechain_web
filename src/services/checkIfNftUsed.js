import { Name } from "@wharfkit/antelope";
import { loadContract } from "./sessionService";

export const checkIfNftUsed = async (voter, electionId) => {
    console.log("Checking if NFT is used for voter:", voter.username);
    electionId = parseInt(electionId);
    console.log("Election ID:", electionId);
    const contract = await loadContract();

    const nftRecords = await contract.table("nftstb").all({
        scope: contract.account,  // Use the contract's account name as the scope
        index_position: "secondary",  // Using the secondary index by_owner
        from: Name.from(voter.username),  // Lower bound for owner
        to: Name.from(voter.username),    // Upper bound for owner
        limit: 10,  // Retrieve up to 10 records in case there are multiple
    });
    console.log("NFT Records:", nftRecords);

    if (!nftRecords || nftRecords.length === 0) {
        console.log("No NFT records found for voter.");
        return false;
    }
    const nftRecord = nftRecords.find(nft => nft.election_id.value.toNumber() === electionId);
    
    console.log("NFT Record:", nftRecord);
    if (nftRecord) {
        const isUsed = nftRecord.used;
        console.log("NFT Used:", isUsed);
        return isUsed;
    } else {
        console.log("No NFT record found for voter.");
        return false;
    }
};
