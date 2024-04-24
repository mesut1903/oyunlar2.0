//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context; 

//Oyuncu
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1 = {
    x : 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let player2 = {
    x : boardWidth - playerWidth - 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

//Top
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX : 1,
    velocityY : 2
}

let player1Score = 0;
let player2Score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");  //tahtaya çizim yapmak için kullanılır

  
//ilk oyuncu1'i çiz
    context.fillStyle="skyblue";
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Oyuncu1
    context.fillStyle = "skyblue";
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    // player1.y += player1.HızY;
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // Oyuncu2
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    // player2.y += player2.HızY;
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) { 
       // eğer top tuvalin üstüne veya altına değerse
        ball.velocityY *= -1; //reverse direction
    }

   // if (top.y <= 0) {
    // // eğer top tuvalin üstüne değerse
    // top.velocityY = 2; //aşağı in
    // }
    // else if (ball.y + ballHeight >= boardHeight) {
    // // eğer top tuvalin altına değerse
    // top.velocityY = -2; //yukarı git
    // }
   
//topu geri sektir
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) { //topun sol tarafı 1. oyuncunun sağ tarafına dokunur (sol raket)
            ball.velocityX *= -1;  // x yönünü çevir
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) { //topun sağ tarafı 2. oyuncunun sol tarafına dokunur (sağ raket)
            ball.velocityX *= -1; // x yönünü çevir
        }
    }

    //Oyun Bitişi
    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    //Skor
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 - 45, 45);

    //ortadan aşağıya noktalı çizgi çiziyoruz
    for (let i = 10; i < board.height; i += 25) { //i = y Konumundan başlayarak, her 25 pikselde bir kare çizin
        // (x konumu = tahta genişliğinin yarısı (orta) - 10), i = y konumu, genişlik = 5, yükseklik = 5
        context.fillRect(board.width / 2 - 10, i, 5, 5); 
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e) {
    //oyuncu1
    if (e.code == "KeyW") {
        player1.velocityY = -3;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 3;
    }

    //Oyuncu2
    if (e.code == "ArrowUp") {
        player2.velocityY = -3;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 3;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a'nın sol üst köşesi b'nin sağ üst köşesine ulaşmıyor
           a.x + a.width > b.x &&   //a'nın sağ üst köşesi b'nin sol üst köşesini geçer
           a.y < b.y + b.height &&  //a'nın sol üst köşesi b'nin sol alt köşesine ulaşmıyor
           a.y + a.height > b.y;    //a'nın sol alt köşesi b'nin sol üst köşesini geçer
}

function resetGame(direction) {
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}