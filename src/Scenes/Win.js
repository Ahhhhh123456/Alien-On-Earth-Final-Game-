class Win extends Phaser.Scene {
    constructor() {
        super('Win');



    }

    create() {
        let my = this.my;

        this.scoreTitle = this.add.text(380, 200, "You Win!", { fontFamily: 'Arial', fontSize: 100, color: '#ffffff' });
        this.scoreTitle = this.add.text(300, 350, "Final Score:", { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });
        this.scoreText = this.add.text(750, 350, score.toString(), { fontFamily: 'Arial', fontSize: 80, color: '#00FF00' });
        this.scoreTitle = this.add.text(275, 500, "Press R to Restart", { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });
        // if (score < 0) { 
        //     this.scoreText = this.add.text(650, 350, score.toString(), { fontFamily: 'Arial', fontSize: 80, color: '#FF0000' });
        // }
        
        // if (score > 0) { 
        //     this.scoreText = this.add.text(650, 350, score.toString(), { fontFamily: 'Arial', fontSize: 80, color: '#00FF00' });
        // }

       
        RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        document.getElementById('description').innerHTML = '<h2>Win.js</h2>';
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(RKey)){ 
            let my = this.my;
            this.scene.start("Title");
            
        }
    }
}

