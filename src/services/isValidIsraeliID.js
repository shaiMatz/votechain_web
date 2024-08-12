export function isValidIsraeliID(id) {
    // Convert the ID to a string and ensure it's exactly 9 digits
    let idStr = String(id).padStart(9, '0');

    // Check if the ID is indeed 9 digits long
    if (idStr.length !== 9) {
        return { isValid: false, id: id };
    }

    // Calculate the checksum
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let num = parseInt(idStr[i], 10);
        // Multiply odd digits by 1 and even digits by 2
        let step = num * ((i % 2) + 1);
        // If the result is greater than 9, sum the digits (same as subtracting 9)
        sum += Math.floor(step / 10) + (step % 10);
    }

    // Check if the sum is a multiple of 10
    const isValid = sum % 10 === 0;
    console.log(`ID ${idStr} is ${isValid ? 'valid' : 'invalid'}`);
    // Return the validation result and the ID without leading zeros
    return { isValid, id: isValid ? parseInt(idStr, 10) : null };
}
