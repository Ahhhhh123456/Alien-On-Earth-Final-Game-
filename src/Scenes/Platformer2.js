class Platformer2 extends Phaser.Scene{
    constructor(){
        super('Platformer2');
    }

    init(){
        // variables and settings
        this.ACCELERATION = 350;
        this.DRAG = 20000;   
        this.PARTICLE_VELOCITY = 50;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -900;
        this.checkpoint = false;

        // Used for double jump implementation
        this.doubleJump = true;
        this.jumpCount = 0;
    }

    create() {
        this.map = this.add.tilemap("Platformer2", 21,21, 60,20)
        this.tileset = this.map.addTilesetImage("Platformer2", "tilemap_tiles");
        this.tilesetBackground = this.map.addTilesetImage("backgrounds", "tilemap_background");


        this.BackgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0,0);
        this.BackgroundLayer.setScale(2);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(0, game.config.height/1.3, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Key Lock
        this.KeyLockLayer = this.map.createLayer("Key-Lock", this.tileset, 0,0);
        this.KeyLockLayer.setScale(2);

        this.KeyLockLayer.setCollisionByProperty({
            keylock: true
        });

        this.physics.add.collider(my.sprite.player, this.KeyLockLayer);
        
        // Ground
        this.groundLayer = this.map.createLayer("Ground & Platforms", this.tileset, 0,0);
        this.groundLayer.setScale(2);

        
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Spikes
        this.FallLayer = this.map.createLayer("Fall", this.tileset, 0, 0);
        this.FallLayer.setScale(2);

        this.FallLayer.setCollisionByProperty({
            fall: true
        });

        this.physics.add.collider(my.sprite.player, this.FallLayer, null, fallCollide, this);

        function fallCollide(player, fall) {
            if (this.checkpoint == true) {
                player.x = 652;
                player.y = 190 - 80;
            }
            else {
                player.x = 0
                player.y = game.config.height/1.4;               
            }


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

        
        // Flag
        this.FlagLayer = this.map.createLayer("Flag", this.tileset, 0,0);
        this.FlagLayer.setScale(2);

        this.FlagLayer.setCollisionByProperty({
            flag: true
        });

        this.physics.add.collider(my.sprite.player, this.FlagLayer, null, flagCollideEnd, this);

        function flagCollideEnd(player, flag) { 
            this.scene.start("Platformer3");
        }


        // Torches
        this.TorchLayer = this.map.createLayer("Torches", this.tileset, 0,0);
        this.TorchLayer.setScale(2);

    

        // Score
        this.scoreTitle = this.add.text(0, 0, "Score:", { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
        this.scoreTitle.setScrollFactor(0);
        this.scoreText = this.add.text(110, 0, score.toString(), { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
        this.scoreText.setScrollFactor(0);

        // Live Count
        this.lifeTitle = this.add.text(0,50, "Life Count:", {fontFamily: 'Arial', fontSize: 35, color: '#000000'});
        this.lifeText = this.add.text(180,50, life.toString(), {fontFamily: 'Arial', fontSize: 35, color: '#000000'});
        this.lifeTitle.setScrollFactor(0);
        this.lifeText.setScrollFactor(0);

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();


        // Camera
        const scaledWidth = this.map.widthInPixels * this.SCALE;
        const scaledHeight = this.map.heightInPixels * this.SCALE;
        this.cameras.main.setBounds(0, 0, scaledWidth, scaledHeight);
    
        // Adjust the viewport size (optional, based on desired camera size)
        const viewportWidth = this.game.config.width/2.5 ; 
        const viewportHeight = this.game.config.height; 
        this.cameras.main.setViewport(0, 0, viewportWidth, viewportHeight);
    
        // Set camera follow and other settings
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, 0, 238);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1);

        // Heart
        this.heart = this.map.createFromObjects ("Collectibles",{
            name: "heart",
            key: "tilemap_sheet",
            frame: 373

        });

        this.heartGroup = this.add.group (this.heart);

        this.heart.forEach(key =>{
            key.x *= 2;

            key.y *= 2;
           
            key.setScale(2);


        })
        
        this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.overlap(my.sprite.player, this.heartGroup, (obj1, obj2) => {
            life += 1;
            this.lifeText.visible = false;
            this.lifeText = this.add.text(180, 50, life.toString(), { fontFamily: 'Arial', fontSize: 35, color: '#000000' });
            this.lifeText.setScrollFactor(0);
            this.lifeText.visible = true;
            obj2.destroy();     // remove coin on overlap

            this.sound.play("heart", {volume: 1});
        });


        // First block
        this.block = this.map.createFromObjects ("Collectibles",{
            name: "block",
            key: "tilemap_sheet",
            frame: 130

        });


        
        this.blockGroup = this.add.group (this.block);

        this.block.forEach(key =>{
            key.x *= 2;

            key.y *= 2;
           
            key.setScale(2);


        })

        this.physics.world.enable(this.block, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.collider(my.sprite.player, this.blockGroup, (obj1, obj2) => {
            if (obj2.frame.name == 130 && obj1.body.blocked.up) {
                this.sound.play("block", {volume: 1});
                obj2.setFrame(160);
                this.hiddenLayer = this.map.createLayer("Hidden Platforms", this.tileset, 0,0);
                this.hiddenLayer.setScale (2);
        
                this.hiddenLayer.setCollisionByProperty({
                    collides: true
                });
    
                this.physics.add.collider(my.sprite.player, this.hiddenLayer);
            }
        });


        // Second Block Code
        this.block2 = this.map.createFromObjects ("Collectibles",{
            name: "block2",
            key: "tilemap_sheet",
            frame: 130

        });

        this.blockGroup2 = this.add.group (this.block2);

        this.block2.forEach(key =>{
            key.x *= 2;

            key.y *= 2;
           
            key.setScale(2);


        })

        this.physics.world.enable(this.blockGroup2, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.collider(my.sprite.player, this.blockGroup2, (obj1, obj2) => {
            if (obj2.frame.name == 130 && obj1.body.blocked.up) {
                this.sound.play("block", {volume: 1});
                obj2.setFrame(160);
                this.hiddenLayer = this.map.createLayer("Hidden Platforms 2", this.tileset, 0,0);
                this.hiddenLayer.setScale (2);
        
                this.hiddenLayer.setCollisionByProperty({
                    collides: true
                });
    
                this.physics.add.collider(my.sprite.player, this.hiddenLayer);
            }
        });

        // NPC Code
        this.NPC = this.map.createFromObjects ("Collectibles",{
            name: "NPC",
            key: "tilemap_sheet",
            frame: 110

        });

        this.NPCGroup = this.add.group(this.NPC);

        this.NPC.forEach(key =>{
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        })

        this.physics.world.enable(this.NPC, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.collider(my.sprite.player, this.NPC, (obj1, obj2) => {
            if (obj2.frame.name == 110) {

                obj2.setFrame(111);
                this.text = this.add.text(obj2.x - 100 ,obj2.y - 50, "The key is in the top right.", {fontFamily: 'Arial', fontSize: 20, color: '#000000'});
                this.hiddenLayer3 = this.map.createLayer("Hidden Platforms 3", this.tileset, 0,0);
                this.hiddenLayer3.setScale(2);
        
                this.hiddenLayer3.setCollisionByProperty({
                    collides: true
                });

                this.physics.add.collider(my.sprite.player, this.hiddenLayer3);
                
                // NPC audio
                this.sound.play("NPC", {volume: 0.25});
            }
        });


        // Key Code
        this.key = this.map.createFromObjects("Collectibles", {
            name: "key",
            key: "tilemap_sheet",
            frame: 14
        });

        this.key.forEach(key => {
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        });
        this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.key);


            // Handle collision detection with keys
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {

            
            // This removes the key locks from the map so the player can walk through it (I couldn't think of another way of doing it because every other method I tried didn't work)
            this.KeyLockLayer.y -= 1000;
            obj2.destroy();     // remove coin on overlap
            this.hiddenLayer4 = this.map.createLayer("Hidden Platforms 4", this.tileset, 0,0);
            this.hiddenLayer4.setScale(2);
    
            this.hiddenLayer4.setCollisionByProperty({
                collides: true
            });

            this.physics.add.collider(my.sprite.player, this.hiddenLayer4);
            // audio
            this.sound.play("key", { volume: 0.5 });
        });

        // Checkpoint
        this.checkpoint = this.map.createFromObjects ("Collectibles",{
            name: "checkpoint",
            key: "tilemap_sheet",
            frame: 314

        });

        this.checkpointGroup = this.add.group(this.checkpoint);

        this.checkpoint.forEach(key =>{
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        })

        this.physics.world.enable(this.checkpoint, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.overlap(my.sprite.player, this.checkpoint, (obj1, obj2) => {
            if (obj2.frame.name == 314) {
                this.sound.play("checkpoint", {volume: 0.18});
            }
            obj2.setFrame(340);
            this.checkpoint = true;

        });

        // Coins
        this.coins = this.map.createFromObjects("Collectibles", {
            name: "coins",
            key: "tilemap_sheet",
            frame: 379
        });

        this.keyGroup = this.add.group(this.coins);

        this.coins.forEach(key => {
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        });

    
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);


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

        document.getElementById('description').innerHTML = '<h2>Platformer.js</h2><br> Use <b> ARROW KEYS </b> to move. //// <b> COLLIDE </b> with NPC to talk <br> <br>  <b> UP ARROW </b> to jump.';


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

    }
}
