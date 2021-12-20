const fs = require('fs');
const input = fs.readFileSync('./data.txt').toString();

const hex2bin = (hex) => hex.split('').map((letter) =>
    parseInt(letter, 16).toString(2).padStart(4, '0')).join('');

function decodeLiteral(str) {
    const arr = str.split('');
    const lastIdx = arr.findIndex((dig, idx) => idx % 5 == 0 && dig == '0') + 5;
    const smallArr = arr.slice(0, lastIdx);
    const nrArr = smallArr.filter((_dig, idx) => idx % 5 != 0);
    return parseInt(nrArr.join(''), 2);
}

function findEndLiteral(str) {
    return 5 + str.split('').slice(6).findIndex((dig, idx) => idx % 5 == 0 && dig == '0') + 5;
}

function decodePacket(str) {
    if (!str) return null;
    const version = parseInt(str.slice(0, 3), 2);
    const typeId = str.slice(3, 6);
    if (typeId == '100') { // literal value
        const value = decodeLiteral(str.slice(6))
        const end = findEndLiteral(str);
        return {
            version,
            typeId,
            type: 'literal-value',
            value: value,
            remainingStr: str.slice(end + 1)
        }
    } else { // operator type 0
        const lengthId = str.slice(6, 7);
        if (lengthId == 0) { // next 15 bits = length in bits of subpackets
            const subPacketLength = str.slice(7, 22);
            const length = parseInt(subPacketLength, 2);
            return {
                version,
                typeId,
                type: 'operator-0',
                subPacketLength: length,
                remainingStr: str.slice(22, + subPacketLength)
            }
        } else { // operator type 1
            const nrSubpackets = parseInt(str.slice(7, 18), 2);
            return {
                version,
                typeId,
                type: 'operator-1',
                nrSubpackets,
                remainingStr: str.slice(18) // Return rest of string
            }
        }
    }
}

function doMath(typeId, values) {
    return  typeId == '000' ? values.reduce((acc, cur) => acc + cur) :
            typeId == '001' ? values.reduce((acc, cur) => acc * cur) :
            typeId == '010' ? Math.min(...values) :
            typeId == '011' ? Math.max(...values) :
            typeId == '101' ? values[0] > values[1] ? 1 : 0 :
            typeId == '110' ? values[0] < values[1] ? 1 : 0 :
            typeId == '111' ? values[0] == values[1] ? 1 : 0 : null;
}

function solve(hexPacket) {
    const binPacket = hex2bin(hexPacket);
    let versionSum = 0;
    function find(packet) {
        const decoded = decodePacket(packet);
        let { remainingStr, version, typeId, type, nrSubpackets, subPacketLength, value } = decoded;
        versionSum += version;
        if (type == 'literal-value') {
            return { remainingStr, value };
        } else if (type == 'operator-0') {
            const returnString = remainingStr.slice(subPacketLength);
            remainingStr = remainingStr.slice(0, subPacketLength);
            let values = [];
            while(remainingStr && remainingStr.length >= 11) {
                ({ value, remainingStr } = find(remainingStr));
                values.push(value);
            }
            return { remainingStr: returnString, value: doMath(typeId, values) };
        } else if (type == 'operator-1') {
            let values = [];
            for (let i = 1; i <= nrSubpackets; i++) {
                ({ value, remainingStr } = find(remainingStr));
                values.push(value);
            }
            return { remainingStr, value: doMath(typeId, values) };
        }
    }
    const result = find(binPacket)
    return { versionSum, mathResult: result.value }
}

console.log('Problem 1 and 2:', solve(input));