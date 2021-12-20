const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });
  
  let algo = '', imgArr = [], readingAlgo = true;

  lineReader.on('line', (line) => {
      if (readingAlgo) {
        algo += line;
        if (!line) readingAlgo = false;
      } else {
        imgArr.push(line.split(''));
      }
  });
  
  function padImgArr(arr, padding) {
    for (let i = 0; i < padding; i++) {
        arr.unshift(Array(arr[0].length).fill('.'));
        arr.push(Array(arr[0].length).fill('.'));
    }
    let paddedArr = arr.map((row) => {
        return [...Array(padding).fill('.').concat(row).concat(Array(padding).fill('.'))];
    })
    return paddedArr;
  }

  function mapPix(imgArr, y, x) {
      const minY = Math.max(0, y - 1);
      const maxY = Math.min(imgArr.length - 1, y + 1);
      const minX = Math.max(0, x - 1);
      const maxX = Math.min(imgArr[0].length, x + 1);
      let binNr = [];
      for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            binNr.push(imgArr[y][x] == '#' ? 1 : 0);
          }
      }
      return algo[parseInt(binNr.join(''), 2)];
  }

  function mapImg(imgArr) {
        let newImg = []
        for (let y = 0; y < imgArr.length; y++) {
            let newRow = [];
            for (let x = 0; x < imgArr[0].length; x++) {
                newRow.push(mapPix(imgArr, y, x));
            }
            newImg.push(newRow);
        }
        return newImg;
  }

  function stripEdge(imgArr) {
      imgArr.shift();
      imgArr.pop();
      let newImg = [];
      imgArr.forEach((row) => {
          row.shift();
          row.pop();
          newImg.push(row);
      })
      return newImg;
  }

  const countPix = (imgArr) => imgArr.flat().reduce((acc, cur) => cur == '#' ? acc + 1 : acc, 0);

  lineReader.on('close', () => {
    let part1result = 0, paddedImg = padImgArr(imgArr, 110);
    for (let i = 1; i <= 50; i++) {
        paddedImg = stripEdge(mapImg(paddedImg));
        if (i == 2) part1result = countPix(paddedImg);
    }
    paddedImg.forEach((row) => console.log(row.join(''))); // Print the image
    console.log('Part 1:', part1result, 'Part 2:', countPix(paddedImg));
  });