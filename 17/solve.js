const targetX = [287, 309], targetY=[-76, -48];
let highestY = 0, hitCount = 0;

const doStep = ({xPos, yPos, xVel, yVel}) => ({
        xPos: xPos + xVel,
        yPos: yPos + yVel,
        xVel: xVel > 0 ? xVel - 1 :
              xVel < 0 ? xVel + 1 : 0,
        yVel: yVel - 1
    });

const hitTarget = (xPos, yPos) =>
    xPos >= targetX[0] && xPos <= targetX[1] && yPos >= targetY[0] && yPos <= targetY[1] ?
    true : false;

function fire(xVel, yVel) {
    let step = 1, hit = false, maxY = 0;
    let newData = doStep({xPos: 0, yPos:0, xVel, yVel});
    while (!hit) {
        const { xPos, yPos } = newData;
        maxY = yPos > maxY ? yPos : maxY;
        newData = doStep(newData);
        step++;
        hit = hitTarget(xPos, yPos);
        if (hit) {
            return { hit: true, maxY } ;
        } else if (yPos < targetY[0]) {
            return { hit: false };
        }
    }
}

for (let xVel = 1; xVel < 700; xVel++) {
    for (let yVel = -100; yVel < 500; yVel++) {
        const { hit, maxY } = fire(xVel, yVel);
        if (hit) {
            hitCount++;
            highestY = maxY > highestY ? maxY : highestY;
        }
    }
}

console.log('Highest y:', highestY, 'Hit count:', hitCount);