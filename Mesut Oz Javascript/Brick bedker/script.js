//board
let board; // Oyun tahtasını temsil eden değişken
let boardWidth = 500;// Tahtanın genişliği
let boardHeight = 500;// Tahtanın yüksekliği
let context; // Tahtayı çizmek için kullanılacak 2D bağlamı

//players
let playerWidth = 80; // Oyuncunun genişliği
let playerHeight = 10;// Oyuncunun yüksekliği
let playerVelocityX = 10; //her seferinde 10 piksel hareket ettir

let player = {
    x : boardWidth/2 - playerWidth/2, // Oyuncunun x konumu
    y : boardHeight - playerHeight - 5, // Oyuncunun y konumu
    width: playerWidth,// Oyuncunun genişliği
    height: playerHeight,  // Oyuncunun yüksekliği
    velocityX : playerVelocityX // Oyuncunun x ekseni boyunca hareket hızı
}

//ball
// Toplam genişlik ve yükseklik

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3; //15 for testing, 3 normal
let ballVelocityY = 2; //10 for testing, 2 normal

let ball = {
    x : boardWidth/2,// Toplam genişlik ve yükseklik
    y : boardHeight/2, // y koordinatı
    width: ballWidth, // genişlik
    height: ballHeight,// yükseklik
    velocityX : ballVelocityX,// x ekseninde hız
    velocityY : ballVelocityY // y ekseninde hız
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;

// Blok sütun ve satır sayısı
let blockColumns = 8; 
let blockRows = 3; //oyun ilerledikçe daha fazlasını ekleyin
let blockMaxRows = 10; //satır sayısını sınırla
let blockCount = 0; //Blok sayısı


//blok köşelerinden başlıyoruz sol üstte
let blockX = 15;
let blockY = 45;
//Skor ve Oyun durumu
let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");  //tahtaya çizim yapmak için kullanılır

   //ilk oyuncuyu çiz
    context.fillStyle="skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

   //bloklar oluştur
    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    //çizmeyi durdur, // Oyun bitti mi kontrol et
    if (gameOver) {
        return;
    }
      // Tahtayı temizle
    context.clearRect(0, 0, board.width, board.height);

    // Oyuncu
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    // Top
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

  //topu oyuncunun raketinden sektir
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   // y yönünü yukarı veya aşağı çevir
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   // x yönünü sola veya sağa çevir
    }

    if (ball.y <= 0) { 
        // eğer top tuvalin üstüne değerse
        ball.velocityY *= -1;  //ters yön
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
       // top tuvalin soluna veya sağına değerse
        ball.velocityX *= -1; //ters yön
    }
    else if (ball.y + ball.height >= boardHeight) {
        // eğer top tuvalin altına değerse
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;  //blok bozuldu
                ball.velocityY *= -1;  // y yönünü yukarı veya aşağı çevir
                score += 100;
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true; //blok bozuldu
                ball.velocityX *= -1;  // x yönünü sola veya sağa çevir
                score += 100;      // Skoru artır
                blockCount -= 1;  // Blok sayısını azalt
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //Sonraki Level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; //bonus Puan :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //skor
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();// Oyunu sıfırla
            console.log("RESET");
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        // player.x -= Oyncu.HızıX;
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
        // player.x += Oyuncu HızıX;    
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a'nın sol üst köşesi b'nin sağ üst köşesine ulaşmıyor
           a.x + a.width > b.x &&   //a'nın sağ üst köşesi b'nin sol üst köşesini geçer
           a.y < b.y + b.height &&  //a'nın sol üst köşesi b'nin sol alt köşesine ulaşmıyor
           a.y + a.height > b.y;    //a'nın sol alt köşesi b'nin sol üst köşesini geçer
}

function topCollision(ball, block) { //a b'nin üstünde (top bloğun üstünde)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) { //a b'nin üstünde (top bloğun altında)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) { //a b'nin solunda (top bloğun solunda)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) { //a b'nin sağında (top bloğun sağında)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; //blockArray'i temizle
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 boşluk, 10 piksel aralıklı sütunlar
                y : blockY + r*blockHeight + r*10, //r*10 boşluk 10 piksel aralıklı satırlar
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false; // Oyun devam ediyor
    // Oyuncu özelliklerini başlangıç konumuna sıfırla
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    // Blok array'i sıfırla
    blockArray = [];
    blockRows = 3;
    score = 0;
    // Oyunu sıfırla ve blokları oluştur
    createBlocks();
}