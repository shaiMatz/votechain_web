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
    const currentDate = new Date();
    const minAgeTimestamp = new Date(currentDate.getFullYear() - criteria.minage, currentDate.getMonth(), currentDate.getDate()).getTime();
    const maxAgeTimestamp = new Date(currentDate.getFullYear() - criteria.maxage, currentDate.getMonth(), currentDate.getDate()).getTime();

    if ((criteria.minage && birthdateTimestamp > minAgeTimestamp) ||
        (criteria.maxage && birthdateTimestamp < maxAgeTimestamp) ||
        (criteria.city && voter.city !== criteria.city) ||
        (criteria.state && voter.state !== criteria.state) ||
        (criteria.country && voter.country !== criteria.country) ||
        (criteria.userList && !criteria.userList.includes(voter.username))) {
        return false;
    }

    return true;
};
