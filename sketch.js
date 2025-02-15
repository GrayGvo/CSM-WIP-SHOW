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
    
    let videoHeight = windowHeight/3;
    let videoWidth = windowWidth;
    
    // 绘制视频和遮罩
    drawVideoWithOverlay(topVideo, windowWidth/2, videoHeight/2, videoWidth, videoHeight, topAngle);
    drawVideoWithOverlay(midVideo, windowWidth/2, videoHeight + videoHeight/2, videoWidth, videoHeight, midAngle);
    drawVideoWithOverlay(bassVideo, windowWidth/2, (videoHeight * 2) + videoHeight/2, videoWidth, videoHeight, bassAngle);
    
    // 绘制旋钮
    drawKnob(windowWidth/2, videoHeight/2, topAngle, 'TOP');
    drawKnob(windowWidth/2, videoHeight + videoHeight/2, midAngle, 'MID');
    drawKnob(windowWidth/2, (videoHeight * 2) + videoHeight/2, bassAngle, 'BASS');
}

function drawVideoWithOverlay(video, x, y, w, h, angle) {
    imageMode(CENTER);
    image(video, x, y, w, h);
    
    let volume = map(angle, 0, TWO_PI, 0, 1);
    video.volume(volume);
    
    if (volume === 0) {
        video.pause();
        video.time(video.time()); // 让视频停留在当前帧
        fill(0, 0, 0, 127);
        rectMode(CENTER);
        rect(x, y, w, h);
    } else {
        video.play();
    }
}

function drawKnob(x, y, angle, label) {
    let knobSize = windowHeight/9;
    
    push();
    translate(x, y);
    
    // 绘制旋钮
    fill(0,150);
    stroke(255,150);
    strokeWeight(2);
    ellipse(0, 0, knobSize);
    
    // 绘制指示线
    stroke(255);
    strokeWeight(4);
    let displayAngle = map(angle, 0, TWO_PI, 0, TWO_PI);
    line(0, 0, cos(displayAngle) * knobSize/2, sin(displayAngle) * knobSize/2);
    
    // 绘制标签和音量
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(knobSize/10);
    text(label, 0, -10);
    let volume = map(angle, 0, TWO_PI, 0, 100).toFixed(0);
    text(volume + '%', 0, -5+knobSize/4);
    
    pop();
}

function mousePressed() {
    let videoHeight = windowHeight/3;
    
    if (dist(mouseX, mouseY, windowWidth/2, videoHeight/2) < videoHeight/3) {
        knobDragging = 'top';
    } else if (dist(mouseX, mouseY, windowWidth/2, videoHeight + videoHeight/2) < videoHeight/3) {
        knobDragging = 'mid';
    } else if (dist(mouseX, mouseY, windowWidth/2, (videoHeight * 2) + videoHeight/2) < videoHeight/3) {
        knobDragging = 'bass';
    }
}

function mouseDragged() {
    if (knobDragging) {
        let videoHeight = windowHeight/3;
        let y;
        
        switch(knobDragging) {
            case 'top':
                y = videoHeight/2;
                topAngle = constrain(getAngle(windowWidth/2, y), 0, TWO_PI);
                break;
            case 'mid':
                y = videoHeight + videoHeight/2;
                midAngle = constrain(getAngle(windowWidth/2, y), 0, TWO_PI);
                break;
            case 'bass':
                y = (videoHeight * 2) + videoHeight/2;
                bassAngle = constrain(getAngle(windowWidth/2, y), 0, TWO_PI);
                break;
        }
    }
}

function mouseReleased() {
    knobDragging = null;
}

function getAngle(x, y) {
    let angle = atan2(mouseY - y, mouseX - x);
    if (angle < 0) {
        angle += TWO_PI;
    }
    return angle;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
