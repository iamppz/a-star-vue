function distanceOfPointToLine(beginX, beginY, endX, endY, ptX, ptY) {
    var k = (endY - beginY || 1) / (endX - beginX || 1);
    var b = beginY - k * beginX;
    return Math.abs(k * ptX - ptY + b) / Math.sqrt(k * k + 1);
}

function between(num1, num2, num) {
    return (num > num1 && num < num2) || (num > num2 && num < num1);
}
export default { distanceOfPointToLine, between };
