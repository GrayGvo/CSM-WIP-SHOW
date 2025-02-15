let topVideo, midVideo, bassVideo;
let topAngle = 0, midAngle = 0, bassAngle = 0;
let knobDragging = null;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Load videos
    topVideo = createVideo('video/TOP.mov');
    midVideo = createVideo('video/MID.mov');
    bassVideo = createVideo('video/BASS.mov');
    
    // Hide default HTML5 video controls
    topVideo.hide();
    midVideo.hide();
    bassVideo.hide();
    
    // 设置视频为循环模式但音量为0
    topVideo.loop();
    midVideo.loop();
    bassVideo.loop();
    
    topVideo.volume(0);
    midVideo.volume(0);
    bassVideo.volume(0);
}

function draw() {
    background(0);
    
    let videoHeight = windowHeight / 3;
    let videoWidth = windowWidth;
    
    // 渲染视频
    drawVideoWithOverlay(topVideo, windowWidth / 2, videoHeight / 2, videoWidth, videoHeight, topAngle);
    drawVideoWithOverlay(midVideo, windowWidth / 2, videoHeight + videoHeight / 2, videoWidth, videoHeight, midAngle);
    drawVideoWithOverlay(bassVideo, windowWidth / 2, (videoHeight * 2) + videoHeight / 2, videoWidth, videoHeight, bassAngle);
    
    // 旋钮
    drawKnob(windowWidth / 2, videoHeight / 2, topAngle, 'TOP');
    drawKnob(windowWidth / 2, videoHeight + videoHeight / 2, midAngle, 'MID');
    drawKnob(windowWidth / 2, (videoHeight * 2) + videoHeight / 2, bassAngle, 'BASS');
}

function drawVideoWithOverlay(video, x, y, w, h, angle) {
    imageMode(CENTER);
    image(video, x, y, w, h);
    
    let volume = map(angle, 0, TWO_PI, 0, 1);
    video.volume(volume);
    
    if (volume === 0) {
        video.pause();
        setTimeout(() => video.time(video.time()), 50); // 确保停留在当前帧
        fill(0, 0, 0, 127);
        rectMode(CENTER);
        rect(x, y, w, h);
    } else if (!video.elt.paused) {
        video.play();
    }
}

function drawKnob(x, y, angle, label) {
    let knobSize = windowHeight / 9;

    push();
    translate(x, y);
    
    // 旋钮
    fill(0, 150);
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, knobSize);
    
    // 指示线
    stroke(255);
    strokeWeight(4);
    let displayAngle = map(angle, 0, TWO_PI, 0, TWO_PI);
    line(0, 0, cos(displayAngle) * knobSize / 2, sin(displayAngle) * knobSize / 2);
    
    // 文本
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(knobSize / 10);
    text(label, 0, -10);
    let volume = map(angle, 0, TWO_PI, 0, 100).toFixed(0);
    text(volume + '%', 0, -5 + knobSize / 4);
    
    pop();
}

// **支持鼠标 & 触摸**
function mousePressed() {
    detectKnobTouch(mouseX, mouseY);
}
function touchStarted() {
    detectKnobTouch(touches[0].x, touches[0].y);
}

function detectKnobTouch(x, y) {
    let videoHeight = windowHeight / 3;
    
    if (dist(x, y, windowWidth / 2, videoHeight / 2) < videoHeight / 3) {
        knobDragging = 'top';
    } else if (dist(x, y, windowWidth / 2, videoHeight + videoHeight / 2) < videoHeight / 3) {
        knobDragging = 'mid';
    } else if (dist(x, y, windowWidth / 2, (videoHeight * 2) + videoHeight / 2) < videoHeight / 3) {
        knobDragging = 'bass';
    }
}

// **支持鼠标 & 触摸拖动**
function mouseDragged() {
    handleKnobDrag(mouseX, mouseY);
}
function touchMoved() {
    handleKnobDrag(touches[0].x, touches[0].y);
}

function handleKnobDrag(x, y) {
    if (knobDragging) {
        let videoHeight = windowHeight / 3;
        let posY;
        
        switch (knobDragging) {
            case 'top':
                posY = videoHeight / 2;
                topAngle = constrain(getAngle(windowWidth / 2, posY), 0, TWO_PI);
                break;
            case 'mid':
                posY = videoHeight + videoHeight / 2;
                midAngle = constrain(getAngle(windowWidth / 2, posY), 0, TWO_PI);
                break;
            case 'bass':
                posY = (videoHeight * 2) + videoHeight / 2;
                bassAngle = constrain(getAngle(windowWidth / 2, posY), 0, TWO_PI);
                break;
        }
    }
}

function mouseReleased() {
    knobDragging = null;
}
function touchEnded() {
    knobDragging = null;
}

function getAngle(x, y) {
    let angle = atan2(y - windowHeight / 2, x - windowWidth / 2);
    return (angle + TWO_PI) % TWO_PI; // 保证角度在 0 ~ TWO_PI 之间
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
