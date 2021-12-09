const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./count.txt')
  });
  
  let count = 0;
  let prevLine = null;

  lineReader.on('line', (line) => {
        if (prevLine && Number(line) > Number(prevLine)) {
            count++;
        }
    prevLine = line;
  });
  
  lineReader.on('close', () => {
    console.log(count);
  })
