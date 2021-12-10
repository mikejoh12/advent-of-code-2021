const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

  function getScore(char) {
    return  char  == ')' ? 3 :
            char  == ']' ? 57 :
            char == '}' ? 1197 :
            char == '>' ? 25137 :
            0
  }
  let total =  0;

  lineReader.on('line', (line) => {
    const lineArr = line.split('');
    let removing = true;
    while (removing) {
      const idx = lineArr.findIndex((elem, i, arr) => {
        const twoL = elem + arr[i + 1];
        return twoL == '[]' | twoL == '{}'|| twoL == '<>' || twoL == '()' ? true : false;
      })
      if (idx == -1) {
        removing = false;
      } else {
        lineArr.splice(idx, 2);
      }
    }
    const wrongChar = lineArr.find((char) => char == ']' || char == '}' || char == '>' || char == ')');
    total += getScore(wrongChar);
  });
  
  lineReader.on('close', () => {
    console.log(total);
  })
