
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


    this.HUD;

};

BasicGame.Game.prototype = {
    
    create: function () {
        //Add physics to our game
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Assign WASD controls to variables
        this.west = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.east = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.north = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.south = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        //Assign SPACE to a variable
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACE);

        //Declare cursors (arrow keys)
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //Add in the player to the game
        this.player = this.game.add.sprite(100, 100, 'ada');
        this.player.health = 10;
        
        //Our player obeys physics
        this.game.physics.enable(this.player,Phaser.Physics.ARCADE);

        //Player collision detection against world
        this.player.body.collideWorldBounds = true;

        //Player anchor and collision box
        this.player.anchor.set(0.5,0.5);
        this.player.body.setSize(32,32,0,2);

        //Add our player movement animations
        this.player.animations.add('left', [1, 5, 9, 13], 10, true);
        this.player.animations.add('right', [3, 7, 11, 15], 10, true);
        this.player.animations.add('up', [2, 6, 10, 14], 10, true);
        this.player.animations.add('down', [0, 4, 8, 12], 10, true);

        //Declare list of melee enemies
        this.meleeCreep = [];
        this.meleeCreep.push(new MeleeEnemy(0,this.game, 400, 500, this.player));
        this.meleeCreep.push(new MeleeEnemy(1,this.game, 500, 500, this.player));
        
        //Declare list of ranged enemies
        this.rangedCreep = [];
        /*this.rangedCreep.push(new RangedEnemy(this.game, 700,500, this.player));*/

        //Another list for just the melee enemies bodies
        this.meleeCreepBody = [];
        this.meleeCreepBody.push(this.meleeCreep[0].melee);
        this.meleeCreepBody.push(this.meleeCreep[1].melee);
        
        //Another list for just the ranged enemies bodies
        this.rangedCreepBody = [];
        /*this.rangedCreepBody.push(this.rangedCreep[0].ranged);*/

        //Add a teddies group (projectile)
        this.teddies = this.game.add.group();

        //These teddies will be bodies
        this.teddies.enableBody = true;

        //Teddies also follow arcade physics
        this.teddies.physicsBodyType = Phaser.Physics.ARCADE;

        //Add 100 teddy bears to our group using our sprite 'teddy'
        this.teddies.createMultiple(100,'teddy');

        //All teddies will obey our world bounds and die when they get there
        this.teddies.setAll('checkWorldBounds', true);
        this.teddies.setAll('outOfBoundsKill', true);

        //Add our explosions group
        this.explosions = this.game.add.group();

        //Declare explosion animations to create, settings are largely default
        for (var i = 0; i < 30; i++)
        {
            var explosionAnimation = this.explosions.create(0,0, 'explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5,0.5);
            explosionAnimation.animations.add('explosion');
        }
        
        //Music for our game itself
        this.music = this.add.audio('gameMusic');
        this.music.play();


        this.HUD = new HUD(this.game);



/*
        this.hud = this.add.sprite(0,0,'HUD');
        this.game.physics.enable(this.hud, Phaser.Physics.ARCADE);
        this.hud.width = 800;
        this.hud.height = 50;
        this.hud.body.immovable = true;

        this.hearts = [];
        this.hearts[0] = this.add.sprite(50,20,'hearts');
        this.ada_thumb = this.add.sprite(0, 0, 'ada');

        this.hearts[1] = this.add.sprite(620, 20, 'hearts');
        this.axe_thumb0 = this.add.sprite(560, 0, 'axe');

        this.hearts[2] = this.add.sprite(380,20,'hearts');
        this.axe_thumb1 = this.add.sprite(320,0,'axe');
        //this.hearts.crop(new Phaser.Rectangle(0,0,14,16));
 */


    },

    update: function () {
        this.HUD.collisions(this.player, this.meleeCreepBody[0], this.meleeCreepBody[1]);
        this.HUD.update(this.player);

        //By default, our player is at rest
        this.player.body.velocity.setTo(0,0);

        //Our player also obeys world boundaries
        this.player.body.collideWorldBounds = true;

        //Code to play animation of movement and have velocity depending on WASD keys, math is used for diagonal movement
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

        //Cursor buttons are used to shoot in the corresponding direction
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

        //Update all of our ranged creep
        for (var i = 0; i < this.rangedCreep.length; i++) {
            this.rangedCreep[i].update();
            for (var j = i+1; j < this.rangedCreep.length; j++)
            {
                this.game.physics.arcade.collide(this.rangedCreepBody[i],this.rangedCreepBody[j]);
            }
        }

        //Collision between our ranged and melee enemies
        this.game.physics.arcade.collide(this.meleeCreepBody,this.rangedCreepBody);

        //Update all melee enemies and add collision between them
        for (var i = 0; i < this.meleeCreep.length; i++) {
            this.game.physics.arcade.overlap(this.teddies, this.meleeCreep[i].melee, this.projectileHitsEnemy, null, this);
            this.meleeCreep[i].update();
            for (var j = i+1; j < this.meleeCreep.length; j++)
            {
                this.game.physics.arcade.collide(this.meleeCreepBody[i],this.meleeCreepBody[j]);
            }
        }

        //Some keyboard test inputs
        if (this.game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown){
            this.quitGame();
        }
        /*if (this.game.input.keyboard.addKey(Phaser.Keyboard.E).isDown){
            this.explode(this.player);
        }
        if (this.game.input.keyboard.addKey(Phaser.Keyboard.R).isDown){
            this.explode(this.meleeCreepBody[0]);
        }
        if (this.game.input.keyboard.addKey(Phaser.Keyboard.T).isDown){
            this.explode(this.meleeCreepBody[1]);
        }*/

/*
         this.game.physics.arcade.collide(this.hud, this.player);
         this.game.physics.arcade.collide(this.hud, this.meleeCreepBody[0]);
         this.game.physics.arcade.collide(this.hud, this.meleeCreepBody[1]);
*/        

        //Useful debug information
        //this.game.debug.cameraInfo(this.game.camera, 300, 32);
        //this.game.debug.spriteInfo(this.player, 32, 32);
        //this.game.debug.body(this.player);

    },

    shoot: function() {
        //Depending on our cooldown, will fire a projectile
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

    //Blows up the called sprite
    explode: function(sprite) {
        sprite.kill();
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(sprite.x+3,sprite.y-30);
        explosionAnimation.play('explosion', 30, false, true);
    },

    //Called when projectile hits an enemy
    projectileHitsEnemy: function(meleeEnemy,projectile) {
        projectile.kill();

        var dead = this.meleeCreep[meleeEnemy.name].damage();

        if (dead){
            console.log(this.meleeCreep[meleeEnemy.name].health);
            this.explode(this.meleeCreep[meleeEnemy.name].melee);
        }
    },

    //Quits the game back to the main menu
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
