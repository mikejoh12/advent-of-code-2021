const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
  
  let movingFloor = [];
  lineReader.on('line', (line) => movingFloor.push(line.split('')));
  
  function move(arr) {
      let newArr = Array(arr.length).fill('.').map((e) => Array(arr[0].length).fill('.'));
      let modified = false;
      for (let y = 0; y < arr.length; y++) {
          for (let x = 0; x < arr[0].length; x++) {
            if (arr[y][x] == '>' && x <= arr[0].length - 2 && arr[y][x+1] == '.') {
                newArr[y][x+1] = '>';
                modified = true;
            } else if (x == arr[0].length - 1 && arr[y][x] == '>' && arr[y][0] == '.') {
                newArr[y][0] = '>';
                modified = true;
            } else if (arr[y][x] == '>') {
                newArr[y][x] = '>';
            }
          }
      }
      for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[0].length; x++) {
          if (arr[y][x] == 'v' && y <= arr.length - 2 && newArr[y+1][x] == '.' && arr[y+1][x] != 'v') {
              newArr[y+1][x] = 'v';
              modified = true;
          } else if (y == arr.length - 1 && arr[y][x] == 'v' && newArr[0][x] == '.' && arr[0][x] != 'v') {
              newArr[0][x] = 'v';
              modified = true;
          } else if (arr[y][x] == 'v') {
              newArr[y][x] = 'v';
          }
        }
    }
    return modified ? newArr : null;
  }

  lineReader.on('close', () => {
    let moves = 0;
    while (movingFloor) {
        movingFloor = move(movingFloor);
        moves++;
    }
    console.log(moves);
  })