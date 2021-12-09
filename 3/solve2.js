const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./count.txt')
  });

let nrArr = []

lineReader.on('line', (line) => {
    nrArr.push(line);
});

const findMostCommon = (arr, idx) => {
    let zeroCount = 0;
    let oneCount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][idx] == '0') {
            zeroCount++;
        } else {
            oneCount++;
        }
    }
    if (zeroCount == oneCount) {
        return null
    } else {
        return zeroCount > oneCount ? '0' : '1';
    }
}

const findLeastCommon = (arr, idx) => {
    let zeroCount = 0;
    let oneCount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][idx] == '0') {
            zeroCount++;
        } else {
            oneCount++;
        }
    }
    if (zeroCount == oneCount) {
        return null
    } else {
        return zeroCount > oneCount ? '1' : '0';
    }
}

lineReader.on('close', () => {
    let oxyArr = [...nrArr];
    let oxyIdx = 0;
    while (oxyArr.length > 1) {
        const mostCommon = findMostCommon(oxyArr, oxyIdx);
        if (mostCommon == '0') {
            oxyArr = oxyArr.filter((nr) => nr[oxyIdx] == '0');
        } else {
            oxyArr = oxyArr.filter((nr) => nr[oxyIdx] == '1')
        }
        oxyIdx++;
    }

    let o2Arr = [...nrArr];
    let o2Idx = 0;
    while (o2Arr.length > 1) {
        const leastCommon = findLeastCommon(o2Arr, o2Idx);
        if (leastCommon == '1') {
            o2Arr = o2Arr.filter((nr) => nr[o2Idx] == '1');
        } else {
            o2Arr = o2Arr.filter((nr) => nr[o2Idx] == '0')
        }
        o2Idx++;
    }

    console.log(parseInt(oxyArr, 2) * parseInt(o2Arr, 2));
});