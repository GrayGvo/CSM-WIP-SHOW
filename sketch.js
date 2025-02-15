let topVideo, midVideo, bassVideo;
let topAngle = 0, midAngle = 0, bassAngle = 0;
let knobDragging = null;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // 使用 WEBGL 优化渲染
    
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
    requestAnimationFrame(() => {
        drawVideoWithOverlay(topVideo, 0, -videoHeight, videoWidth, videoHeight, topAngle);
        drawVideoWithOverlay(midVideo, 0, 0, videoWidth, videoHeight, midAngle);
        drawVideoWithOverlay(bassVideo, 0, videoHeight, videoWidth, videoHeight, bassAngle);
    });

    // 旋钮
    drawKnob(0, -videoHeight, topAngle, 'TOP');
    drawKnob(0, 0, midAngle, 'MID');
    drawKnob(0, videoHeight, bassAngle, 'BASS');
}

function drawVideoWithOverlay(video, x, y, w, h, angle) {
    push();
    translate(x, y);
    imageMode(CENTER);
    image(video, 0, 0, w, h);
    pop();
    
    let volume = map(angle, 0, TWO_PI, 0, 1);
    video.volume(volume);
    
    if (volume === 0) {
        video.pause();
        video.time(video.time()); // 停留在当前帧
        push();
        fill(0, 0, 0, 150);
        rectMode(CENTER);
        rect(x, y, w, h);
        pop();
    } else {
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

function touchStarted() {
    detectKnobTouch(touches[0].x, touches[0].y);
}

function mousePressed() {
    detectKnobTouch(mouseX, mouseY);
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

function touchMoved() {
    handleKnobDrag(touches[0].x, touches[0].y);
}

function mouseDragged() {
    handleKnobDrag(mouseX, mouseY);
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
