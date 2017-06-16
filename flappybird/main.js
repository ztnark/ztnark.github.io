// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the images and sounds
        game.load.spritesheet('bird', 'assets/bird.png', 89,64, 3);
        game.load.image('pipe-up', 'assets/pipe.png');
        game.load.image('pipe-down', 'assets/pipe-down.png');
        game.load.image('background','assets/background.png');
        game.load.image('ground', 'assets/ground.png');


    },

    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.

        this.background = game.add.sprite(0, 0,'background');
        this.background.scale.setTo(0.53, 0.47);


        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        this.bird.scale.setTo(0.5, 0.5);

        this.bird.animations.add('walk');

        this.bird.animations.play('walk', 20, false);


        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.grounds = game.add.group();
        this.ground = this.game.add.tileSprite(0, 400, 400, 112, 'ground');
        this.ground.autoScroll(-200, 0);
        this.grounds.add(this.ground);

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });

        this.bird.anchor.setTo(-0.2, 0.5);


    },

    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        if (this.bird.y < 0 || this.bird.y > 380)
          this.restartGame();

        game.physics.arcade.overlap(
          this.bird, this.pipes, this.restartGame, null, this);

        if (this.bird.angle < 20)
          this.bird.angle += 1;
    },

    jump: function() {
      // Add a vertical velocity to the bird
      this.bird.body.velocity.y = -350;
      var animation = game.add.tween(this.bird);
      animation.to({angle: -20}, 100);
      this.bird.animations.play('walk', 20, false);
      animation.start();
    },

    restartGame: function() {
      // Start the 'main' state, which restarts the game
      game.state.start('main');
    },

    addOnePipe: function(x, y, flipped) {
        // Create a pipe at the position x and y
        var pipe;

        if(flipped){
          pipe = game.add.sprite(x, y, 'pipe-down');
        }else{
          pipe = game.add.sprite(x, y, 'pipe-up');
        }

        pipe.scale.setTo(0.5,0.5)
        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        pipe.body.width = 69;
        pipe.body.height = 397;


        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = (Math.floor(Math.random() * 4) + 1) * 60;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'

        this.addOnePipe(400, -396 + hole, true);
        this.addOnePipe(400, 120 + hole, false);

        this.score += 1;
        this.labelScore.text = this.score;
    },

};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
