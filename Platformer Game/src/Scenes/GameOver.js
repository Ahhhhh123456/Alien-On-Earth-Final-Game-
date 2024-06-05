class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');



    }

    create() {
        let my = this.my;

        this.scoreTitle = this.add.text(380, 200, "You Died!", { fontFamily: 'Arial', fontSize: 100, color: '#ffffff' });
        this.scoreTitle = this.add.text(335, 350, "Final Score:", { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });
        this.scoreText = this.add.text(800, 350, score.toString(), { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });
        this.scoreTitle = this.add.text(270, 500, "Press R to Restart", { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });


        
        document.getElementById('description').innerHTML = '<h2>GameOver.js</h2>';
        RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(RKey)){ 
            let my = this.my;
            this.scene.start("Title");
            
        }
    }
}


