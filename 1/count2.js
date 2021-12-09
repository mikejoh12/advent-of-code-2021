const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./count.txt')
  });
  
  let count = 0;
  let prevWindow = [], currWindow = []

  lineReader.on('line', (line) => {
        currWindow.push(Number(line));
        if (currWindow.length > 3) {
            currWindow.shift();
        }

        const prevSum = prevWindow.reduce((acc, cur) => acc + cur, 0);
        const curSum = currWindow.reduce((acc, cur) => acc + cur, 0);

        if (prevWindow.length === 3 && currWindow.length === 3 && curSum > prevSum) {
                console.log(`curSum ${curSum} > prevSum ${prevSum}`);
                count++;
        }

    prevWindow = [...currWindow];
  });
  
  lineReader.on('close', () => {
    console.log('nr of increases ', count);
  })
