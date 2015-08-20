var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 620;
var canvasElement = $("<canvas>")
	.attr('width', CANVAS_WIDTH)
	.attr('height', CANVAS_HEIGHT);

var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

var FPS = 30;
	
setInterval(function () {
update();
draw();
}, 1000/FPS);


function draw() {
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	player.draw();
	ground.draw();
	
	playerBullets.forEach(function(bullet) {
    bullet.draw();
  });
  platforms.forEach(function(platform){
  	platform.draw();
  });
}
						
var player = {
	color: "#00A",
	x: 220,
	y: 270,
	width: 32,
	height: 32,
	jumping: true,
	yVelocity: 2,
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
};

var scrollSpeed = 2;
var gravity = 1.5;

var ground = {
	color: "#000",
	x:0,
	y:520,
	width:CANVAS_WIDTH,
	height:20,
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
}

var platforms = [];

function AddPlatform(I) {
	I.width=50;
	I.height=15;
	I.yVelocity=scrollSpeed;
	I.color = "#000";
	I.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  };
  I.update = function() {
    I.y += I.yVelocity;
  };
  I.inBounds = function() {
    return I.y >= 0 && I.y+I.height <= CANVAS_HEIGHT;
  };
  return I;
}







//this is some wrapper the tutorial gave.  I don't really know what it does. 
$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
  });
  
  $(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
  });
});

//update

//lateral movement keybinds
function update() {
  if (keydown.left || keydown.a) {
    player.x -= 5;
  }

  if (keydown.right || keydown.d) {
    player.x += 5;
  }
// here are the movement limits to stop going off the canvas
  if (player.x <= 0){
  	player.x = 0;
  }
  if (player.x >= CANVAS_WIDTH - player.width){
  	player.x = CANVAS_WIDTH - player.width;
  }
   


//jump keybind
	if ((keydown.up || keydown.w) && !(player.jumping)){
		player.jumping = true;
		player.yVelocity = -20;
	}

	if (player.jumping){
		player.y += player.yVelocity;
		player.yVelocity += gravity;
	}

	if (!(player.jumping)){
		player.y += player.yVelocity;
		player.yVelocity += gravity;
	}


//other keybinds
  if (keydown.space) {
  console.log(platforms);
  }
	
//platform creation

	var platformSpawn = Math.random();
	if (platformSpawn > .98 && platforms.length <9)	{
	    platforms.push(AddPlatform({
   			x: Math.random()*CANVAS_WIDTH - 100,
  			y: Math.random()*CANVAS_HEIGHT/10,
			}));
	}

//platform movement
	
	platforms.forEach(function(platform) {
		platform.update();
		if (!(platform.inBounds())){
			platforms.splice(platform,1);
		}
  });

	//bullet movement
	playerBullets.forEach(function(bullet) {
    bullet.update();
  });

  playerBullets = playerBullets.filter(function(bullet) {
    return bullet.active;
  });
  
  
  
//handlecollisions
	handleCollisions();  

} //end of update

player.shoot = function() {
  var bulletPosition = this.midpoint();

  playerBullets.push(Bullet({
    speed: 5,
    x: bulletPosition.x,
    y: bulletPosition.y
  }));
};

player.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

//holds all the bullets
var playerBullets = [];

//constructor for the bullets
function Bullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 3;
  I.color = "#000";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };

  return I;
}

//collision detection

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function handleCollisions() {
	if (collides(player,ground)){
		player.jumping=false;
		player.y = ground.y - player.height;
		player.yVelocity = scrollSpeed;
	}
	platforms.forEach(function(platform){
		if (collides(platform,player)){
		player.jumping=false;
		player.y = platform.y - player.height;
		player.yVelocity = 0;	
		}
	})
}

//function standStill(){
//if  NOT player is at platform y and between platform x - 4/5 player width 
//			and platform x + platform width + 4/5 player width
//player.falling = true
//player.yVelocity = -2;



//}

