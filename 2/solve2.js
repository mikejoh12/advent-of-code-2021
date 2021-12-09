'use strict';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./count.txt')
  });

let horizontal = 0;
let depth = 0;
let aim = 0;

lineReader.on('line', (line) => {
    const lineArr = line.split(' ');
    const direction = lineArr[0];
    const amount = Number(lineArr[1]);
    console.log(`direction ${direction} amount ${amount}`);
    if (direction == 'forward') {
        horizontal += amount;
        depth += aim * amount;
    } else if (direction == 'down') {
        aim += amount;
    } else if (direction == 'up') {
        aim -= amount;
    }
});

lineReader.on('close', () => {
    console.log(horizontal * depth);
});