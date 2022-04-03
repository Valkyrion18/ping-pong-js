// Seleccionar elementos de canvas
const canvas = document.getElementById("pong");

// getContext de canvas = métodos y propiedades para dibujar diferentes formas
const ctx = canvas.getContext('2d');

// Objeto bola
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// Paleta de usuario
const user = {
    x : 0, // lado izquierdo of canvas
    y : (canvas.height - 100)/2, // -100 la altura de la paleta
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// Paleta de la computadora
const com = {
    x : canvas.width - 10, // - ancho de la paleta
    y : (canvas.height - 100)/2, // -100 la altura de la paleta
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// RED (Malla)
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// Dibuja un rectángulo, se usará para dibujar las paletas
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Dibuja un círculo, se usará para dibujar la bola
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// Evento que escucha los moviminetos del mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// Cuando la computadora o el usuario anota, se resetea la bola
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// Dibuja la RED
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Mostrar texto
function drawText(text,x,y){
    ctx.fillStyle = "BLACK";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Colision detectada
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Actualizar función que realiza los cálculos
function update(){
    
    // Cambia el puntaje, si la bola va a la izquierda (ball.x<0), la computadora anota, sino (ball.x > canvas.width) el usuario anota

    if( ball.x - ball.radius < 0 ){
        com.score++;
        if (com.score === 3){
            alert('Computer is the WINNER!!!')
            com.score = 0
            user.score = 0
        }
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        if (user.score === 3){
            alert('You are the WINNER!!!')
            com.score = 0
            user.score = 0
        }
        resetBall();
    }
    
    // La bola tiene una velocidad
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    // simple AI
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // Cuanod la bola choca con las pardes superior e inferior, se invierte la velocidad y
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // Verificamos si se golpeo la paleta de la computadora o la del usuario
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // Si la bola golpeó la paleta
    if(collision(ball,player)){

        // Se verifica donde la bola golpea la paleta
        let collidePoint = (ball.y - (player.y + player.height/2));
        // Normalizar el valor de collidePoint (debe estar entre -1 y 1)
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // Cuando la bola golpea la parte superior de la paleta, toma un angulo de - 45°
        // Cuando la bola golpea el centro de la paleta, toma un angulo de 0°
        // Cuando la bola golpea la parte inferior de la paleta, toma un angulo de 45°
        // Math.PI/4 = 45°
        let angleRad = (Math.PI/4) * collidePoint;
        
        // Cambiar la dirección de velocidad de X y Y
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Aumenta la velocidad de la bola cada vez que una paleta la golpea.
        ball.speed += 0.1;
    }
}

// Función que hace que todo sea pintado en el elemento canvas
function render(){
    
    // Limpiar canvas
    drawRect(0, 0, canvas.width, canvas.height, "GREEN");
    
    // Mostrar el puntaje del usuario a la izquierda
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // Mostrar el puntaje de la computadora a la derecha
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // Dibujar la red
    drawNet();
    
    // Dibujar la paleta del usuario
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // Dibujar la paleta de la computadora
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // Dibujar la bola
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}
// Numero de muestras por segundo
let framePerSecond = 50;

// Se invoca la funcion 50 veces por segundo
let loop = setInterval(game,1000/framePerSecond);

