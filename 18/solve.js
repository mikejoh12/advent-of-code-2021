const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')});

let nrs = []
lineReader.on('line', (line) => nrs.push(line.split('')));

function findExploding(arr) {
    let stack = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '[') {
            stack.push('[');
        } else if (arr[i] == ']') {
            stack.pop('[')
        }
        if (stack.length >= 5) {
            return { index: i, left: arr[i + 1], right: arr[i + 3] }
        }
    }
    return false;
}

function explode(arr, pairIdx, leftVal, rightVal) {
    let left = arr.slice(0, pairIdx);
    let right = arr.slice(pairIdx + 5);
    for (let i = left.length - 1; i >= 0; i--) {
        if (!isNaN(arr[i])) {
            left[i] = Number(left[i]) + Number(leftVal);
            break;
        }
    }
    const rightNrIdx = right.findIndex((elem) => !isNaN(elem));
    if (rightNrIdx != -1) {
        right[rightNrIdx] = Number(right[rightNrIdx]) + Number(rightVal);
    }
    return [...left, '0', ...right];
}

function split(arr) {
    const nrIdx = arr.findIndex((nr) => nr.toString().length >= 2);
    if (nrIdx == -1) return null;
    let newPair = ['[', Math.floor(arr[nrIdx] / 2), ',', Math.ceil(arr[nrIdx] / 2), ']'];
    return arr.slice(0, nrIdx).concat(newPair).concat(arr.slice(nrIdx + 1));
}

function processTwo(nr1, nr2) {
    let addTwo = ['[', ...nr1, ',', ...nr2, ']'];
    let processing = true;
    while(processing) {
        const explodeData = findExploding(addTwo);
        if (explodeData) {
            const { index, left, right } = explodeData;
            addTwo  = explode(addTwo, index, left, right);
            continue;
        }
        const splitData = split(addTwo);
        if (splitData) {
            addTwo = splitData;
            continue;
        }
        break;
    }
    return addTwo;
}

function findMagnitude(arr) {
    while(arr.length > 5) {
        const pairIdx = arr.findIndex((elem, idx, arr) => elem == '[' && arr[idx+4] == ']');
        if (pairIdx != -1) {
            const pairMagn = arr[pairIdx + 1] * 3 + arr[pairIdx + 3] * 2;
            arr = arr.slice(0, pairIdx).concat([pairMagn]).concat(arr.slice(pairIdx + 5));
            continue;
        }
    }
    return 3 * arr[1] + 2 * arr[3];
}

lineReader.on('close', () => {
    const added = nrs.reduce((acc, cur) => processTwo(acc, cur));
    let maxMagn = 0;
    for (let i = 0; i < nrs.length; i++) {
        for (let j = 0; j < nrs.length; j++) {
            if (i != j) {
                maxMagn = Math.max(maxMagn, findMagnitude(processTwo(nrs[i], nrs[j])));
            }
        }
    }
    console.log('Problem 1:', findMagnitude(added));
    console.log('Problem 2:', maxMagn);
})