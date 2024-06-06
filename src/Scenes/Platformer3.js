class Platformer3 extends Phaser.Scene{
    constructor(){
        super('Platformer3');
    }

    init(){
        // variables and settings
        this.ACCELERATION = 225;
        this.DRAG = 20000;    
        this.PARTICLE_VELOCITY = 50;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -575;
        this.checkpoint = false;
        this.leverCooldown = 400;       
        this.leverCooldownCounter = 0;
        this.leverOn = false;

        // Used for double jump implementation
        this.doubleJump = true;
        this.jumpCount = 0;

        this.wallClimb = true;
    }

    create() {
        this.map = this.add.tilemap("Platformer3", 21,21, 60,20)
        this.tileset = this.map.addTilesetImage("Platformer3", "tilemap_tiles");
        this.tilesetBackground = this.map.addTilesetImage("backgrounds", "tilemap_background");


        this.BackgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0,0);
        this.BackgroundLayer.setScale(2);

        this.Background2Layer = this.map.createLayer("Background2", this.tileset, 0,0);
        this.Background2Layer.setScale(2);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(0, game.config.height/1.3, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);


        // Lever
        this.lever = this.map.createFromObjects ("Collectibles",{
            name: "lever",
            key: "tilemap_sheet",
            frame: 887

        });

        this.leverGroup = this.add.group(this.lever);

        this.lever.forEach(key =>{
            key.x *= 2;

            key.y *= 2;
            
            key.setScale(2);
        })

        this.physics.world.enable(this.lever, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.overlap(my.sprite.player, this.lever, (obj1, obj2) => {

            if (obj2.frame.name == 887) {
                this.sound.play("lever", {volume: 1});

                // Spikes
                this.FallLayer = this.map.createLayer("Fall", this.tileset, 0, 0);
                this.FallLayer.setScale(2);
        
                this.FallLayer.setCollisionByProperty({
                    fall: true
                });
        
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

                    // Pulled Lever
                    this.PulledLeverLayer = this.map.createLayer("PulledLever", this.tileset, 0,0);
                    this.PulledLeverLayer.setScale(2);

                    this.PulledLeverLayer.setCollisionByProperty({
                        collides: true
                    });

                    this.physics.add.collider(my.sprite.player, this.PulledLeverLayer);
            }

            obj2.setFrame(886);
            this.leverOn = true;
        });

        
        // Ground
        this.groundLayer = this.map.createLayer("Ground & Platforms", this.tileset, 0,0);
        this.groundLayer.setScale(2);

        this.physics.add.collider(my.sprite.player, this.groundLayer);
        
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // No wall climb layer
        this.NoWallClimbLayer = this.map.createLayer("NoWallClimb", this.tileset, 0, 0);
        this.NoWallClimbLayer.setScale(2);
        
        this.NoWallClimbLayer.setCollisionByProperty({
            collides: true
        });    
        
        this.physics.add.collider(my.sprite.player, this.NoWallClimbLayer, NoWallClimb, null, this);
        
        function NoWallClimb(player, wall) {
            this.wallClimb = false;
        }


        // Ground 2
        this.groundLayer2 = this.map.createLayer("Ground & Platforms2", this.tileset, 0,0);
        this.groundLayer2.setScale(2);



        this.physics.add.collider(my.sprite.player, this.groundLayer2);


        
        // Flag
        this.FlagLayer = this.map.createLayer("Flag", this.tileset, 0,0);
        this.FlagLayer.setScale(2);

        this.FlagLayer.setCollisionByProperty({
            flag: true
        });

        this.physics.add.collider(my.sprite.player, this.FlagLayer, null, flagCollideEnd, this);

        function flagCollideEnd(player, flag) { 
            this.scene.start("Win");
        }

        //Dialogue
        this.spriteText = this.add.text(my.sprite.player.x, my.sprite.player.y+ 100, "The snow is slowing me down!", { fontFamily: 'Arial', fontSize: 25, color: '#000000' });
        this.spriteText2 = this.add.text(my.sprite.player.x, my.sprite.player.y +150, "(You can now double jump and wall climb.)", { fontFamily: 'Arial', fontSize: 25, color: '#000000' });

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
        const viewportWidth = this.game.config.width/2.5 ; 
        const viewportHeight = this.game.config.height; 
        this.cameras.main.setViewport(0, 0, viewportWidth, viewportHeight);
    
        // Set camera follow and other settings
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, 0, 238);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1);


        // Movement vfx
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {

            frame: ['dirt_01.png', 'dirt_03.png'],

            scale: {start: 0.03, end: 0.1},

            lifespan: 200,

            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {

            frame: ['smoke_10.png', 'smoke_09.png'],

            scale: {start: 0.03, end: 0.1},

            lifespan: 500,

            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jump.stop();


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
        
        // Timing of the spikes
        this.time.addEvent({
            delay: 2000,
            callback: this.toggleVisibility,
            callbackScope: this,
            loop: true
        });





        my.vfx.walking.stop();

        document.getElementById('description').innerHTML = '<h2>Platformer.js</h2><br> Use <b> ARROW KEYS </b> to move. //// <b> COLLIDE </b> with NPC to talk <br> <br>  <b> UP ARROW </b> to jump. (<b>UP ARROW </b> again to double jump) ////  <b>UP ARROW + RIGHT/LEFT ARROW </b> to wall climb';
        
    }

    toggleVisibility() {
        if (this.leverOn) {
            this.FallLayer.visible = true;
            

            setTimeout(() => {
                this.FallLayer.visible = false;
            }, 1500); 
        }
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

        // Double Jump
        if( (this.doubleJump == true ) && Phaser.Input.Keyboard.JustDown(cursors.up)) {

            if (my.sprite.player.body.blocked.right || my.sprite.player.body.blocked.left) {
                my.vfx.walking.stop();
                my.sprite.player.anims.play('idle');
            }
            if (my.sprite.player.body.blocked.down) {
                this.jumpCount = 0;
            }
            if (this.jumpCount < 2) {
                if (this.jumpCount == 1 ){
                    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY / 1.2);
                    this.sound.play("jump", { volume: 0.5});
                    this.jumpCount += 1;
                    my.vfx.jump.start();
                }
                else {
                    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                    this.sound.play("jump", { volume: 0.5});
                    this.jumpCount += 1;
                    my.vfx.jump.start();
                    
                }


                
            }
            if (this.jumpCount == 2 ){

                this.doubleJump == false;
                
                
            }
        }
        if (my.sprite.player.body.blocked.down) {
            this.wallClimb = true;
            this.doubleJump = true;
            this.JumpCount = 0;
        }


        // Wall Climbing
        if (my.sprite.player.body.blocked.right || my.sprite.player.body.blocked.left && this.wallClimb == true) {
            this.doubleJump = false;
            my.vfx.walking.stop();
            my.sprite.player.anims.play('idle');
            

        }
        if(my.sprite.player.body.blocked.right && Phaser.Input.Keyboard.JustDown(cursors.up) && this.wallClimb == true) {

            my.sprite.player.body.setVelocityY(-650);
            this.sound.play("jump", { volume: 0.5});
            my.sprite.player.anims.play('jump');
            my.vfx.jump.start();

        }
        if(my.sprite.player.body.blocked.left && Phaser.Input.Keyboard.JustDown(cursors.up) && this.wallClimb == true) {

            my.sprite.player.body.setVelocityY(-650);
            this.sound.play("jump", { volume: 0.5});
            my.sprite.player.anims.play('jump');
            my.vfx.jump.start();
            
        }
        

    }
}
