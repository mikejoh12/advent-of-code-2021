const nrs = [37,60,87,13,34,72,45,49,61,27,97,88,50,30,76,40,63,9,38,67,82,6,59,90,99,54,11,66,98,23,64,14,18,4,10,89,46,32,19,5,1,53,25,96,2,12,86,58,41,68,95,8,7,3,85,70,35,55,77,44,36,51,15,52,56,57,91,16,71,92,84,17,33,29,47,75,80,39,83,74,73,65,78,69,21,42,31,93,22,62,24,48,81,0,26,43,20,28,94,79];

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./boards.txt')
  });

const boards = [];
let board = [];
lineReader.on('line', (line) => {
    if (line) {
      const lineNrs = line.split(/\s+/).filter((nr) => nr).map((nr) => Number(nr));
      board.push(lineNrs);
      if (board.length === 5) {
        boards.push(board);
        board = [];
      }
  }
});

lineReader.on('close', () => {

  const markBoards = (nr) => {
    for (let i = 0; i < boards.length; i++) {
      for (let j = 0; j < boards[i].length; j++) {
        for (let k = 0; k < boards[j].length; k++) {
          if (boards[i][j][k] == nr) {
            boards[i][j][k] = true;
          }
        }
      }
    }
  }

  const checkBoard = (boardArr) => {
    let columns = [];
    for (let i = 0; i < boardArr.length; i++) {
      columns.push([]);
      for (let j = 0; j < boardArr.length; j++) {
        columns[i].push(boardArr[j][i]);
      }
    }
    return (boardArr.find((row) => row.every((elem) => elem === true)) ||
        columns.find((row) => row.every((elem) => elem === true))) ?
        true : false;
  }

  const sumBoard = (board) => board.flat().reduce((acc, cur) => cur === true ? acc : cur + acc, 0);

  let nrsIdx = 0, bingoBoards = [];  
  while (nrsIdx < nrs.length) {
    markBoards(nrs[nrsIdx]);
    for (let i = 0; i < boards.length; i++) {
      if (!bingoBoards.includes(i) && checkBoard(boards[i])) {
          console.log(`Bingo on ${nrs[nrsIdx]} Number: ${nrs[nrsIdx] * sumBoard(boards[i])}`)
          bingoBoards.push(i);
        }
    }
    nrsIdx++;
  }
});