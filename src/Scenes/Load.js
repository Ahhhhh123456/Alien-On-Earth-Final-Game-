class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        
        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.image("tilemap_background", "backgrounds.png");
        this.load.tilemapTiledJSON("Platformer", "Platformer.tmj"); 
        this.load.tilemapTiledJSON("Platformer2", "Platformer2.tmj");
        this.load.tilemapTiledJSON("Platformer3", "Platformer3.tmj");
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 21,
            frameHeight: 21
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // Audio
        this.load.audio("dead", "explosionCrunch_000.ogg");
        this.load.audio("key", "open_002.ogg");
        this.load.audio("coin", "toggle_001.ogg");
        this.load.audio("heart", "confirmation_002.ogg");
        this.load.audio("checkpoint", "open_004.ogg");
        this.load.audio("lever", "switch_006.ogg");
        this.load.audio("block", "impactMetal_medium_000.ogg");
        this.load.audio("NPC", "spaceEngineLow_002.ogg");
        this.load.audio("jump", "bong_001.ogg");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("Title");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}