function lineTo(canId, x1, y1, x2, y2, lineWidth, strokeStyle, isStartPoint) {
    let sta = [x1, y1];
    let end = [x2, y2];
    let canvas = document.getElementById(canId);
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.translate(0, 0, 0);
    ctx.moveTo(sta[0], sta[1]);
    if (isStartPoint) {
        ctx.arc(sta[0], sta[1], 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.translate(0, 0, 0);
    ctx.moveTo(sta[0], sta[1]);
    ctx.translate(0, 0, 0);
    ctx.lineTo(end[0], end[1]);
    ctx.fill();
    ctx.stroke();
    ctx.save();
}

function clearCanvas(canId) {
    let c = document.getElementById(canId);
    let cxt = c.getContext("2d");
    cxt.clearRect(0, 0, 800, 600);
}


function arrowTo(canId, x1, y1, x2, y2, lineWidth, strokeStyle, isStartPoint) {
    this.lineTo(canId, x1, y1, x2, y2, lineWidth, strokeStyle, isStartPoint);
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

export {
    arrowTo, lineTo, clearCanvas
}