'use strict';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./count.txt')
  });

let horizontal = 0;
let depth = 0;

lineReader.on('line', (line) => {
    const lineArr = line.split(' ');
    const direction = lineArr[0];
    const amount = Number(lineArr[1]);
    console.log(`direction ${direction} amount ${amount}`);
    if (direction == 'forward') {
        horizontal += amount;
    } else if (direction == 'down') {
        depth += amount;
    } else if (direction == 'up') {
        depth -= amount;
    }
});

lineReader.on('close', () => {
    console.log(horizontal * depth);
});