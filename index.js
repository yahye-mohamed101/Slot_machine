// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings 
// 7. Play again

// Import the prompt-sync library, so we can ask the player for input in the terminal.
const prompt = require("prompt-sync")();

// Define the number of rows and columns for the slot machine grid.
const rows = 3;  // There are 3 rows in the slot machine.
const cols = 3;  // There are 3 columns in the slot machine.

// Define how many times each symbol appears on the slot machine.
const symbols_count = {
    "A": 2,  // Symbol "A" appears 2 times.
    "B": 4,  // Symbol "B" appears 4 times.
    "C": 6,  // Symbol "C" appears 6 times.
    "D": 8   // Symbol "D" appears 8 times.
};

// Define how much each symbol is worth in terms of money.
const symbol_values = {
    "A": 5,  // Symbol "A" is worth 5 dollars.
    "B": 4,  // Symbol "B" is worth 4 dollars.
    "C": 3,  // Symbol "C" is worth 3 dollars.
    "D": 2   // Symbol "D" is worth 2 dollars.
};

// This function asks the user how much money they want to deposit into the game.
const deposit = () => {
    while (true) {
        // Ask the user to enter a deposit amount.
        const depositAmount = prompt("Enter a deposit amount: ");
        // Convert the input to a number.
        const numberDepositAmount = parseFloat(depositAmount);

        // Check if the deposit amount is valid (a number and greater than 0).
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            // If the deposit is valid, return the amount.
            return numberDepositAmount;
        }
    };
};

// This function asks the user how many lines they want to bet on (1 to 3).
const getNumberOfLines = () => {
    while (true) {
        // Ask the user for the number of lines to bet on.
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        // Convert the input to a number.
        const numberOfLines = parseFloat(lines);

        // Check if the number of lines is valid (a number between 1 and 3).
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            // If the number of lines is valid, return the number.
            return numberOfLines;
        }
    };
};

// This function asks the user how much money they want to bet per line.
const getBet = (balance, lines) => {
    while (true) {
        // Ask the user how much they want to bet per line.
        const bet = prompt("Enter the bet per line: ");
        // Convert the input to a number.
        const numberBet = parseFloat(bet);

        // Check if the bet is valid (a number and greater than 0 and less than or equal to the balance per line).
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            // If the bet is valid, return the bet amount.
            return numberBet;
        }
    };
};

// This function simulates spinning the slot machine.
const spin = () => {
    // Create an array to store all the symbols based on their counts.
    const symbols = [];
    for (const [symbol, count] of Object.entries(symbols_count)) {
        // Add each symbol to the symbols array based on how many times it should appear.
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    // Create the reels (columns) of the slot machine.
    const reels = [];
    for (let i = 0; i < cols; i++) {
        reels.push([]);
        // Make a copy of the symbols array for each reel to pick from.
        const reelSymbols = [...symbols];
        for (let j = 0; j < rows; j++) {
            // Pick a random symbol from the reelSymbols array.
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            // Add the selected symbol to the reel.
            reels[i].push(selectedSymbol);
            // Remove the selected symbol from the reel's pool to avoid duplicates in the same reel.
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

// This function rotates the reels so they form rows instead of columns.
const transpose = (reels) => {
    const newRows = [];

    // Loop through each row index.
    for (let i = 0; i < rows; i++) {
        newRows.push([]);
        // Loop through each column index and create a new row.
        for (let j = 0; j < cols; j++) {
            newRows[i].push(reels[j][i]);
        }
    }

    return newRows;
};

// This function prints out the slot machine's rows with symbols.
const printRows = (newRows) => {
    for (const row of newRows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            // Add a separator between symbols in the row except for the last symbol.
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        // Print the row.
        console.log(rowString);
    }
};

// This function checks if the player has won any money based on the bet and the number of lines.
const getWinnings = (newRows, bet, lines) => {
    let winnings = 0;

    // Loop through each line the player is betting on.
    for (let row = 0; row < lines; row++) {
        const symbols = newRows[row];
        let allSame = true;

        // Check if all symbols in the line are the same.
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        // If all symbols are the same, add the winnings based on the symbol's value.
        if (allSame) {
            winnings += bet * symbol_values[symbols[0]];
        }
    }

    return winnings;
};

// This is the main function where the game runs.
const game = () => {
    // Ask the user for an initial deposit.
    let balance = deposit();

    // Start the game loop.
    while (true) {
        // Show the user their current balance.
        console.log("You have a balance of $" + balance);

        // Ask how many lines they want to bet on.
        const numberOfLines = getNumberOfLines();

        // Ask how much they want to bet per line.
        const bet = getBet(balance, numberOfLines);

        // Deduct the total bet from the player's balance.
        balance -= bet * numberOfLines;

        // Spin the reels to get a random result.
        const reels = spin();

        // Rotate the reels into rows.
        const newRows = transpose(reels);

        // Print out the rows of the slot machine.
        printRows(newRows);

        // Calculate how much the player won.
        const winnings = getWinnings(newRows, bet, numberOfLines);

        // Add the winnings to the player's balance.
        balance += winnings;

        // Show the player their winnings.
        console.log("You won, $" + winnings.toString() + "!");

        // If the player has no money left, end the game.
        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        // Ask the player if they want to play again.
        const playAgain = prompt("Do you want to play again (y/n)? ");

        // If the player doesn't want to play again, end the game.
        if (playAgain != "y") break;
    };
}

// Start the game.
game();
