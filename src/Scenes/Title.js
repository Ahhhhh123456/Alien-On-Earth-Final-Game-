score = 0;
life = 3;
let RKey;
let TKey;

class Title extends Phaser.Scene {
    constructor() {
        super('Title');



    }

    create() {
        let my = this.my;

        this.Title = this.add.text(250, 200, "Alien on Earth", { fontFamily: 'Arial', fontSize: 100, color: '#ffffff' });
        this.Title2 = this.add.text(275, 350, "Press T to Start!", { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });
        this.author = this.add.text(825, 800, "Made by: Jason Li", { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credits = this.add.text(0, 800, "Credits: Kenny Assets (assets) & Jason Li (coding)", { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });

        document.getElementById('description').innerHTML = '<h2>Title.js</h2>';
        TKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(TKey)){ 
            let my = this.my;
            this.scene.start("Platformer1");
            
        }

    }
}


