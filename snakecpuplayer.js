var foodTop;
var foodLeft;
var food;
var gameSpeed = 200;
var direction = '';
var oldScore = 0;
var timeCounter = 0;
var timer;
var mover;
var cloneSnake;
var user;
var uniqueName = [];
var speed = 0;
var score = 0;
var oldDirection;
var playerScores;
var topScores = document.querySelector('.top-scores');
var scoreTable = document.querySelector('.scoretable');
var posObj = {};
var newSnakeElement;
var stater = '';
document.querySelector('.best-score').innerHTML = 'BEST SCORE: ' + (localStorage.getItem('best score') || 0);

function foodPosition() {
    foodTop = (Math.floor(Math.random() * 10) * 30) * 2;
    foodLeft = (Math.floor(Math.random() * 10) * 30) * 3;
    food.style.top = foodTop + 'px';
    food.style.left = foodLeft + 'px';
    localStorage.setItem('foodLeft', food.style.left);
    localStorage.setItem('foodTop', food.style.top);
}

var start = {
    foodMaker: function () {
        food = document.createElement('div');
        food.className = 'foodshape';
        document.querySelector('.container').appendChild(food);
    },
    snakeMaker: function () {
        var firstSnake = document.createElement('div');
        firstSnake.className = 'snake';
        document.querySelector('.container').appendChild(firstSnake);
        document.querySelectorAll('.snake')[0].style.left = '450px';
        document.querySelectorAll('.snake')[0].style.top = '300px';
    }
}

start.foodMaker();

if (performance.navigation.type === 1) { //doğru bi yaklaşım mı bunu if'e alarak sayfanın refresh olmasını kontrol etmek, başka nasıl derli toplu yazablirim bunları?
    //gameoverdayken refreshe basılınca işin rengi değişiyor, başlangıç ekranını getirmeliyim.
    console.log("This page is reloaded");
    if (!!localStorage.getItem('snakePosition')) { // null değilse yerine nasıl bir fallback konulabilirdi?
        Object.values(JSON.parse(localStorage.getItem('snakePosition'))).forEach(function (value, index) {

            newSnakeElement = document.createElement('div');
            newSnakeElement.className = 'snake';
            document.querySelector('.container').appendChild(newSnakeElement);
            newSnakeElement.style.left = JSON.parse(localStorage.getItem('snakePosition'))[index]['left'];
            newSnakeElement.style.top = JSON.parse(localStorage.getItem('snakePosition'))[index]['top'];
        })
    }
    if ('foodTop' === '') {
        foodPosition();
    }
    if (localStorage.getItem('currentScore') !== null) {
        score = localStorage.getItem('currentScore');
        scoreTable.innerHTML = 'SCORE: ' + score;
    }
    gameSpeed = (localStorage.getItem('gameSpeed') || 200);
    food.style.left = localStorage.getItem('foodLeft');
    food.style.top = localStorage.getItem('foodTop');
    foodLeft = food.style.left.replace('px', '');
    foodTop = food.style.top.replace('px', '');
    document.querySelector('.game-start-container').style.display = 'none';
    user = localStorage.getItem('username');
    keyTap();
} else {
    start.snakeMaker();
    foodPosition();
    window.localStorage.clear();
    console.info("This page is not reloaded");
}

var snakeLeft = Number(document.querySelectorAll('.snake')[0].style.left.replace('px', ''));
var snakeTop = Number(document.querySelectorAll('.snake')[0].style.top.replace('px', ''));
var snakeWidth = Number(getComputedStyle(document.querySelector('.snake')).width.replace('px', ''));
var snakeHeight = Number(getComputedStyle(document.querySelector('.snake')).height.replace('px', ''));
var foodWidth = Number(getComputedStyle(document.querySelector('.foodshape')).width.replace('px', ''));
var foodHeight = Number(getComputedStyle(document.querySelector('.foodshape')).height.replace('px', ''));
var containerWidth = Number(getComputedStyle(document.querySelector('.container')).width.replace('px', ''));
var containerHeight = Number(getComputedStyle(document.querySelector('.container')).height.replace('px', ''));



function callCPUPlayer() {
    defineAllSnakePos();

    var cpuSnakeLeft = Number(document.querySelectorAll('.snake')[0].style.left.replace('px', ''));
    var cpuSnakeTop = Number(document.querySelectorAll('.snake')[0].style.top.replace('px', ''));

    function checkVerPos() {

            document.querySelectorAll('.snake').forEach(function (value, index) {
                if (posObj[index]['top'] === cpuSnakeTop - 30 || cpuSnakeTop === 0) {
                    if (oldDirection !== 'up') {
                        direction = 'down';
                    } else if (posObj[index]['left'] === cpuSnakeLeft - 30) { // oldirection up sa oluyor otomatik zaten
                        direction = 'right';
                    } else {
                        direction = 'left';

                    }
                }
            })
    }

    function checkHorPos() {

        document.querySelectorAll('.snake').forEach(function (value, index) {
            if (posObj[index]['left'] === cpuSnakeLeft - 30 || cpuSnakeLeft === 0) {
                if (oldDirection !== 'left') {
                    direction = 'right';
                } else if (posObj[index]['top'] === cpuSnakeTop - 30) { // oldirection up sa oluyor otomatik zaten
                    direction = 'down';
                } else {
                    direction = 'up';

                }
            }
        })
    }

    if (cpuSnakeLeft > foodLeft && oldDirection !== 'right') { // and koşulu ile değelendirmemin sebebi cpuSnakeLeft > foodLeft

        document.querySelectorAll('.snake').forEach(function (value, index) {
            if (Number(posObj[index]['left'].replace('px', '')) === Number(document.querySelectorAll('.snake')[0].style.left.replace('px', '')) - 30) {

                checkHorPos();
            } else {
                direction = 'left';
            }
        })
    } else if (cpuSnakeLeft < foodLeft && oldDirection !== 'left') {
        document.querySelectorAll('.snake').forEach(function (value, index) {
            if (Number(posObj[index]['left'].replace('px', '')) === Number(document.querySelectorAll('.snake')[0].style.left.replace('px', '')) + 30) {
                checkVerPos();
            } else {
                direction = 'right';
            }
        })
    } else if (cpuSnakeTop > foodTop && oldDirection !== 'down') {
        document.querySelectorAll('.snake').forEach(function (value, index) {
            if (Number(posObj[index]['top'].replace('px', '')) === Number(document.querySelectorAll('.snake')[0].style.top.replace('px', '')) - 30) {
                checkHorPos();
            } else {
                direction = 'up';
            }
        })
    } else if (cpuSnakeTop < foodTop && oldDirection !== 'up') {

        document.querySelectorAll('.snake').forEach(function (value, index) {
            if (Number(posObj[index]['top'].replace('px', '')) === Number(document.querySelectorAll('.snake')[0].style.top.replace('px', '')) + 30) {
                checkHorPos();
            } else {
                direction = 'down';
            }
        })
    } else if ((cpuSnakeLeft > foodLeft && oldDirection === 'right') || (cpuSnakeLeft < foodLeft && oldDirection === 'left')) {
        checkVerPos()
    } else if ((cpuSnakeTop > foodTop && oldDirection === 'down') || (cpuSnakeTop < foodTop && oldDirection === 'up')) {
        checkHorPos()
    }
}

function timerInterval() {

    score++;
    localStorage.setItem('currentScore', score);
    scoreTable.innerHTML = 'SCORE: ' + score;
}

function gameOver() {
    window.localStorage.removeItem('snakePosition'); //GİTMİYOR çünkü yeniden set ediyorum :( düzelmeli)
    window.localStorage.removeItem('gameSpeed');
    window.localStorage.removeItem('foodLeft');
    window.localStorage.removeItem('foodTop');
    window.localStorage.removeItem('currentScore'); //best score'u silmek istemediğimden tek tek kaldırdım.
    clearInterval(mover);
    clearInterval(timer);
    gameSpeed = 200;
    direction = '';
    oldDirection = '';
    document.querySelector('.warning').style.display = 'block';
    topScores.style.display = 'block';

    var snd = new Audio("bounce.wav");
    snd.play();

    if ((localStorage.getItem('best score') || 0) <= score) {
        localStorage.setItem('best score', score);
        document.querySelector('.best-score').innerHTML = 'BEST SCORE: ' + localStorage.getItem('best score'); //sadece bunla olmadı.:/
    }

    oldScore = score; //kullanmamaşım kaldırabilirim.
    var userName = {
        score: score,
        player: user,
    };

    var unique = uniqueName.some(function (item) {
        return item.player == userName.player;
    })

    var isSamewithOLdPlayerName = uniqueName.filter(function (item) { //sadece function return dönerek yapmaya çalış for'la(good partstan)
        return item.player == userName.player;
    })

    if (!unique) {
        uniqueName.push((userName));
    } else {
        if (isSamewithOLdPlayerName[isSamewithOLdPlayerName.length - 1].score < userName.score) { //ilk condition: yani bu arraye bişey attıysak
            uniqueName.splice(uniqueName.indexOf(isSamewithOLdPlayerName[0]), 1);
            uniqueName.push(userName);
            console.log('mevcut isim' + JSON.stringify(isSamewithOLdPlayerName));
        }
    }

    uniqueName.sort((a, b) => b.score - a.score);
    uniqueName.forEach(function (item, key) {
        playerScores = key + 1 + '. ' + item.player + ': ' + item.score;
        topScores.innerHTML += '<br />' + playerScores;
    })

    $('#game-renewer').off('click.insGameRenewer').on('click.insGameRenewer', function () { //iki defa tetikleniyo bu event neden?
        $('.snake').remove();
        var newSnake = document.createElement('div');
        newSnake.className = 'snake';
        document.querySelector('.container').appendChild(newSnake);
        document.querySelectorAll('.snake')[0].style.left = '450px'; // bunlar snakeLeft değişkeni doğru veri alsın diye setIntervaldaki.
        document.querySelectorAll('.snake')[0].style.top = '300px';
        document.querySelector('.warning').style.display = 'none';
        foodPosition();
        topScores.style.display = 'none';
        document.querySelector('.game-start-container').style.display = 'block';
        score = 0;
        scoreTable.innerHTML = 'SCORE: ' + score;
        topScores.innerHTML = 'RANKING: ';
        speed = 0;
    })
}

function keyTap() {
    document.addEventListener('keydown', function (parameter) {
        if (parameter.keyCode === 220) { //Ç harfi
            stater = 'cpuPlayer';
        } else if (parameter.keyCode === 191) { //Ö harfi
            stater = 'manuel';
        }
        console.log(parameter.keyCode);
        if (parameter.keyCode == 38 || parameter.keyCode == 87) {
            direction = 'up'
        } else if (parameter.keyCode == 40 || parameter.keyCode == 83) {
            direction = 'down'
        } else if (parameter.keyCode == 37 || parameter.keyCode == 65) {
            direction = 'left'
        } else if (parameter.keyCode == 39 || parameter.keyCode == 68) {
            direction = 'right'
        }

        if (timeCounter === 0) {
            timer = setInterval(timerInterval, 10000);
            mover = setInterval(setIntervalSnake, gameSpeed);
            timeCounter++;
        }
    })
}

document.querySelector('#start-game').addEventListener('click', function () {

    timeCounter = 0;
    this.parentElement.style.display = 'none';
    user = document.getElementsByClassName('user-name')[0].value;
    if (user === '') {
        user = 'anonymous';
    }
    localStorage.setItem('username', user);
    document.getElementsByClassName('user-name')[0].value = '';

    foodPosition();
    keyTap()
})

function foodAndCloneMaker() {
    score++;
    localStorage.setItem('currentScore', score);
    scoreTable.innerHTML = 'SCORE: ' + score;
    speed++;
    if (Number.isInteger(speed / 4)) {
        gameSpeed = gameSpeed / 1.5;
        localStorage.setItem('gameSpeed', gameSpeed);
        clearInterval(mover);
        mover = setInterval(setIntervalSnake, gameSpeed);
    }

    scoreTable.innerHTML = 'SCORE: ' + score;
    foodPosition();
    cloneSnake = document.querySelectorAll('.snake')[document.querySelectorAll('.snake').length - 1].cloneNode([true]);
    cloneSnake.className = 'snake clone';
    var snake = document.querySelectorAll('.snake');

    if (snake.length > 1) {
        if (snake[snake.length - 1].style.top === snake[snake.length - 2].style.top) {
            if (snake[snake.length - 1].style.left > snake[snake.length - 2].style.left) {
                cloneSnake.style.left = Number(snake[snake.length - 1].style.left.replace('px', '')) + 30 + 'px';
            } else {
                cloneSnake.style.left = Number(snake[snake.length - 1].style.left.replace('px', '')) - 30 + 'px';
            }
        } else if (snake[snake.length - 1].style.left === snake[snake.length - 2].style.left) {
            if (snake[snake.length - 1].style.top > snake[snake.length - 2].style.top) {
                cloneSnake.style.top = Number(snake[snake.length - 1].style.top.replace('px', '')) + 30 + 'px';
            } else {
                cloneSnake.style.top = Number(snake[snake.length - 1].style.top.replace('px', '')) - 30 + 'px';
            }
        }
    } else {
        switch (direction) {
            case 'up':
                cloneSnake.style.top = Number(snake[snake.length - 1].style.top.replace('px', '')) + 30 + 'px';
                break;
            case 'down':
                cloneSnake.style.top = Number(snake[snake.length - 1].style.top.replace('px', '')) - 30 + 'px';
                break;
            case 'left':
                cloneSnake.style.left = Number(snake[snake.length - 1].style.left.replace('px', '')) + 30 + 'px';
                break;
            case 'right':
                cloneSnake.style.left = Number(snake[snake.length - 1].style.left.replace('px', '')) - 30 + 'px';
                break;
        }

    }
    snake[snake.length - 1].after(cloneSnake);
}

function insertLeft() {
    if (document.querySelectorAll('.snake').length > 1) {
        document.querySelectorAll('.snake')[document.querySelectorAll('.snake').length - 1].style.left = document.querySelectorAll('.snake')[0].style.left;
        $('.snake:last').insertBefore('.snake:first');
    }
}

function insertTop() {
    if (document.querySelectorAll('.snake').length > 1) {
        document.querySelectorAll('.snake')[document.querySelectorAll('.snake').length - 1].style.top = document.querySelectorAll('.snake')[0].style.top;
        $('.snake:last').insertBefore('.snake:first');
    }
}

function defineSnakePos() {

    snakeTop = Number(document.querySelectorAll('.snake')[0].style.top.replace('px', ''));
    snakeLeft = Number(document.querySelectorAll('.snake')[0].style.left.replace('px', ''))
}

function defineAllSnakePos() {
    posObj = {};

    document.querySelectorAll('.snake').forEach(function (value, index) {
        posObj[index] = {
            left: value.style.left,
            top: value.style.top,
        };
        localStorage.setItem('snakePosition', JSON.stringify(posObj));
        if (index !== 0 && posObj[index]['left'] === document.querySelectorAll('.snake')[0].style.left && posObj[index]['top'] === document.querySelectorAll('.snake')[0].style.top) {
            gameOver(); // zaten head'in top'ını leftini kontrol ettiğimden index 0 ı eledim.
        }
    })
}

function setIntervalSnake() {

    if (stater === 'cpuPlayer') {
        callCPUPlayer();
    }

    defineSnakePos();
    if ((direction === 'up' && oldDirection !== 'down') || (direction === 'down' && oldDirection === 'up')) {
        insertLeft()
        document.querySelectorAll('.snake')[0].style.top = snakeTop - 30 + 'px';
        oldDirection = 'up';

    } else if ((direction === 'down' && oldDirection !== 'up') || (direction === 'up' && oldDirection === 'down')) {
        insertLeft()
        document.querySelectorAll('.snake')[0].style.top = snakeTop + 30 + 'px';
        oldDirection = 'down';


    } else if ((direction === 'left' && oldDirection !== 'right') || (direction === 'right' && oldDirection === 'left')) {
        insertTop();
        document.querySelectorAll('.snake')[0].style.left = snakeLeft - 30 + 'px';
        oldDirection = 'left';

    } else if ((direction === 'right' && oldDirection !== 'left') || (direction === 'left' && oldDirection === 'right')) {
        insertTop();
        document.querySelectorAll('.snake')[0].style.left = snakeLeft + 30 + 'px';
        oldDirection = 'right';

    }
    defineSnakePos();

    if (snakeLeft > 900 - snakeWidth || snakeLeft < 0 || snakeTop > 600 - snakeHeight || snakeTop < 0) {
        gameOver();
    }
    defineAllSnakePos();
    if (Number(document.querySelectorAll('.snake')[0].style.top.replace('px', '')) === Number(foodTop) && Number(document.querySelectorAll('.snake')[0].style.left.replace('px', '')) === Number(foodLeft)) {

        foodAndCloneMaker();
    }
}