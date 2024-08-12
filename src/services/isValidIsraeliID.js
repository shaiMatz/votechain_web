export function isValidIsraeliID(id) {
    console.log('isValidIsraeliID called with:', id);

    // Convert the ID to a string and ensure it's exactly 9 digits by adding leading zeros if needed
    let idStr = String(id).padStart(9, '0');

    // Check if the ID is indeed 9 digits long and contains only numbers
    if (idStr.length !== 9 || isNaN(idStr)) {
        return { isValid: false, id: id };
    }

    let sum = 0;
    for (let i = 0; i < idStr.length; i++) {
        let incNum = Number(idStr[i]) * ((i % 2) + 1);  // Multiply number by 1 or 2
        sum += (incNum > 9) ? incNum - 9 : incNum;  // Sum the digits up and add to total
    }

    const isValid = (sum % 10 === 0);
    console.log(`ID ${idStr} is ${isValid ? 'valid' : 'invalid'}`);

    // Return the validation result and the ID as an integer without leading zeros
    return { isValid, id: isValid ? parseInt(idStr, 10) : null };
}
