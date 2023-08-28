const readline = require('readline');

function getInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter progress rating: ", (ratingInput) => {
    const rating = parseFloat(ratingInput);
    rl.close();
    parseInput({ rating });
  });
}

function parseInput({ rating }) {
  console.log("Parsed rating:", rating);
}

getInput();