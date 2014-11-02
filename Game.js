
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access input.keyboard, input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.player;
    this.cursors;

    this.music;

    this.direction = 0;

    this.teddies;
    this.explosions;

    this.west;
    this.east;
    this.north;
    this.south;
    this.space;

    this.speed = 150;

    this.projectileSpeed = 500;
    this.fireRate = 300;
    this.nextFire = 0;

    this.meleeCreep;
    this.rangedCreep;
    this.meleeCreepBody;
    this.rangedCreepBody;
};

BasicGame.Game.prototype = {
    
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.west = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.east = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.north = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.south = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACE);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.player = this.game.add.sprite(100, 100, 'ada');

        this.meleeCreep = [];
        this.meleeCreep.push(new MeleeEnemy(this.game, 400, 500, this.player));
        this.meleeCreep.push(new MeleeEnemy(this.game, 500, 500, this.player));
        
        this.rangedCreep = [];
        /*this.rangedCreep.push(new RangedEnemy(this.game, 700,500, this.player));*/

        this.meleeCreepBody = [];
        this.meleeCreepBody.push(this.meleeCreep[0].melee);
        this.meleeCreepBody.push(this.meleeCreep[1].melee);
        
        this.rangedCreepBody = [];
        /*this.rangedCreepBody.push(this.rangedCreep[0].ranged);*/

        this.teddies = this.game.add.group();
        this.teddies.enableBody = true;
        this.teddies.physicsBodyType = Phaser.Physics.ARCADE;

        this.teddies.createMultiple(100,'teddy');

        this.teddies.setAll('checkWorldBounds', true);
        this.teddies.setAll('outOfBoundsKill', true);

        this.explosions = this.game.add.group();
        for (var i = 0; i < 30; i++)
        {
            var explosionAnimation = this.explosions.create(0,0, 'explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5,0.5);
            explosionAnimation.animations.add('explosion');
        }

        this.player.animations.add('left', [1, 5, 9, 13], 10, true);
        this.player.animations.add('right', [3, 7, 11, 15], 10, true);
        this.player.animations.add('up', [2, 6, 10, 14], 10, true);
        this.player.animations.add('down', [0, 4, 8, 12], 10, true);

        this.game.physics.enable(this.player,Phaser.Physics.ARCADE);

        //collision detection against world
        this.player.body.collideWorldBounds = true;

        //sets up anchor and collision box
        this.player.anchor.set(0.5,0.5);
        this.player.body.setSize(32,32,0,2);
        
        this.music = this.add.audio('gameMusic');
        this.music.play();
    },

    update: function () {

        this.player.body.velocity.setTo(0,0);

        this.player.body.collideWorldBounds = true;

        if (this.east.isDown && this.south.isDown)
        {
            this.player.body.velocity.x = this.speed/Math.sqrt(2);
            this.player.body.velocity.y = this.speed/Math.sqrt(2);
            this.player.animations.play('down');
        }
        else if (this.west.isDown && this.south.isDown)
        {
            this.player.body.velocity.x = -this.speed/Math.sqrt(2);
            this.player.body.velocity.y = this.speed/Math.sqrt(2);
            this.player.animations.play('down');
        }
        else if (this.east.isDown && this.north.isDown)
        {
            this.player.body.velocity.x = this.speed/Math.sqrt(2);
            this.player.body.velocity.y = -this.speed/Math.sqrt(2);
            this.player.animations.play('up');
        }
        else if (this.west.isDown && this.north.isDown)
        {
            this.player.body.velocity.x = -this.speed/Math.sqrt(2);
            this.player.body.velocity.y = -this.speed/Math.sqrt(2);
            this.player.animations.play('up');
        }
        else if (this.west.isDown)
        {
            this.player.body.velocity.x = -this.speed;
            this.player.animations.play('left');
            this.direction = 1;
        }
        else if (this.east.isDown)
        {
            this.player.body.velocity.x = this.speed;
            this.player.animations.play('right');
            this.direction = 3;
        }
        else if (this.south.isDown)
        {
            this.player.body.velocity.y = this.speed;
            this.player.animations.play('down');
            this.direction = 0;
        }
        else if (this.north.isDown)
        {
            this.player.body.velocity.y = -this.speed;
            this.player.animations.play('up');
            this.direction = 2;
        }
        else
        {
            this.player.animations.stop();
            if (this.direction == 0)
            {
                this.player.frame = 0;
            }
            else if (this.direction == 1)
            {
                this.player.frame = 1;
            }
            else if (this.direction == 2)
            {
                this.player.frame = 2;
            }
            else
            {
                this.player.frame = 3;
            }
        }
        if (this.cursors.up.isDown)
        {
            this.direction = 2;
            this.shoot();
        }
        else if (this.cursors.down.isDown)
        {
            this.direction = 0;
            this.shoot();
        }

        else if (this.cursors.right.isDown)
        {
            this.direction = 3;
            this.shoot();
        }
        else if (this.cursors.left.isDown)
        {
            this.direction = 1;
            this.shoot();
        }

        for (var i = this.rangedCreep.length - 1; i >= 0; i--) {
            this.rangedCreep[i].update();
        } 

        this.game.physics.arcade.collide(this.meleeCreepBody,this.rangedCreepBody);

        for (var i = 0; i < this.meleeCreep.length; i++) {
            this.meleeCreep[i].update();
            for (var j = i+1; j < this.meleeCreep.length; j++)
            {
                this.game.physics.arcade.collide(this.meleeCreepBody[i],this.meleeCreepBody[j]);
            }
        }

        if (this.game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown){
            this.quitGame();
        }
        if (this.game.input.keyboard.addKey(Phaser.Keyboard.E).isDown){
            this.explode(this.player);
        }
        if (this.game.input.keyboard.addKey(Phaser.Keyboard.R).isDown){
            this.explode(this.meleeCreepBody[0]);
        }
        if (this.game.input.keyboard.addKey(Phaser.Keyboard.T).isDown){
            this.explode(this.meleeCreepBody[1]);
        }
        //this.game.debug.cameraInfo(this.game.camera, 300, 32);
        //this.game.debug.spriteInfo(this.player, 32, 32);
        //this.game.debug.body(this.player);
    },

    shoot: function() {
        if (this.game.time.now > this.nextFire)
        {
            teddy = this.teddies.getFirstExists(false);
            
            if (teddy)
            {
                teddy.reset(this.player.x-12, this.player.y-10);

                if (this.direction == 0){
                    teddy.body.velocity.y = this.projectileSpeed;
                }
                if (this.direction == 1){
                    teddy.body.velocity.x = -this.projectileSpeed;
                }
                if (this.direction == 2){
                    teddy.body.velocity.y = -this.projectileSpeed;
                }
                if (this.direction == 3){
                    teddy.body.velocity.x = this.projectileSpeed;
                }
                this.nextFire = this.game.time.now + this.fireRate;
            }
        }
    },
    explode: function(sprite) {
        if (sprite.exists){
            sprite.kill();
            var explosionAnimation = this.explosions.getFirstExists(false);
            explosionAnimation.reset(sprite.x+3,sprite.y-30);
            explosionAnimation.play('explosion', 30, false, true);
        }
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.player.destroy(true);

        for (var i = this.teddies.length - 1; i >= 0; i--) {
            this.teddies.destroy(true);
        };

        for (var i = this.meleeCreepBody.length - 1; i >= 0; i--) {
            this.meleeCreepBody[i].destroy(true);
        };

        for (var i = this.rangedCreepBody.length - 1; i >= 0; i--) {
            this.rangedCreepBody[i].destroy(true);
        };

        this.music.stop();

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
