const rulesBtn = document.getElementById("rules-btn")
const closeBtn = document.getElementById("close-btn")
const rules = document.getElementById("rules")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let score = 0

const brickRowCount = 9;
const brickColCount = 5;

// create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
}

// create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 40,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
}

// create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

const bricks = [];
for (let i=0; i<brickRowCount; i++) {
  bricks[i] = [];
  for(let j=0; j<brickColCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = {x,y, ...brickInfo}
  }
}

// draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#364c88";
  ctx.fill();
  ctx.closePath();
}

// draw paddle on canvas
function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#364c88";
  ctx.fill();
  ctx.closePath()
}

// draw bricks
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick  => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#FBA01D" : "transparent";
      ctx.fill();
      ctx.closePath()
    })
  })
}

function draw() {

  // clear canvas first
  ctx.clearRect(0,0,canvas.width, canvas.height)

  drawBall()
  drawPaddle()
  drawScore()
  drawBricks()
}

function movePaddle() {
  paddle.x += paddle.dx;

  // wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w
  }
  if (paddle.x < 0) {
    paddle.x = 0
  }
}

function moveBall() {
  // move the ball up and over
  ball.x += ball.dx
  ball.y += ball.dy

  // wall collision (left/right)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1 // this will make it bounce back (dx negative to what the speed is right now)
  }

  // wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size <0) {
    ball.dy *= -1
  }

  // paddle collision
  if (
    ball.x + ball.size < paddle.x + paddle.w && // right side
    ball.x - ball.size > paddle.x && // left side
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed
  }

  // bricks collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y - ball.size < brick.y + brick.h &&
          ball.y + ball.size > brick.y
        ) {
          ball.dy *= -1;
          brick.visible = false
          increaseScore()
        }
      }
    })
  })

  // hit bottom wall -> lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks()
    score = 0;
  }
}

function increaseScore() {
  score++;

  if(score % (brickRowCount*brickRowCount) === 0) {
    showAllBricks()
  }
}

function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {brick.visible = true})
  })
}

// update canvas
function update() {

  // move paddle and ball
  movePaddle();
  moveBall()

  // draw everything
  draw()

  /// request Animation frame
  requestAnimationFrame(update)
}

update()

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed
  }
}

function keyUp(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = 0
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function drawScore() {
  ctx.font = "18px Roboto";
  ctx.fillStyle = "#fff"
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// show and close rules
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
})

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
})

// 1. create the canvas context
