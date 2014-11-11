BasicGame.HUD = function(game) {

	this.game = game;
	this.thumbnails = [];
	this.healthhearts = [];
}  

//BasicGame.HUD.prototype.constructor = BasicGame.HUD 

BasicGame.HUD.prototype = {

	create: function() {

		this.hudsprite = this.game.add.sprite(0,0,'HUD');
        this.game.physics.enable(this.hudsprite, Phaser.Physics.ARCADE);
        this.hudsprite.width = 800;
        this.hudsprite.height = 50;
        this.hudsprite.body.immovable = true;

		this.healthhearts[0] = this.game.add.sprite(50,20,'hearts');
        this.thumbnails[0] = this.game.add.sprite(0, 0, 'ada');

        this.healthhearts[1] = this.game.add.sprite(620, 20, 'hearts');
        this.thumbnails[1] = this.game.add.sprite(560, 0, 'axe');

        this.thumbnails[2] = this.game.add.sprite(320,0,'axe');
        this.healthhearts[2] = this.game.add.sprite(380,20,'hearts');
        
	}, 
	update: function(player, melee0, melee1) {

		 this.game.physics.arcade.collide(this.hudsprite, player);
         this.game.physics.arcade.collide(this.hudsprite, melee0.melee);
         this.game.physics.arcade.collide(this.hudsprite, melee1.melee);

		if (!player.alive)
			this.healthhearts[0].kill();
		if(!melee0.melee.alive)
			this.healthhearts[1].kill();
		if(!melee1.melee.alive)
			this.healthhearts[2].kill();
	}


}
