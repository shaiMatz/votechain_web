export const hashToken = async (token) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const hashToHex = async (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.slice(-16);
};

export const stringToUint64_t = async (hexValue) => {
    return BigInt(`0x${hexValue}`);
};
export const isEligible = (voter, criteria, birthdateTimestamp) => {
    console.log("Checking eligibility:");
    console.log("Voter Details:", voter);
    console.log("Election Criteria:", criteria);

    // Calculate the voter's age
    const currentDate = new Date();
    const birthDate = new Date(birthdateTimestamp);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    console.log("Voter's age:", age);

    // Check if userList is present and not empty
    if (criteria.userList && criteria.userList.length > 0) {
        if (!criteria.userList.includes(voter.user_id)) {
            console.log("Voter's user_id is not in the userList.");
            return false;
        }
    } else {
        // If userList is not used, apply age and location checks
        if (age < criteria.minage || age > criteria.maxage) {
            console.log("Voter does not meet age criteria.");
            return false;
        }

        if (voter.city !== criteria.city || voter.state !== criteria.state || voter.country !== criteria.country) {
            console.log("Voter does not meet location criteria.");
            return false;
        }
    }

    console.log("Voter is eligible.");
    return true;
};
