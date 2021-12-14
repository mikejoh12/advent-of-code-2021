
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
  let input = 'CVKKFSSNNHNPSPPKBHPB';
  const polyMap = new Map();

  lineReader.on('line', (line) => {
    const [ start, end ] = line.split(' -> ');
    polyMap.set(start, [start[0] + end, end + start[1]]);
  });

  function getCountMap(arr) {
      const countMap = new Map();
      for (const letter of arr) {
          countMap.set(letter, countMap.get(letter) ? countMap.get(letter) + 1 : 1);
      }
      return countMap;
  }

  function getMinMax(countMap) {
      const countArr = [...countMap];
      const min = countArr.reduce((acc, cur) => cur[1] < acc[1] ? cur : acc);
      const max = countArr.reduce((acc, cur) => cur[1] > acc[1] ? cur : acc);
      return [min, max];
  }

  function buildMap(arr) {
      const newMap = new Map();
      for (let i = 0; i < arr.length - 1; i++) {
            let pair = arr[i] + arr[i+1];
            newMap.set(pair, newMap.has(pair) ? newMap.get(pair) + 1 : 1);
        }
      return newMap;
    }

  function doStepOnMap(oldMap) {
      const newMap = new Map();
      for (const [pair, count] of oldMap) {
        const [first, second] = polyMap.get(pair);
        newMap.set(first, newMap.has(first) ? newMap.get(first) + count : count);
        newMap.set(second, newMap.has(second) ? newMap.get(second) + count : count);
      }
      return newMap;
  }

  function getCountMap(dataMap, edgeLetters) {
    const countMap = new Map();
    for (const [pair, count] of dataMap) {
        countMap.set(pair[0], countMap.has(pair[0]) ? countMap.get(pair[0]) + count : count);
        countMap.set(pair[1], countMap.has(pair[1]) ? countMap.get(pair[1]) + count : count);
    }
    const finalMap = new Map();
    for (const [letter, count] of countMap) {
            finalMap.set(letter, edgeLetters.includes(letter) ? (count + 1) / 2 : count / 2);
    }
    return finalMap;
  }

  lineReader.on('close', () => {
    let stepMap = buildMap(input.split(''));
    for (let i = 1; i <= 40; i++) {
        stepMap = doStepOnMap(stepMap);
        if (i == 10 || i == 40) {
            const countMap = getCountMap(stepMap, [input[0], input[input.length - 1]]);
            const [min, max] = getMinMax(countMap);
            console.log('At step:', i, 'Difference:', max[1] - min[1]);
        }
    }
  })