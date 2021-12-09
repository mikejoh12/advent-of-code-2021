const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
let hMap = [];
lineReader.on('line', (l) => hMap.push(l.split('').map((nr) => Number(nr)))
);

function findLows(arr) {
    let lows = [];
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            let near = [];
            near.push(arr[y][x-1]);
            near.push(arr[y][x+1]);
            if (arr[y-1]) {
                near.push(arr[y-1][x]);
            };
            if (arr[y+1]) {
                near.push(arr[y+1][x]);
            };
            const nearNrs = near.filter((elem) => typeof elem == "number");
            if (nearNrs.every((nr) => nr > arr[y][x])) {
                lows.push([y,x]);
            };
        }
    }
    return lows;
}

const findRiskSum = (arr, lows) => lows.reduce((acc, cur) => arr[cur[0]][cur[1]] + acc + 1, 0);

function findArea(lowX, lowY, arr) {
    let area = 0; // The area for this low-point
    function find(x, y) {
        if (y < 0 || y >= arr.length || // Above/below
            typeof arr[y][x] != "number" || // Outside
            arr[y][x] == 9) { // 9 Boundary
            return null;
        }
        area++;
        arr[y][x] = null; // Mark element as counted
        return  find(x+1, y) || find(x-1, y) || find(x, y+1) || find(x, y-1);
    }
    find(lowX, lowY);
    return area;
}

lineReader.on('close', () => {
    const lows = findLows(hMap);
    console.log('Problem 1:', findRiskSum(hMap, lows));
    const lowA = lows.map((low) => findArea(low[1], low[0], hMap)).sort((a, b) => b - a);
    console.log('Problem 2:', lowA[0] * lowA[1] * lowA[2]);
});