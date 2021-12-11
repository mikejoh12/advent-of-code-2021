const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
  
  let map = [], sFlashes = 0, flashes = 0, stepCount = 0;

  lineReader.on('line', (line) => {
    map.push(line.split('').map((nr) => Number(nr)));
  });
 
function flash(arr, flashY, flashX) {
    let maxY = Math.min(flashY + 1, arr.length - 1);
    let maxX = Math.min(flashX + 1, arr[0].length - 1);
    for (let y = Math.max(0, flashY - 1); y <= maxY; y++) {
        for (let x = Math.max(0, flashX - 1); x <= maxX; x++) {
                arr[y][x]++;
        }
    }
    arr[flashY][flashX] = 0;
}

function step(arr) {
    stepCount++;
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            arr[y][x]++;
        }
    }
    let flashing = true, flashPos = [];
    flashloop:
    while (flashing) {
        for (let y = 0; y < arr.length; y++) {
            for (let x = 0; x < arr[y].length; x++) {
                if (arr[y][x] > 9) {
                    flash(arr, y, x);
                    flashPos.push([y, x]);
                    flashes++;
                    sFlashes++;
                    continue flashloop;
                }
            }
        }
        flashing = false;
    }
    if (stepCount === 100) {
        console.log('Flashes after step 100:', flashes);
    }
    if (sFlashes == 100) {
        console.log('100 flashes in step:', stepCount);
        return false;
    }
    flashPos.forEach((pos) => arr[pos[0]][pos[1]] = 0);
    sFlashes = 0;
    return true;
}

  lineReader.on('close', () => {
    let searching = true;
    while(searching) {
        searching = step(map);
    }
  })