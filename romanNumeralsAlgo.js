
const fs = require("fs"); // Import the filesystem module to handle file operations
const readline = require("readline"); // Import the readline module to handle user input from the console

// Roman numeral to decimal conversion map
const romanValue = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
};

// Function to validate if a string is a valid Roman numeral
function isValidRoman(roman) {
    const validChars = ["I", "V", "X", "L", "C", "D", "M"]; // List of valid Roman numeral characters
    for (let i = 0; i < roman.length; i++) {
        if (!validChars.includes(roman[i])) { // Check if each character is a valid Roman numeral
            return false; // Return false if an invalid character is found
        }
    }
    return true; // Return true if all characters are valid
}

// Function to convert a Roman numeral string to a decimal number
function romanToDecimal(roman) {
    if (!isValidRoman(roman)) { // Validate the Roman numeral
        console.log(`Invalid Roman Numeral: ${roman}`); // Log invalid Roman numeral
        return -1; // Return -1 to indicate invalid input
    }
    let total = 0; // Initialize total to 0

    for (let i = 0; i < roman.length; i++) {
        const current = romanValue[roman[i]]; // Get the value of the current Roman numeral
        const next = romanValue[roman[i + 1]]; // Get the value of the next Roman numeral

        if (current < next) { // If the current numeral is less than the next numeral
            total -= current; // Subtract the current value from total
        } else {
            total += current; // Otherwise, add the current value to total
        }
    }

    return total; // Return the calculated total
}

// Function to convert a decimal number to English words
function numberToWords(num) {
    if (num === 0) return "Zero"; // Return "Zero" if the number is 0

    const ones = [  "", "One", "Two",
                    "Three", "Four",
                    "Five", "Six",
                    "Seven", "Eight",
                    "Nine"]; // Ones place words
    const teens = [ "Ten", "Eleven",
                    "Twelve", "Thirteen",
                    "Fourteen", "Fifteen",
                    "Sixteen", "Seventeen",
                    "Eighteen", "Nineteen"]; // Teens place words
    const tens = [  "", "", "Twenty", "Thirty",
                    "Forty", "Fifty", "Sixty",
                    "Seventy", "Eighty", "Ninety"]; // Tens place words
    const thousands = ["", "Thousand", "Million", "Billion"]; // Thousands place words

    let result = ""; // Initialize result string

    // Helper function to convert chunks of numbers to words
    const convertChunk = (num) => {
        let chunkResult = "";
        const hundreds = Math.floor(num / 100); // Get the hundreds place value
        const remainder = num % 100; // Get the remainder

        if (hundreds > 0) {
            chunkResult += `${ones[hundreds]} Hundred `; // Convert hundreds place to words
        }

        if (remainder >= 10 && remainder < 20) {
            chunkResult += `${teens[remainder - 10]} `; // Convert teens place to words
        } else {
            const ten = Math.floor(remainder / 10); // Get the tens place value
            const one = remainder % 10; // Get the ones place value

            if (ten > 0) {
                chunkResult += `${tens[ten]} `; // Convert tens place to words
            }
            if (one > 0) {
                chunkResult += `${ones[one]} `; // Convert ones place to words
            }
        }

        return chunkResult.trim(); // Return the converted chunk as a trimmed string
    };

    let partIndex = 0; // Initialize part index for thousands place
    while (num > 0) {
        const chunk = num % 1000; // Get the last three digits of the number

        if (chunk > 0) {
            result = `${convertChunk(chunk)} ${thousands[partIndex]} ${result}`; // Convert chunk and append to result
        }

        num = Math.floor(num / 1000); // Remove the last three digits from the number
        partIndex++; // Increment the part index
    }

    return result.trim(); // Return the final result as a trimmed string
}

// Function to perform arithmetic operation on two Roman numerals
function performArithmeticOperation(roman1, roman2, operator) {
    const decimal1 = romanToDecimal(roman1); // Convert first Roman numeral to decimal
    const decimal2 = romanToDecimal(roman2); // Convert second Roman numeral to decimal

    if (decimal1 === -1 || decimal2 === -1) {
        return "Invalid Roman Numeral in Expression"; // Return error message if any Roman numeral is invalid
    }

    let result;
    switch (operator) {
        case "+":
            result = decimal1 + decimal2; // Perform addition
            break;
        case "-":
            result = Math.abs(decimal1 - decimal2); // Perform subtraction with absolute value
            break;
        case "*":
            result = decimal1 * decimal2; // Perform multiplication
            break;
        case "/":
            if (decimal2 === 0) return "Division by zero error"; // Check for division by zero
            result = Math.floor(decimal1 / decimal2); // Perform integer division
            break;
        default:
            console.log(`Unsupported operator: ${operator}`); // Log unsupported operator
            return "Unsupported operator"; // Return error message for unsupported operator
    }

    console.log(`${decimal1} ${operator} ${decimal2} = ${result}`); // Log the decimal result to the console

    return `${numberToWords(result)}`; // Return the result in English words
}

// Function to evaluate the full expression
function evaluateExpression(expression) {
    const operators = ["+", "-", "*", "/"]; // List of supported operators
    let operator = null;

    // Identify the operator in the expression
    for (let op of operators) {
        if (expression.includes(op)) {
            operator = op; // Set the operator if found in the expression
            break;
        }
    }

    if (!operator) {
        console.log(`Invalid Expression: ${expression}`); // Log invalid expression
        return "Invalid Expression"; // Return error message for invalid expression
    }

    const [roman1, roman2] = expression.split(operator).map((str) => str.trim()); // Split the expression by the operator and trim whitespace
    return performArithmeticOperation(roman1, roman2, operator); // Perform arithmetic operation on the Roman numerals
}

// Function to dynamically handle file input/output
function processDynamicFile(inputFile, outputFile) {
    if (fs.existsSync(inputFile)) { // Check if the input file exists
        console.log(`File "${inputFile}" found. Processing...`); // Log that the file is found
        const input = fs.readFileSync(inputFile, "utf-8"); // Read the input file
        const expressions = input.split("\n").map((line) => line.trim()); // Split the input by lines and trim whitespace
        const results = expressions.map((expr) => evaluateExpression(expr)); // Evaluate each expression and store results
        fs.writeFileSync(outputFile, results.join("\n"), "utf-8"); // Write results to the output file
        console.log(`Results written to ${outputFile}`); // Log that results are written
    } else {
        console.log(`File "${inputFile}" not found. Please enter Roman Numeral expressions:`); // Log that the file is not found
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        }); // Create a readline interface for user input

        const expressions = [];
        const promptExpression = () => {
            rl.question('Enter an expression (or type "done" to finish): ', (input) => {
                if (input.toLowerCase() === "done") { // Check if the user input is "done"
                    rl.close(); // Close the readline interface
                    fs.writeFileSync(inputFile, expressions.join("\n"), "utf-8"); // Write expressions to the input file
                    console.log(`Input saved to ${inputFile}`); // Log that input is saved
                    processDynamicFile(inputFile, outputFile); // Re-process the file
                } else {
                    expressions.push(input); // Add the user input to expressions
                    promptExpression(); // Prompt for the next expression
                }
            });
        };

        promptExpression(); // Start prompting for expressions
    }
}

// Run the program
processDynamicFile("input.txt", "output.txt"); // Process the input and output files
