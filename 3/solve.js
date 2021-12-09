'use strict';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./count.txt')
  });

const zeroCount = new Array(12).fill(0);
const oneCount = new Array(12).fill(0);

lineReader.on('line', (line) => {
  const lineArr = line.split('');
  lineArr.forEach((nr, index) => {
    if (nr == 0) {
      zeroCount[index]++;
    } else if (nr == 1) {
      oneCount[index]++;
    }
  })
  console.log(lineArr);
});

lineReader.on('close', () => {
    console.log(zeroCount, oneCount)

    const gamma = zeroCount.map((nr, idx) => nr > oneCount[idx] ? 0 : 1).join('');
    const epsilon = zeroCount.map((nr, idx) => nr > oneCount[idx] ? 1 : 0).join('');
    const gammaNr = parseInt(gamma, 2);
    const epsilonNr = parseInt(epsilon, 2);
    console.log('gamma ', gamma, 'epsilon ', epsilon);
    console.log(gammaNr, epsilonNr)
    console.log('Result: ', gammaNr * epsilonNr);
});