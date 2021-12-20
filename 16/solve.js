'use strict';
const input = 'E0529D18025800ABCA6996534CB22E4C00FB48E233BAEC947A8AA010CE1249DB51A02CC7DB67EF33D4002AE6ACDC40101CF0449AE4D9E4C071802D400F84BD21CAF3C8F2C35295EF3E0A600848F77893360066C200F476841040401C88908A19B001FD35CCF0B40012992AC81E3B980553659366736653A931018027C87332011E2771FFC3CEEC0630A80126007B0152E2005280186004101060C03C0200DA66006B8018200538012C01F3300660401433801A6007380132DD993100A4DC01AB0803B1FE2343500042E24C338B33F5852C3E002749803B0422EC782004221A41A8CE600EC2F8F11FD0037196CF19A67AA926892D2C643675A0C013C00CC0401F82F1BA168803510E3942E969C389C40193CFD27C32E005F271CE4B95906C151003A7BD229300362D1802727056C00556769101921F200AC74015960E97EC3F2D03C2430046C0119A3E9A3F95FD3AFE40132CEC52F4017995D9993A90060729EFCA52D3168021223F2236600ECC874E10CC1F9802F3A71C00964EC46E6580402291FE59E0FCF2B4EC31C9C7A6860094B2C4D2E880592F1AD7782992D204A82C954EA5A52E8030064D02A6C1E4EA852FE83D49CB4AE4020CD80272D3B4AA552D3B4AA5B356F77BF1630056C0119FF16C5192901CEDFB77A200E9E65EAC01693C0BCA76FEBE73487CC64DEC804659274A00CDC401F8B51CE3F8803B05217C2E40041A72E2516A663F119AC72250A00F44A98893C453005E57415A00BCD5F1DD66F3448D2600AC66F005246500C9194039C01986B317CDB10890C94BF68E6DF950C0802B09496E8A3600BCB15CA44425279539B089EB7774DDA33642012DA6B1E15B005C0010C8C917A2B880391160944D30074401D845172180803D1AA3045F00042630C5B866200CC2A9A5091C43BBD964D7F5D8914B46F040';

const literal1 = 'D2FE28'
const operator1 = '38006F45291200';
const operator2 = 'EE00D40C823060';
const lit2 = '1101000010110101010';

function hex2bin(hex){
    hex = hex.replace("0x", "").toLowerCase();
    var out = "";
    for(var c of hex) {
        switch(c) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }

    return out;
}

function decodeLiteral(str) {
    const arr = str.split('');
    const lastIdx = arr.findIndex((dig, idx) => idx % 5 == 0 && dig == '0') + 5;
    const smallArr = arr.slice(0, lastIdx);
    const nrArr = smallArr.filter((_dig, idx) => idx % 5 != 0);
    return parseInt(nrArr.join(''), 2);
}

function findEndLiteral(str) {
    const arr = str.split('');
    const lastIdx = 5 + arr.slice(6).findIndex((dig, idx) => idx % 5 == 0 && dig == '0') + 5;
    return lastIdx;
}

function parseLiteral(str) {
    const version = parseInt(str.slice(0, 3), 2);
    const value = decodeLiteral(str.slice(6))
    const end = findEndLiteral(str);
    return {
        version,
        type: 'literal-value',
        value: value,
        end,
        remainingStr: str.slice(end + 1)
    }
}

function decodePacket(str) {
    if (!str) return null;
    const version = parseInt(str.slice(0, 3), 2);
    const typeId = str.slice(3, 6);
    if (typeId == '100') { // literal value
        return parseLiteral(str);
    } else { // operator packet
        const lengthId = str.slice(6, 7);
        if (lengthId == 0) { // next 15 bits = length in bits of subpackets
            const subPacketLength = str.slice(7, 22);
            const length = parseInt(subPacketLength, 2);
            return {
                version,
                type: 'operator',
                lengthId,
                subPacketLength: length,
                end: 7 + 15 + subPacketLength,
                remainingStr: str.slice(22, + subPacketLength)
            }
        } else { // next 11 bits = nr of subpackets
            const nrSubpackets = parseInt(str.slice(7, 18), 2);
            return {
                version,
                type: 'operator',
                lengthId,
                nrSubpackets,
                remainingStr: str.slice(18) // Return rest of string
            }
        }
    }
}

const findPacketType = (str) => str.slice(3, 6) == '100' ? 'literal-value' : 'operator';

function solve(packet) {
    let count = 0, versionSum = 0;
    function find(packet) {
        count++;
        const decoded = decodePacket(packet);
        //console.log('decoded', decoded);
        let { remainingStr, version, type, lengthId } = decoded;
        versionSum += version;
        if (remainingStr) {
            const subPacketType = findPacketType(remainingStr);
            if (type == 'operator' && lengthId == 0) {
                const { subPacketLength } = decoded;
                const returnString = remainingStr.slice(subPacketLength);
                remainingStr = remainingStr.slice(0, subPacketLength);
                if (subPacketType == 'literal-value') {
                    while(remainingStr && remainingStr.length >= 11) {
                        const rem = parseLiteral(remainingStr);
                        console.log('type 0 literal', rem);
                        versionSum += rem.version;
                        remainingStr = rem.remainingStr;
                    }
                } else {
                    while(remainingStr && remainingStr.length >= 11) {
                        remainingStr = find(remainingStr);
                    }
                    return returnString;
                }
                return returnString;
            } else if (type == 'operator' && lengthId == 1) {
                const { nrSubpackets } = decoded;
                if (subPacketType == 'literal-value') {
                    for (let i = 1; i <= nrSubpackets; i++) {
                        const rem = parseLiteral(remainingStr);
                        versionSum += rem.version;
                        remainingStr = rem.remainingStr;
                    }
                    return remainingStr;
                } else {
                    for (let i = 1; i <= nrSubpackets; i++) {
                        remainingStr = find(remainingStr);
                    }
                    return remainingStr;
                }
            }
        }
    }

    find(packet);
    console.log('count', count);
    return versionSum;
}

const op1 = '00111000000000000110111101000101001010010001001000000000';
console.log('op1', solve(op1));

const op2 = '11101110000000001101010000001100100000100011000001100000';
console.log('op2', solve(op2));


const example1 = hex2bin('8A004A801A8002F478');
console.log('example1', solve(example1));


const example2 = hex2bin('620080001611562C8802118E34'); // NOT PASSING
console.log('example2', solve(example2));

const example3 = hex2bin('C0015000016115A2E0802F182340'); // NOT PASSING
console.log('example3', solve(example3));


const example4 = hex2bin('A0016C880162017C3686B18A3D4780');
console.log('example4', solve(example4));
/*
const problem1 = hex2bin(input);
console.log('problem1', solve(problem1));
*/
