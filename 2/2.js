// Appreciative of your help yesterday, one Elf gives you an encrypted strategy guide (your puzzle input) that they say will be sure to help you win. "The first column is what your opponent is going to play: A for Rock, B for Paper,
//  and C for Scissors. The second column--" Suddenly, the Elf is called away to help with someone's tent.

// The second column, you reason, must be what you should play in response: X for Rock, Y for Paper, and Z for Scissors. Winning every time would be suspicious, so the responses must have been carefully chosen.

// The winner of the whole tournament is the player with the highest score. Your total score is the sum of your scores for each round. The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
// plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).

// Since you can't be sure if the Elf is trying to help you or trick you, you should calculate the score you would get if you were to follow the strategy guide.

// For example, suppose you were given the following strategy guide:

// A Y
// B X
// C Z
// This strategy guide predicts and recommends the following:

// In the first round, your opponent will choose Rock (A), and you should choose Paper (Y). This ends in a win for you with a score of 8 (2 because you chose Paper + 6 because you won).
// In the second round, your opponent will choose Paper (B), and you should choose Rock (X). This ends in a loss for you with a score of 1 (1 + 0).
// The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6.
// In this example, if you were to follow the strategy guide, you would get a total score of 15 (8 + 1 + 6).

// What would your total score be if everything goes exactly according to your strategy guide?

// --- Part Two ---
// The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"

// The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:

// In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
// In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
// In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
// Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

// Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?

const fs = require("fs");
const dataArray = fs.readFileSync("data").toString().split("\n");

const strategy = {
  win: ["A Y", "B Z", "C X"],
  loss: ["B X", "A Z", "C Y"],
  draw: ["C Z", "A X", "B Y"],
};

const points = {
  win: 6,
  draw: 3,
  loss: 0,
  X: 1,
  Y: 2,
  Z: 3,
};

let sumOfPoints = 0;
dataArray.forEach((round) => {
  const [player1, player2] = round.split(" ");

  if (strategy.win.includes(round)) {
    sumOfPoints += points.win;
  } else if (strategy.draw.includes(round)) {
    sumOfPoints += points.draw;
  }

  sumOfPoints += points[player2];
});

// console.log(sumOfPoints);

// part 2
// win: ["A Y", "B Z", "C X"],
// loss: ["B X", "A Z", "C Y"],
// draw: ["C Z", "A X", "B Y"],

const strategy2 = {
  ["A Z"]: points.Y,
  ["B Z"]: points.Z,
  ["C Z"]: points.X,
  ["A Y"]: points.X,
  ["B Y"]: points.Y,
  ["C Y"]: points.Z,
  ["A X"]: points.Z,
  ["B X"]: points.X,
  ["C X"]: points.Y,
};

sumOfPoints = 0;
dataArray.forEach((round) => {
  const [player1, player2] = round.split(" ");

  if (player2 === "Y") {
    console.log("draw + ", points.draw);
    sumOfPoints += points.draw;
  } else if (player2 === "Z") {
    console.log("win + ", points.win);

    sumOfPoints += points.win;
  }

  if (strategy2[round]) {
    console.log(round);
    console.log("Sign + ", strategy2[round]);
    sumOfPoints += strategy2[round];
  }
});

console.log(sumOfPoints);
