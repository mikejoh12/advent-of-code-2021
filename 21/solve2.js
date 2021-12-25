let p1wins = 0, p2wins = 0;

function buildArr() {                           // 4d array to store game states
    return Array(21).fill(0).map(               // Player 1 score
            (elem) => Array(11).fill(0).map(    // Player 1 pos
            (elem) => Array(21).fill(0).map(    // Player 2 score
            (elem) => Array(11).fill(0)         // Player 2 pos
        )));
}

function round(arr, p1turn = true) {
    const outcomes = rollOutcomes();
    let isPlaying = false;
    const newArr = buildArr();
    for (let p1s = 0; p1s < arr.length; p1s++) {
        for (let p1pos = 1; p1pos < arr[p1s].length; p1pos++) {
            for (let p2s = 0; p2s < arr[p1s][p1pos].length; p2s++) {
                for (let p2pos = 1; p2pos < arr[p1s][p1pos][p2s].length; p2pos++) {
                    if (arr[p1s][p1pos][p2s][p2pos]) {
                        isPlaying = true;
                        if (p1turn) {
                            outcomes.forEach((roll) => {
                                const newP1pos = p1pos + roll <= 10 ? p1pos + roll : p1pos + roll - 10;
                                const newP1score = p1s + newP1pos;
                                if (newP1score >= 21) {
                                    p1wins += arr[p1s][p1pos][p2s][p2pos];
                                } else {
                                    newArr[newP1score][newP1pos][p2s][p2pos] += arr[p1s][p1pos][p2s][p2pos];
                                }
                            });
                        } else {
                            outcomes.forEach((roll) => {
                                const newP2pos = p2pos + roll <= 10 ? p2pos + roll : p2pos + roll - 10;
                                const newP2score = p2s + newP2pos;
                                if (newP2score >= 21) {
                                    p2wins += arr[p1s][p1pos][p2s][p2pos];
                                } else {
                                    newArr[p1s][p1pos][newP2score][newP2pos] += arr[p1s][p1pos][p2s][p2pos];
                                }
                            });                     
                        }
                    }
                }
            }
        }
    }
    return isPlaying ? newArr : null;
}

function rollOutcomes() { // generate array of 27 roll outcomes
    let outcomes = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                outcomes.push(i+j+k);
            }
        }
    }
    return outcomes;
}

let game = buildArr();
game[0][4][0][6] = 1;

let isPlayer1turn = true;
for (;;) {
    game = round(game, isPlayer1turn);
    isPlayer1turn = !isPlayer1turn;
    if (!game) break;
}

console.log(p1wins, p2wins);