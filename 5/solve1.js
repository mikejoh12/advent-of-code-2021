'use strict';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

const directions = [];
const maxXY = [0, 0];

lineReader.on('line', (line) => {
  const [dir1, dir2] = line.split(' -> ');
  const dir1nrs = dir1.split(',').map((nr) => Number(nr));
  const dir2nrs = dir2.split(',').map((nr) => Number(nr));
  directions.push([dir1nrs, dir2nrs]);
  maxXY[0] = Math.max(maxXY[0], dir1nrs[0], dir2nrs[0]);
  maxXY[1] = Math.max(maxXY[1], dir1nrs[1], dir2nrs[1]);
});

const getStraight = (arr) => arr.filter((dirArr) => {
    const [dir1, dir2] = dirArr;
    return  dir1[0] == dir2[0] || dir1[1] == dir2[1] ? true : false;
})

const drawLine = (arr, line)  => {
    if (line[0][0] == line[1][0]) { // vertical
        const start = Math.min(line[0][1], line[1][1]);
        const end = Math.max(line[0][1], line[1][1]);
        for (let i = start; i <= end; i++) {
            arr[line[0][0]][i]++;
        }
    } else if (line[0][1] == line[1][1]) { // horizontal
        const start = Math.min(line[0][0], line[1][0]);
        const end = Math.max(line[0][0], line[1][0]);
        for (let i = start; i <= end; i++) {
            arr[i][line[0][1]]++;
        }
    }
}

const countDiagram = (arr) => arr.flat().reduce((acc, cur) => cur > 1 ? acc + 1 : acc, 0); 

lineReader.on('close', () => {
  const straightL = getStraight(directions);
  const diagram = Array(maxXY[0] + 1).fill(0).map((x) => Array(maxXY[1] + 1).fill(0));
  straightL.forEach((line) => drawLine(diagram, line));
  console.log(countDiagram(diagram));
});