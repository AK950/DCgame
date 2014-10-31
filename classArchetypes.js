MeleeEnemy = function (game, x, y, player){

	this.game = game;

	this.player = player;
	this.melee = game.add.sprite(x, y, 'axe');

	this.game.physics.enable(this.melee, Phaser.Physics.ARCADE);

	this.melee.animations.add('beginSwing', Phaser.Animation.generateFrameNames('axe', 21, 29, '', 2));
    this.melee.animations.add('swing', Phaser.Animation.generateFrameNames('axe', 30, 32, '', 2));
    this.melee.animations.add('stuff', Phaser.Animation.generateFrameNames('axe', 00, 08, '', 2));
    this.melee.anchor.set(0.5,0.5);
    this.melee.scale.setTo(1,1);

    this.melee.body.collideWorldBounds = true;
};

MeleeEnemy.prototype = Object.create(Phaser.Sprite.prototype);
MeleeEnemy.prototype.constructor = MeleeEnemy;

MeleeEnemy.prototype.update = function() {

	this.game.physics.arcade.collide(this.melee,this.player);

	if (this.game.physics.arcade.distanceBetween(this.melee, this.player) < 500)
	{
		this.game.physics.arcade.moveToObject(this.melee, this.player,100);
		//this.melee.animations.play('swing',15,true);
	}
}

RangedEnemy = function (game, x, y, player){

	this.game = game;

	this.player = player;
	this.ranged = game.add.sprite(x, y, 'star');

	this.game.physics.enable(this.ranged,Phaser.Physics.ARCADE);

    this.ranged.anchor.set(0.5,0.5);
    this.ranged.scale.setTo(1,1);
    this.ranged.body.collideWorldBounds = true;
};

RangedEnemy.prototype = Object.create(Phaser.Sprite.prototype);
RangedEnemy.prototype.constructor = RangedEnemy;

RangedEnemy.prototype.update = function() {

	this.game.physics.arcade.collide(this.ranged,this.player);

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
