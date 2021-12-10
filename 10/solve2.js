const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

  let incomplete = [];

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
    if (!wrongChar) {
        incomplete.push(lineArr);
    }
  });
  
  lineReader.on('close', () => {
    const lineScores = [];
    const complete = incomplete.map((line) => {
        let lineScore = 0;
        let newLine = [];
        for (let i = line.length - 1; i >= 0; i--) {
            lineScore *= 5;
            if (line[i] == '[') {
                newLine.unshift('[');
                newLine.push(']');
                lineScore += 2;
            } else if (line[i] == '{') {
                newLine.unshift('{');
                newLine.push('}');
                lineScore += 3;
            } else if (line[i] == '<') {
                newLine.unshift('<');
                newLine.push('>');
                lineScore += 4;

            } else if (line[i] == '(') {
                newLine.unshift('(');
                newLine.push(')');
                lineScore += 1;
            }
        }
        lineScores.push(lineScore); 
    })
    lineScores.sort((a, b) => b - a); 
    console.log(lineScores[(lineScores.length - 1) / 2]);
  })
