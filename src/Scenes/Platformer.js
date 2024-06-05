class Platformer extends Phaser.Scene {
    constructor() {
        super("Platformer1");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 350;
        this.DRAG = 20000;    // DRAG < ACCELERATION = icy slide
        this.PARTICLE_VELOCITY = 50;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -900;


    }



    create() {


        //Reset Score and Life
        score = 0;
        life = 3;

        // Create a new tilemap game object which uses 21x21 pixel tiles, and is
        // 60 tiles wide and 20 tiles tall.
        this.map = this.add.tilemap("Platformer", 21, 21, 60, 20);

        // Add a tileset to the map 
        this.tileset = this.map.addTilesetImage("Platformer", "tilemap_tiles");
        this.tilesetBackground = this.map.addTilesetImage("backgrounds", "tilemap_background");

        this.BackgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0,0);
        this.BackgroundLayer.setScale(2);

        // Grounds
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(2);

        this.groundLayer2 = this.map.createLayer("Ground-n-Platforms2", this.tileset, 0,0);
        this.groundLayer2.setScale(2);

        // Spikes or Water
        this.FallLayer = this.map.createLayer("Fall", this.tileset, 0, 0);
        this.FallLayer.setScale(2);

        // Key Lock
        this.KeyLockLayer = this.map.createLayer("Key-Lock", this.tileset, 0,0);
        this.KeyLockLayer.setScale(2);

        // Flag
        this.FlagLayer = this.map.createLayer("Flag", this.tileset, 0,0);
        this.FlagLayer.setScale(2);

        

        
        // Collidable layers
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.groundLayer2.setCollisionByProperty({
            collides: true
        });

        this.FallLayer.setCollisionByProperty({
            fall: true
        });

        this.FlagLayer.setCollisionByProperty({
            flag: true
        });

        this.KeyLockLayer.setCollisionByProperty({
            keylock: true
        });


        // This sets up the score
        this.scoreTitle = this.add.text(0, 0, "Score:", { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
        this.scoreTitle.setScrollFactor(0);
        this.scoreText = this.add.text(110, 0, score.toString(), { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
        this.scoreText.setScrollFactor(0);

        // This sets up the Live Count
        this.lifeTitle = this.add.text(0,50, "Life Count:", {fontFamily: 'Arial', fontSize: 35, color: '#000000'});
        this.lifeText = this.add.text(180,50, life.toString(), {fontFamily: 'Arial', fontSize: 35, color: '#000000'});
        this.lifeTitle.setScrollFactor(0);
        this.lifeText.setScrollFactor(0);


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(0, game.config.height/1.3, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.groundLayer2);
        
        // Collider check for spikes and water
        this.physics.add.collider(my.sprite.player, this.FallLayer, null, fallCollide, this);

        function fallCollide(player, fall) { 
            player.x = 0
            player.y = game.config.height/1.4;

            // Updates life count
            life -= 0.5;
            this.lifeText.visible = false;
            this.lifeText = this.add.text(180, 50, life.toString(), { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
            this.lifeText.setScrollFactor(0);
            this.lifeText.visible = true;
            this.sound.play("dead", { volume: 0.2});
            if (life <= 0) {
                this.sound.play("dead", { volume: 2 });
                this.scene.start("GameOver");
                
            }

        }

        
        // Makes the flag collidable while giving you the Win scene
        this.physics.add.collider(my.sprite.player, this.FlagLayer, null, flagCollideEnd, this);

        function flagCollideEnd(player, flag) { 
            this.scene.start("Platformer2");
        }



        // Making key lock collidable
        this.physics.add.collider(my.sprite.player, this.KeyLockLayer);


        
        // Making coins
        this.coins = this.map.createFromObjects("Collectibles", {
            name: "coins",
            key: "tilemap_sheet",
            frame: 379
        });

        
            // Create a Phaser group out of the array this.coins
            // This will be used for collision detection below.
        this.keyGroup = this.add.group(this.coins);

        this.coins.forEach(key => {
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        
            // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            obj2.destroy();     // remove coin on overlap

            // Updates Score
            score += 100;
            this.scoreText.visible = false;
            this.scoreText = this.add.text(110, 0, score.toString(), { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
            this.scoreText.setScrollFactor(0);
            this.scoreText.visible = true;

            // audio
            this.sound.play("coin", { volume: 0.25 });
        });



        // Making key
        this.key = this.map.createFromObjects("Collectibles", {
            name: "key",
            key: "tilemap_sheet",
            frame: 14
        });
    
            // Create a Phaser group out of the array this.coins
            // This will be used for collision detection below.
        this.keyGroup = this.add.group(this.key);

        this.key.forEach(key => {
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        });

        this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);

            // Handle collision detection with keys
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {

            
            // This removes the key locks from the map so the player can walk through it (I couldn't think of another way of doing it because every other method I tried didn't work)
            this.KeyLockLayer.y -= 1000;
            obj2.destroy();     // remove coin on overlap
            
            // audio
            this.sound.play("key", { volume: 0.5 });
        });


        // Movement vfx
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {

            frame: ['dirt_01.png', 'dirt_03.png'],

            scale: {start: 0.03, end: 0.1},

            lifespan: 200,

            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {

            frame: ['smoke_10.png', 'smoke_09.png'],

            scale: {start: 0.03, end: 0.1},

            lifespan: 500,

            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jump.stop();


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // Camera

        const scaledWidth = this.map.widthInPixels * this.SCALE;
        const scaledHeight = this.map.heightInPixels * this.SCALE;
        this.cameras.main.setBounds(0, 0, scaledWidth, scaledHeight);
        const viewportWidth = this.game.config.width/2.5 ;
        const viewportHeight = this.game.config.height; 
        this.cameras.main.setViewport(0, 0, viewportWidth, viewportHeight);
    
        // Set camera follow and other settings
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, 0, 238);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1);

        document.getElementById('description').innerHTML = '<h2>Platformer.js</h2><br> Use <b> ARROW KEYS </b> to move. <br> <br>  <b> UP ARROW </b> to jump.';

        TKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
       
    }


    update() {
        if(cursors.left.isDown) {

            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {


            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {

            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
  
        }

        // player jump
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jump.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jump.stop();
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {

            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jump.start();

            this.sound.play("jump", { volume: 0.5});
        }


        if (Phaser.Input.Keyboard.JustDown(TKey)){ 
            let my = this.my;
            this.scene.start("Platformer2");
            
        }
    }
}