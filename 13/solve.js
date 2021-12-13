const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

  let maxX = 0, maxY = 0;
  let pos = [], instructions = [];

  lineReader.on('line', (line) => {
    if (line.includes(',') && !line.includes('fold along')) {
        const [x, y] = line.split(',').map((nr) => Number(nr));
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        pos.push([x, y]);
    }
    if (line.includes('fold along')) {
        const [_text, data] = line.split('fold along ');
        instructions.push(data.split('='));
    }
  });
  
  function splitArrY(arr, yPos) {
    let topArr = [], bottomArr = [];
    for (let y = 0; y < yPos; y++) {
        topArr.push(arr[y]);
    }
    for (let y = yPos + 1; y < arr.length; y++) {
        bottomArr.push(arr[y]);
    }
    return [topArr, bottomArr];
  }

  function splitArrX(arr, xPos) {
      let leftArr = [], rightArr = [];
      for (let y = 0; y < arr.length; y++) {
          leftArr.push([]);
          rightArr.push([]);
          for (let x = 0; x < arr[y].length; x++) {
              if (x < xPos) {
                  leftArr[y].push(arr[y][x]);
              } else if (x > xPos) {
                  rightArr[y].push(arr[y][x]);
              }
          }
      }
      return [leftArr, rightArr];
  }

  function foldUp(arr, yPos) {
      const [topArr, bottomArr] = splitArrY(arr, yPos);
      const revBottom = bottomArr.reverse();

      // If not equal height - fill smaller one
      if (topArr.length < revBottom.length) {
        const diff = revBottom.length - topArr.length;
        for (let y = 0; y < diff; y++) {
            topArr.unshift(Array(revBottom[0].length).fill('.'));     
        }
      } else if (topArr.length > revBottom.length) {
        const diff = topArr.length - revBottom.length;
        for (let y = 0; y < diff; y++) {
            revBottom.unshift(Array(topArr[0].length).fill('.')); 
        }
      }

      const newArr = [];
      for (let y = 0; y < topArr.length; y++) {
          newArr.push([]);
          for (let x = 0; x < topArr[y].length; x++) {
              if (topArr[y][x] == '#' || revBottom[y][x] == '#') {
                  newArr[y].push('#');
              } else {
                  newArr[y].push('.');
              }
          }
      }
      return newArr;
  }

  function foldLeft(arr, xPos) {

      let [leftArr, rightArr] = splitArrX(arr, xPos);
      const revRightArr = [];
      for (let y = 0; y < rightArr.length; y++) {
          revRightArr.push([...rightArr[y].reverse()]);
      }
      let newArr = [];

      // If not equal width - fill smaller one
      if (leftArr[0].length < revRightArr[0].length) {
        const diff = revRightArr[0].length - leftArr[0].length;
        for (let y = 0; y < leftArr.length; y++) {
            for (let x = 0; x < diff; x++) {
                leftArr[y].unshift('.');
            }
        }        
      } else if (leftArr[0].length > revRightArr[0].length) {
        const diff = leftArr[0].length - revRightArr[0].length;
        for (let y = 0; y < leftArr.length; y++) {
            for (let x = 0; x < diff; x++) {
                revRightArr[y].unshift('.');
            }
        }
      }

      for (let y = 0; y < leftArr.length; y++) {
        newArr.push([]);
        for (let x = 0; x < leftArr[y].length; x++) {
            if (leftArr[y][x] == '#' || revRightArr[y][x] == '#') {
                newArr[y].push('#');
            } else {
                newArr[y].push('.');
            }
        }
    }
    return newArr;
  }

  const countDots = (arr) => arr.flat().reduce((acc, cur) => cur == '#' ? acc + 1 : acc, 0);

  lineReader.on('close', () => {
        let posArr = Array(maxY + 1).fill([]).map((arr) => Array(maxX + 1).fill('.'));
        pos.forEach((pos) => posArr[pos[1]][pos[0]] = '#');

        instructions.forEach((instruction, idx) => {
            if (instruction[0] == 'x') {
                posArr = foldLeft(posArr, Number(instruction[1]));
            } else if (instruction[0] == 'y') {
                posArr = foldUp(posArr, Number(instruction[1]));
            }
            if (idx == 0) {
                console.log('Dots after step 1:', countDots(posArr));
            }
        })
        posArr.forEach((line) => console.log(line.join('')));
  })