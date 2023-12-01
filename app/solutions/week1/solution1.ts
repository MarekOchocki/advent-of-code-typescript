import * as fs from 'fs';

const wordToDigitMap = new Map([
    ["zero", 0],
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
]);

function getDigitAtPosition(line: string, index: number): number | undefined {
    if(line.charCodeAt(index) >= "0".charCodeAt(0) && line.charCodeAt(index) <= "9".charCodeAt(0)) {
        return +line.charAt(index);
    }
    return undefined;
}

function containsSubstringAtPosition(str: string, substring: string, position: number): boolean {
    return str.substring(position, position + substring.length) === substring;
}

function getDigitAtPositionAdvanced(line: string, index: number): number | undefined {
    let result = getDigitAtPosition(line, index);
    if(result !== undefined) {
        return result;
    }

    wordToDigitMap.forEach((value, key) => {
        if(containsSubstringAtPosition(line, key, index)) {
            result = value;
        }
    });
    return result;
}

function getCalibrationValueFromLine(line: string, findDigitCallback: (line: string, index: number) => number | undefined) {
    let firstDigit = -1;
    let lastDigit = 0;
    for(let i = 0; i < line.length; i++) {
        const digit = findDigitCallback(line, i);
        if(digit === undefined)
            continue;

        firstDigit = firstDigit < 0 ? digit : firstDigit;
        lastDigit = digit;
    }
    return firstDigit * 10 + lastDigit;
}

function getSolution1(findDigitCallback: (line: string, index: number) => number | undefined) {
    const inputContent = fs.readFileSync('./app/res/week1/input1.txt').toString();
    const calibrationValues = inputContent.split('\n').map(line => getCalibrationValueFromLine(line, findDigitCallback));
    return calibrationValues.reduce((acc, value) => acc + value);
}

function printSolution1Part1() {
    console.log(getSolution1(getDigitAtPosition));
}

function printSolution1Part2() {
    console.log(getSolution1(getDigitAtPositionAdvanced));
}

export function printSolutions1() {
    printSolution1Part1();
    printSolution1Part2();
}
