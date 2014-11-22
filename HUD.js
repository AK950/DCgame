HUD = function(game) {
	
	this.game = game;

	// Green HUD background
	this.sprite = game.add.sprite(0,0,'HUD');
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.immovable = true;
	this.sprite.width = 800;
	this.sprite.height = 50;

	// Player Icon and Health Bar
	var player_icon = game.add.sprite(15,0,'ada');
	this.health_bar = game.add.sprite(70, 20, 'health');

}

HUD.prototype = {

	collisions: function(player, enemy_1, enemy_2) {
		
		// Makes sure nothing goes through the hud

		this.game.physics.arcade.collide(player, this.sprite);
		this.game.physics.arcade.collide(enemy_1, this.sprite);
		this.game.physics.arcade.collide(enemy_2, this.sprite);
	},
	update: function(player) {

		// Updates displayed health of player

		var rec = new Phaser.Rectangle(0,0,(158/10)*player.health, 14)
		this.health_bar.crop(rec);
	}

}