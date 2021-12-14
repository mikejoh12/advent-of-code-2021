const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

  let input = 'CVKKFSSNNHNPSPPKBHPB';
  const codeMap = new Map();

  lineReader.on('line', (line) => {
    const [start, end] = line.split(' -> ');
    codeMap.set(start, end);
  });
  
  const countB = (arr) => arr.reduce((acc, cur) => cur == 'B' ? acc + 1 : acc, 0);

  function getCountMap(arr) {
      const countMap = new Map();
      for (const letter of arr) {
          countMap.set(letter, countMap.get(letter) ? countMap.get(letter) + 1 : 1);
      }
      return countMap;
  }

  function getMinMax(countMap) {
      const countArr = [...countMap];
      console.log(countArr);
      const min = countArr.reduce((acc, cur) => cur[1] < acc[1] ? cur : acc);
      const max = countArr.reduce((acc, cur) => cur[1] > acc[1] ? cur : acc);
      return [min, max];
  }

  lineReader.on('close', () => {
    console.log(codeMap);
    let inputArr = input.split('');
    for (let step = 0; step < 40; step++) {
        let newArr = [];
        for (let i = 0; i < inputArr.length - 1; i++) {
            let pair = inputArr[i] + inputArr[i+1];
            for (const [key, value] of codeMap) {
                if (pair == key) {
                    newArr = newArr.concat([inputArr[i], value]);
                    match = true;
                }
            }
        }
        inputArr = [...newArr, inputArr[inputArr.length - 1]];
        console.log('Step:', step, inputArr.join(''), 'length', inputArr.length);
    }
    console.log(countB(inputArr));
    const [min, max] = getMinMax(getCountMap(inputArr));
    console.log('Problem 1:', max[1] - min[1]);
  })
