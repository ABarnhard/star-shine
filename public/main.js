
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload(){
  'use strict';
  game.load.image('sky', '/img/sky.png');
  game.load.image('ground', '/img/platform.png');
  game.load.image('star', '/img/star.png');
  game.load.spritesheet('dude', '/img/dude.png', 32, 48);
}

var platforms,
    player,
    cursors,
    stars,
    score = 0,
    scoreText;

function create(){
  'use strict';
  // game.add.sprite(0, 0, 'star');
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  platforms = game.add.group();
  platforms.enableBody = true;

  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  player = game.add.sprite(32, game.world.height - 150, 'dude');
  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  cursors = game.input.keyboard.createCursorKeys();

  stars = game.add.group();
  stars.enableBody = true;
  for(var i = 0; i < 1000; i++){
    var star = stars.create(i * 1, 0, 'star');
    star.body.gravity.y = 6;
    star.body.bounce.y = 0.7 + Math.random() * 0.9;
  }

}

function update(){
  'use strict';
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  player.body.velocity.x = 0;
  if(cursors.left.isDown){
    player.body.velocity.x = -150;
    player.animations.play('left');
  }else if(cursors.right.isDown){
    player.body.velocity.x = 150;
    player.animations.play('right');
  }else{
    player.animations.stop();
    player.frame = 4;
  }

  if(cursors.up.isDown && player.body.touching.down){
    player.body.velocity.y = -350;
  }

}

function collectStar(player, star){
  star.kill();
  score += 1000000000;
  scoreText.text = 'Score: ' + score;
}
