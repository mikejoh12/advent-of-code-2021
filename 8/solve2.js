const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
let tSum = 0;

function makeDigMap(digits) {
    let digMap = new Map();
    // Map the 4 easy digits with different length (1,4,7,8)
    const oneIdx = digits.findIndex((el) => el.length == 2);
    const one = digits[oneIdx];
    digMap.set(digits[oneIdx], 1);
    digits.splice(oneIdx, 1);

    const fourIdx = digits.findIndex((el) => el.length == 4);
    digMap.set(digits[fourIdx], 4);
    digits.splice(fourIdx, 1);

    const sevenIdx = digits.findIndex((el) => el.length == 3);
    digMap.set(digits[sevenIdx], 7);
    digits.splice(sevenIdx, 1);

    const eightIdx = digits.findIndex((el) => el.length == 7);
    digMap.set(digits[eightIdx], 8);
    digits.splice(eightIdx, 1);
    // Remaining digits have length 5 (2,3,5) or 6 (0,6,9)
    // Use combo of length and our known digit maps to map remaining
    const threeIdx = digits.findIndex((el) =>
        el.length == 5 &&
        one.split('').every((letter) => el.includes(letter)))
    const three = digits[threeIdx];
    digMap.set(digits[threeIdx], 3);
    digits.splice(threeIdx, 1);

    const nineIdx = digits.findIndex((el) =>
        el.length == 6 &&
        three.split('').every((letter) => el.includes(letter)))
    const nine = digits[nineIdx];
    digMap.set(digits[nineIdx], 9);
    digits.splice(nineIdx, 1);

    const fiveIdx = digits.findIndex((el) =>
        el.length == 5 &&
        el.split('').every((letter) => nine.includes(letter)));
    digMap.set(digits[fiveIdx], 5);
    digits.splice(fiveIdx, 1);

    const twoIdx = digits.findIndex((el) => el.length == 5)
    digMap.set(digits[twoIdx], 2);
    digits.splice(twoIdx, 1);

    const zeroIdx = digits.findIndex((el) => 
        el.length == 6 &&
        one.split('').every((letter) => el.includes(letter))
    )
    digMap.set(digits[zeroIdx], 0);
    digits.splice(zeroIdx, 1)

    const six = digits[0];
    digMap.set(six, 6);

    return digMap;
}

function findDig(str, digMap) {
    for (const [key] of digMap) {
        if (str.length == key.length &&
            str.split('').every((letter) => key.includes(letter))) {
                return digMap.get(key);
        }
    }
}

lineReader.on('line', (line) => {
    const lineArr = line.split('|');
    const digits = lineArr[0].trim().split(' ');
    const digMap = makeDigMap(digits);
    let oneSum = '';
    const outWords = lineArr[1].trim().split(' ');
    outWords.forEach((word) => {
        const dig = findDig(word, digMap);
        oneSum += dig;
    });
    tSum += Number(oneSum);
});
lineReader.on('close', () => console.log(tSum));
