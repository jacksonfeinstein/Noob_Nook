const cvs = document.getElementById("pong"); // canvas
const ctx = cvs.getContext("2d"); // context

// Left Side
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// Right Side
const computer = {
    x : cvs.width - 10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// Ball is life
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}

// Just for aesthetics - set in middle beginning from bottom
// y = 0
// x = width/2 - 1
const net = {
    x : cvs.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"
}

// ctx with fill
function drawRect() {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawNet() {
    for (let i = 0; i <= cvs.height; i+=15) {
        drawRect(net.x, net.y, net.width, net.height, net.color);
    }
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
    
}

function drawText(text, x, y, color) {
    ctx.fillStyl = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

function render() {
    drawRect(0, 0, cvs.width, cvs.height, "BLACK");
    
    drawNet();
    
    drawText(user.score, cvs.width/4, 
			 cvs.height/5, "WHITE");
    
	drawText(computer.score, 3*cvs.width/4,
			 cvs.height/5, "WHITE");
    
    drawRect(user.x, user.y, user.width, 
			 user.height, user.color);
	
    drawRect(computer.x, computer.y, computer.width,
			 computer.height, computer.color);
    
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

cvs.addEventListener("mousemove", movePaddle);

function movePaddle(event){
    let rect = cvs.getBoundingClientRect();
    
    user.y = event.clientY - rect.top - user.height/2;
}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    return b.top < p.bottom
	&& b.bottom > p.top
	&& b.left < p.right
    && b.right > p.left;
}

function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    let computerLevel = 0.1;
    computer.y = (ball.y - (computer.y + computer.height/2)) * computerLevel;
    
    if (ball.y + ball.radius > cvs.height 
		|| ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    
    let player = (ball.x < cvs.width/2) ? user : computer;
    
    if (collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.height/2);
        
        collidePoint = collidePoint/(player.height/2);
        
        let angleRadian = collidePoint * Math.PI/4;
        
        let direction = (ball.x < cvs.width/2) ? 1 : -1;
        
        ball.velocityX = direction * ball.speed * Math.cos(angleRadian);
        ball.velocityY = ball.speed * Math.sin(angleRadian);
        ball.speed += 0.75;
    }
    
    if (ball.x + ball.radius > cvs.width) {
        user.score++;
        resetBall();
    }
    else if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    }
}

function game() {
    update();
    render();
}

setInterval(game, 1000/50);