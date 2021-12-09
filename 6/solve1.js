'use strict';
let fish = [3,4,3,1,2]

function makeFishMap(arr, days) {
    const fishMap = new Map([[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]);
    for (let i = 0; i < arr.length; i++) {
        fishMap.set(arr[i], fishMap.get(arr[i]) ? fishMap.get(arr[i]) + 1 : 1);
    }
    for (let i = 0; i < days; i++) {
        let newFish = 0;
        for (const [timer, count] of fishMap) {
            if (timer == 0) {
                newFish = count;
            }
            if (timer < 8) {
                fishMap.set(timer, fishMap.get(timer + 1));
            }
        }
        fishMap.set(6, fishMap.get(6) + newFish);
        fishMap.set(8, newFish);
    }
    return fishMap;
}

function countFish(fishMap) {
    let fishCount = 0;
    for (const [_timer, count] of fishMap) {
        fishCount += count;
    }
    return fishCount;
}

console.log('Part 1:', countFish(makeFishMap(fish, 80)));
console.log('Part 2:', countFish(makeFishMap(fish, 256)));