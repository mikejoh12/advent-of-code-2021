const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
   
const cube = Array(101).fill(false).map(
    (elem) => Array(101).fill(false).map(  
    (elem) => Array(101).fill(false)));
  
function toggleCuboid({x1, x2, y1, y2, z1, z2, mode}) {
    console.log(mode, x1, x2, y1, y2, z1, z2);
    if ([x1,x2,y1,y2,z1,z2].some((elem) => elem < - 50 || elem > 50)) {
        return;
    }
    for (let x = x1+50; x <= x2+50; x++) {
        for (let y = y1+50; y <= y2+50; y++) {
            for (let z = z1+50; z <= z2+50; z++) {
                cube[x][y][z] = mode == 'on' ? true : false;
            }
        }
    }
}  

const countCubes = (arr) => arr.flat(3).reduce((acc, cur) => cur == true ? acc + 1 : acc, 0);

  lineReader.on('line', (line) => {
    const [mode, pos] = line.split(' ');
    const [x, y, z] = pos.split(',');
    const xNrs = x.split('=')[1];
    const [x1, x2] = xNrs.split('..').map((nr) => Number(nr));
    const yNrs = y.split('=')[1];
    const [y1, y2] = yNrs.split('..').map((nr) => Number(nr));
    const zNrs = z.split('=')[1];
    const [z1, z2] = zNrs.split('..').map((nr) => Number(nr));
    toggleCuboid({x1, x2, y1, y2, z1, z2, mode});
  });
  
  lineReader.on('close', () => {
    console.log(countCubes(cube));
  })
