function lineTo(canId, x1, y1, x2, y2, lineWidth, strokeStyle, dash) {
    let sta = [x1, y1];
    let end = [x2, y2];
    let canvas = document.getElementById(canId);
    let ctx = canvas.getContext('2d');
    if (dash) {
        ctx.setLineDash(dash);
    }
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.translate(0, 0, 0);
    ctx.moveTo(sta[0], sta[1]);
    ctx.translate(0, 0, 0);
    ctx.moveTo(sta[0], sta[1]);
    ctx.translate(0, 0, 0);
    ctx.lineTo(end[0], end[1]);
    ctx.fill();
    ctx.stroke();
    if (dash) {
        ctx.setLineDash([]);
    }
    ctx.save();
}

function clearCanvas(canId) {
    let c = document.getElementById(canId);
    let cxt = c.getContext('2d');
    cxt.clearRect(0, 0, 800, 600);
}

function arrow2(canId, x1, y1, x2, y2, lineWidth, strokeStyle, startPosition, endPosition) {
    let points = [];
    let start = [x1, y1];
    let end = [x2, y2];
    let centerX = start[0] + (end[0] - start[0]) / 2;
    let centerY = start[1] + (end[1] - start[1]) / 2;
    let second;
    let addVerticalCenterLine = function() {
        let third = [centerX, second[1]];
        let forth = [centerX, penult[1]];
        points.push(third);
        points.push(forth);
    };
    let addHorizontalCenterLine = function() {
        let third = [second[0], centerY];
        let forth = [penult[0], centerY];
        points.push(third);
        points.push(forth);
    };
    let addHorizontalTopLine = function() {
        points.push([second[0], start[1] - 50]);
        points.push([penult[0], start[1] - 50]);
    };
    let addHorizontalBottomLine = function() {
        points.push([second[0], start[1] + 50]);
        points.push([penult[0], start[1] + 50]);
    };
    let addVerticalRightLine = function() {
        points.push([start[0] + 80, second[1]]);
        points.push([start[0] + 80, penult[1]]);
    };
    let addVerticalLeftLine = function() {
        points.push([start[0] - 80, second[1]]);
        points.push([start[0] - 80, penult[1]]);
    };
    let addSecondXPenultY = function() {
        points.push([second[0], penult[1]]);
    };
    let addPenultXSecondY = function() {
        points.push([penult[0], second[1]]);
    };
    switch (startPosition) {
        case 'left':
            second = [start[0] - 20, start[1]];
            break;
        case 'top':
            second = [start[0], start[1] - 20];
            break;
        case 'bottom':
            second = [start[0], start[1] + 20];
            break;
        default:
            second = [start[0] + 20, start[1]];
            break;
    }
    let penult = null;
    switch (endPosition) {
        case 'right':
            penult = [end[0] + 20, end[1]];
            break;
        case 'top':
            penult = [end[0], end[1] - 20];
            break;
        case 'bottom':
            penult = [end[0], end[1] + 20];
            break;
        default:
            penult = [end[0] - 20, end[1]];
            break;
    }
    points.push(start);
    points.push(second);
    startPosition = startPosition || 'right';
    endPosition = endPosition || 'left';
    let direction = getDirection(x1, y1, x2, y2);
    if (direction.indexOf('r') > -1) {
        if (startPosition === 'right' || endPosition === 'left') {
            if (second[0] > centerX) {
                second[0] = centerX;
            }
            if (penult[0] < centerX) {
                penult[0] = centerX;
            }
        }
    }
    if (direction.indexOf('d') > -1) {
        if (startPosition === 'bottom' || endPosition === 'top') {
            if (second[1] > centerY) {
                second[1] = centerY;
            }
            if (penult[1] < centerY) {
                penult[1] = centerY;
            }
        }
    }
    if (direction.indexOf('l') > -1) {
        if (startPosition === 'left' || endPosition === 'right') {
            if (second[0] < centerX) {
                second[0] = centerX;
            }
            if (penult[0] > centerX) {
                penult[0] = centerX;
            }
        }
    }
    if (direction.indexOf('u') > -1) {
        if (startPosition === 'top' || endPosition === 'bottom') {
            if (second[1] < centerY) {
                second[1] = centerY;
            }
            if (penult[1] > centerY) {
                penult[1] = centerY;
            }
        }
    }
    switch (direction) {
        case 'lu': {
            if (startPosition === 'right' && endPosition === 'left') {
                addHorizontalCenterLine();
            } else if (startPosition === 'right' && endPosition === 'right') {
                let third = [second[0], penult[1]];
                points.push(third);
            } else if (startPosition === 'right' && endPosition === 'top') {
                let third = [second[0], penult[1]];
                points.push(third);
            } else if (startPosition === 'right' && endPosition === 'bottom') {
                addHorizontalCenterLine();
            } else if (startPosition === 'bottom' && endPosition === 'left') {
                let third = [penult[0], second[1]];
                points.push(third);
            } else if (startPosition === 'bottom' && endPosition === 'bottom') {
                let third = [penult[0], second[1]];
                points.push(third);
            } else if (startPosition === 'bottom' && endPosition === 'right') {
                addPenultXSecondY();
            } else if (startPosition === 'bottom' && endPosition === 'top') {
                addVerticalCenterLine();
            } else if (startPosition === 'top' && endPosition === 'right') {
                let third = [start[0], end[1]];
                points.push(third);
            } else if (startPosition === 'top' && endPosition === 'left') {
                addHorizontalCenterLine();
            } else if (startPosition === 'top' && endPosition === 'top') {
                addSecondXPenultY();
            } else if (startPosition === 'top' && endPosition === 'bottom') {
                addHorizontalCenterLine();
            } else {
                // startPosition is left
                switch (endPosition) {
                    case 'top':
                    case 'right':
                        addVerticalCenterLine();
                        break;
                    default: {
                        let third = [penult[0], start[1]];
                        points.push(third);
                        break;
                    }
                }
            }
            break;
        }
        case 'u':
            if (startPosition === 'right') {
                switch (endPosition) {
                    case 'right': {
                        break;
                    }
                    case 'top': {
                        let third = [second[0], penult[1]];
                        points.push(third);
                        break;
                    }
                    default: {
                        addHorizontalCenterLine();
                        break;
                    }
                }
            } else if (startPosition === 'bottom') {
                switch (endPosition) {
                    case 'left':
                    case 'right':
                        points.push([penult[0], second[1]]);
                        break;
                    default: {
                        addVerticalRightLine();
                        break;
                    }
                }
            } else if (startPosition === 'top') {
                switch (endPosition) {
                    case 'left': {
                        points.push([penult[0], second[1]]);
                        break;
                    }
                    case 'right': {
                        addHorizontalCenterLine();
                        break;
                    }
                    case 'top':
                        addVerticalRightLine();
                        break;
                    default: {
                        break;
                    }
                }
            } else {
                // left
                switch (endPosition) {
                    case 'left':
                    case 'right':
                        break;
                    default: {
                        points.push([second[0], penult[1]]);
                        break;
                    }
                }
            }
            break;
        case 'ru':
            if (startPosition === 'right') {
                switch (endPosition) {
                    case 'left': {
                        addVerticalCenterLine();
                        break;
                    }
                    case 'top': {
                        addSecondXPenultY();
                        break;
                    }
                    default: {
                        addPenultXSecondY();
                        break;
                    }
                }
            } else if (startPosition === 'bottom') {
                switch (endPosition) {
                    case 'top': {
                        addVerticalCenterLine();
                        break;
                    }
                    default: {
                        addPenultXSecondY();
                        break;
                    }
                }
            } else if (startPosition === 'top') {
                switch (endPosition) {
                    case 'right': {
                        addVerticalCenterLine();
                        break;
                    }
                    default: {
                        addSecondXPenultY();
                        break;
                    }
                }
            } else {
                // left
                switch (endPosition) {
                    case 'left':
                    case 'top':
                        addSecondXPenultY();
                        break;
                    default: {
                        addHorizontalCenterLine();
                        break;
                    }
                }
            }
            break;
        case 'l':
            if (startPosition === 'right') {
                switch (endPosition) {
                    case 'left':
                    case 'right':
                    case 'top':
                        addHorizontalTopLine();
                        break;
                    default: {
                        addHorizontalBottomLine();
                        break;
                    }
                }
            } else if (startPosition === 'bottom') {
                switch (endPosition) {
                    case 'left': {
                        addHorizontalBottomLine();
                        break;
                    }
                    case 'right': {
                        addSecondXPenultY();
                        break;
                    }
                    case 'top': {
                        addVerticalCenterLine();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            } else if (startPosition === 'top') {
                switch (endPosition) {
                    case 'left': {
                        addHorizontalTopLine();
                        break;
                    }
                    case 'right': {
                        addSecondXPenultY();
                        break;
                    }
                    case 'top': {
                        break;
                    }
                    default: {
                        addVerticalCenterLine();
                        break;
                    }
                }
            } else {
                // left
                switch (endPosition) {
                    case 'left': {
                        addHorizontalTopLine();
                        break;
                    }
                    case 'right': {
                        break;
                    }
                    default: {
                        addSecondXPenultY();
                        break;
                    }
                }
            }
            break;
        case 'r':
            if (startPosition === 'right') {
                switch (endPosition) {
                    case 'left': {
                        break;
                    }
                    case 'right': {
                        addHorizontalTopLine();
                        break;
                    }
                    default: {
                        addSecondXPenultY();
                        break;
                    }
                }
            } else if (startPosition === 'bottom') {
                switch (endPosition) {
                    case 'left': {
                        addSecondXPenultY();
                        break;
                    }
                    case 'right': {
                        addHorizontalBottomLine();
                        break;
                    }
                    case 'top': {
                        addVerticalCenterLine();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            } else if (startPosition === 'top') {
                switch (endPosition) {
                    case 'left': {
                        addPenultXSecondY();
                        break;
                    }
                    case 'right': {
                        addHorizontalTopLine();
                        break;
                    }
                    case 'top': {
                        break;
                    }
                    default: {
                        addVerticalCenterLine();
                        break;
                    }
                }
            } else {
                // left
                switch (endPosition) {
                    case 'left':
                    case 'right':
                    case 'top':
                        addHorizontalTopLine();
                        break;
                    default: {
                        addHorizontalBottomLine();
                        break;
                    }
                }
            }
            break;
        case 'ld':
            if (startPosition === 'right') {
                switch (endPosition) {
                    case 'left': {
                        addHorizontalCenterLine();
                        break;
                    }
                    default: {
                        addSecondXPenultY();
                        break;
                    }
                }
            } else if (startPosition === 'bottom') {
                switch (endPosition) {
                    case 'left': {
                        addPenultXSecondY();
                        break;
                    }
                    case 'top': {
                        addHorizontalCenterLine();
                        break;
                    }
                    default: {
                        addSecondXPenultY();
                        break;
                    }
                }
            } else if (startPosition === 'top') {
                switch (endPosition) {
                    case 'left':
                    case 'right':
                    case 'top':
                        addPenultXSecondY();
                        break;
                    default: {
                        addVerticalCenterLine();
                        break;
                    }
                }
            } else {
                // left
                switch (endPosition) {
                    case 'left':
                    case 'top':
                        addPenultXSecondY();
                        break;
                    case 'right': {
                        addVerticalCenterLine();
                        break;
                    }
                    default: {
                        addSecondXPenultY();
                        break;
                    }
                }
            }
            break;
        case 'd':
            if (startPosition === 'right') {
                switch (endPosition) {
                    case 'left': {
                        addHorizontalCenterLine();
                        break;
                    }
                    case 'right': {
                        points.push([penult[0], second[1]]);
                        break;
                    }
                    case 'top': {
                        points.push([second[0], penult[1]]);
                        break;
                    }
                    default: {
                        addVerticalRightLine();
                        break;
                    }
                }
            } else if (startPosition === 'bottom') {
                switch (endPosition) {
                    case 'left':
                    case 'right':
                        addPenultXSecondY();
                        break;
                    case 'top': {
                        break;
                    }
                    default: {
                        addVerticalRightLine();
                        break;
                    }
                }
            } else if (startPosition === 'top') {
                switch (endPosition) {
                    case 'left': {
                        addVerticalLeftLine();
                        break;
                    }
                    default: {
                        addVerticalRightLine();
                        break;
                    }
                }
            } else {
                // left
                switch (endPosition) {
                    case 'left': {
                        break;
                    }
                    case 'right': {
                        addHorizontalCenterLine();
                        break;
                    }
                    case 'top': {
                        addSecondXPenultY();
                        break;
                    }
                    default: {
                        addVerticalLeftLine();
                        break;
                    }
                }
            }
            break;
        case 'rd': {
            if (
                (startPosition === 'right' && endPosition === 'left') ||
                (startPosition === 'right' && endPosition === 'bottom')
            ) {
                addSecondXPenultY();
            } else if (
                (startPosition === 'right' && endPosition === 'top') ||
                (startPosition === 'right' && endPosition === 'right')
            ) {
                let third = [penult[0], second[1]];
                points.push(third);
            } else if (startPosition === 'bottom' && endPosition === 'left') {
                let third = [second[0], penult[1]];
                points.push(third);
            } else if (startPosition === 'bottom' && endPosition === 'right') {
                let third = [penult[0], second[1]];
                points.push(third);
            } else if (startPosition === 'bottom' && endPosition === 'top') {
                addHorizontalCenterLine();
            } else if (startPosition === 'bottom' && endPosition === 'bottom') {
                let third = [second[0], penult[1]];
                points.push(third);
            } else if (startPosition === 'top' && endPosition === 'left') {
                let third = [penult[0], second[1]];
                points.push(third);
            } else if (startPosition === 'top' && endPosition === 'right') {
                let third = [penult[0], second[1]];
                points.push(third);
            } else if (startPosition === 'top' && endPosition === 'top') {
                addPenultXSecondY();
            } else if (startPosition === 'top' && endPosition === 'bottom') {
                addVerticalCenterLine();
            } else if (startPosition === 'left' && endPosition === 'left') {
                let third = [second[0], penult[1]];
                points.push(third);
            } else if (startPosition === 'left' && endPosition === 'right') {
                addHorizontalCenterLine();
            } else if (startPosition === 'left' && endPosition === 'top') {
                addHorizontalCenterLine();
            } else if (startPosition === 'left' && endPosition === 'bottom') {
                let third = [second[0], penult[1]];
                points.push(third);
            }
            break;
        }
    }
    points.push(penult);
    points.push(end);

    let lines = [];
    for (let i = 0; i < points.length; i++) {
        let from = points[i];
        let to = points[i + 1];
        lines.push([from[0], from[1], to[0], to[1]]);
        if (i === points.length - 2) {
            arrowTo(canId, from[0], from[1], to[0], to[1], lineWidth, strokeStyle);
            break;
        } else {
            lineTo(canId, from[0], from[1], to[0], to[1], lineWidth, strokeStyle);
        }
    }
    return lines;
}

function arrowTo(canId, x1, y1, x2, y2, lineWidth, strokeStyle) {
    lineTo(canId, x1, y1, x2, y2, lineWidth, strokeStyle);
    let sta = [x1, y1];
    let end = [x2, y2];
    let canvas = document.getElementById(canId);
    let ctx = canvas.getContext('2d');
    ctx.translate(end[0], end[1]);
    let ang = (end[0] - sta[0]) / (end[1] - sta[1]);
    ang = Math.atan(ang);
    if (end[1] - sta[1] >= 0) {
        ctx.rotate(-ang);
    } else {
        ctx.rotate(Math.PI - ang);
    }
    ctx.lineTo(-5, -10);
    ctx.lineTo(0, -5);
    ctx.lineTo(5, -10);
    ctx.lineTo(0, 0);
    ctx.fillStyle = strokeStyle;
    ctx.fill();
    ctx.restore();
    ctx.closePath();
}

function getDirection(x1, y1, x2, y2) {
    // Use approximatelyEquals to fix the problem of css position presicion
    if (x2 < x1 && approximatelyEquals(y2, y1)) {
        return 'l';
    }
    if (x2 > x1 && approximatelyEquals(y2, y1)) {
        return 'r';
    }
    if (approximatelyEquals(x2, x1) && y2 < y1) {
        return 'u';
    }
    if (approximatelyEquals(x2, x1) && y2 > y1) {
        return 'd';
    }
    if (x2 < x1 && y2 < y1) {
        return 'lu';
    }
    if (x2 > x1 && y2 < y1) {
        return 'ru';
    }
    if (x2 < x1 && y2 > y1) {
        return 'ld';
    }
    return 'rd';
}

function approximatelyEquals(n, m) {
    return Math.abs(m - n) <= 3;
}

function rect(canId, x, y, width, height, lineWidth, strokeStyle, dash) {
    lineTo(canId, x, y, x + width, y, lineWidth, strokeStyle, dash);
    lineTo(canId, x + width, y, x + width, y + height, lineWidth, strokeStyle, dash);
    lineTo(canId, x + width, y + height, x, y + height, lineWidth, strokeStyle, dash);
    lineTo(canId, x, y + height, x, y, lineWidth, strokeStyle, dash);
}

function fillRect(canId, x, y, width, height, color) {
    let canvas = document.getElementById(canId);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

export { arrowTo, lineTo, clearCanvas, getDirection, arrow2, rect, fillRect };
