powerUps = function(game,player,explosions,x,y){
	this.game = game;
	this.player = player;
	this.explosions = explosions;

	this.item = this.game.add.sprite(x,y,'item');
	this.game.physics.enable(this.item, Phaser.Physics.ARCADE);

	this.item.body.immovable = true;
}

powerUps.prototype = {
	update: function(){
		this.game.physics.arcade.overlap(this.item, this.player, this.itemTouched, null, this);
	},
	itemTouched: function(){
		this.item.kill();
		this.player.kill();
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(this.player.x+3,this.player.y-30);
        explosionAnimation.play('explosion', 30, false, true);
	}
}