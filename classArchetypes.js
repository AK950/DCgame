//function to define melee enemies
MeleeEnemy = function (index, game, x, y, player){

	//standard assignments
	this.game = game;
	this.player = player;
	this.health = 3;
	this.collide_with_player = false;


	//add the melee enemy as a sprite to the game
	this.melee = game.add.sprite(x, y, 'axe');

	//adds a name to the melee enemy
	this.melee.name = index.toString();

	//enable physics for the melee enemy, needed to enable body
	this.game.physics.enable(this.melee, Phaser.Physics.ARCADE);

	//add animations to the melee enemy
	this.melee.animations.add('beginSwing', Phaser.Animation.generateFrameNames('axe', 21, 29, '', 2));
    this.melee.animations.add('swing', Phaser.Animation.generateFrameNames('axe', 30, 32, '', 2));
    this.melee.animations.add('stuff', Phaser.Animation.generateFrameNames('axe', 00, 08, '', 2));
    
    //set the anchor and scale of the sprite
    this.melee.anchor.set(0.5,0.5);
    this.melee.scale.setTo(1,1);

    //enable collisions with the world
    this.melee.body.collideWorldBounds = true;
};

//add the phaser sprite prototypes
MeleeEnemy.prototype = Object.create(Phaser.Sprite.prototype);
// Formally defines the function mentioned above to be the constructor of the object below
MeleeEnemy.prototype.constructor = MeleeEnemy;

MeleeEnemy.prototype.update = function() {
	//enable collision between the melee enemies and player
	if (this.game.physics.arcade.collide(this.melee, this.player, this.causePlayerDamage, null, this))
	{
		this.collide_with_player = true;
		var tempx = this.player.x + (0.7)*(this.player.x - this.melee.x);
		var tempy = this.player.y + (0.7)*(this.player.y - this.melee.y);
		//if (tempx <= 800 && tempx => 0)
			this.player.x = tempx;
		//if (tempy <= 600 && tempy => 50)
			this.player.y = tempy;

 	}
	else
	{
		this.collide_with_player = false;
	}
	//within some distance, have the melee enemy chase the player
	if (this.game.physics.arcade.distanceBetween(this.melee, this.player) < 500)
	{
		this.game.physics.arcade.moveToObject(this.melee, this.player,100);
		this.melee.animations.play('swing',15,true);
	}
}

MeleeEnemy.prototype.damage = function() {
	this.health -= 1;
	if (this.health <= 0){
		this.melee.kill();
		return true;
	}
	return false;
}

MeleeEnemy.prototype.causePlayerDamage = function(melee, player) {

	if (!this.collide_with_player)
	{
		player.damage(1);
		//console.log(player.health);
		player.body.velocity.x = -1;
	}
}

//function for ranged enemy
RangedEnemy = function (index, game, x, y, player){
	//standard assignments
	this.game = game;
	this.player = player;

	//add sprite to the ranged enemy
	this.ranged = game.add.sprite(x, y, 'star');

	//adds a name to the ranged enemy
	this.ranged.name = index.toString();

	//enable physics for the ranged enemy
	this.game.physics.enable(this.ranged,Phaser.Physics.ARCADE);

	//set anchor and scale for ranged enemy
    this.ranged.anchor.set(0.5,0.5);
    this.ranged.scale.setTo(1,1);

    //add collision with the world for ranged enemy
    this.ranged.body.collideWorldBounds = true;
};

//add phaser sprite prototypes
RangedEnemy.prototype = Object.create(Phaser.Sprite.prototype);
RangedEnemy.prototype.constructor = RangedEnemy;

RangedEnemy.prototype.update = function() {
	//add collision with ranged enemy and player
	this.game.physics.arcade.collide(this.ranged,this.player);

	//temporary pseudo AI
	if (this.ranged.body.x < this.player.x)
	{
		this.ranged.body.velocity.x = 100;
	}
	else if (this.ranged.body.x > this.player.x)
	{
		this.ranged.body.velocity.x = -100;
	}
	else 
	{
		this.ranged.body.x = 0;
	}
}
