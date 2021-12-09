const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

let outPut = [];

lineReader.on('line', (line) => {
    const lineArr = line.split('|');
    const outWords = lineArr[1].trim().split(' ');
    console.log(outWords);
    outPut.push(outWords);
});

lineReader.on('close', () => {
    console.log(outPut);
    let unique = 0;
    outPut.forEach((arr) => {
        arr.forEach(word => {
            if (word.length == 2 ||
                word.length == 3 ||
                word.length == 4 ||
                word.length == 7) {
                    unique++;
                }
        }
    )})
    console.log(unique);
});