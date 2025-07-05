const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    }
};

const game = new Phaser.Game(config);
let player, cursors, evidenceItems = [];

function preload() {
    // Load assets
    this.load.image('serverRoom', 'assets/backgrounds/server_room.png');
    this.load.spritesheet('detective', 'assets/characters/detective.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.image('server', 'assets/objects/server.png');
    this.load.image('laptop', 'assets/objects/laptop.png');
    this.load.image('file', 'assets/objects/file.png');
}

function create() {
    // Setup world
    this.add.image(640, 360, 'serverRoom').setScale(1.2);

    // Player setup
    player = this.physics.add.sprite(200, 500, 'detective');
    player.setCollideWorldBounds(true);

    // Animations
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('detective', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // Evidence setup
    createInteractiveObject(this, 800, 400, 'server', {
        type: 'log',
        content: 'Unauthorized login detected at 02:15 AM'
    });

    createInteractiveObject(this, 1000, 300, 'laptop', {
        type: 'malware',
        content: 'Suspicious process: malware.exe'
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    // HUD
    this.add.dom(20, 20).createFromCache(`
        <div class="hud">
            <h3>FORENSIC TOOLKIT</h3>
            <p>Evidence Collected: <span id="evidence-count">0</span></p>
        </div>
    `);
}

function update() {
    // Player movement
    player.setVelocity(0);
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('walk', true);
        player.flipX = false;
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('walk', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('walk', true);
    }

    // Evidence interaction
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        checkEvidenceProximity(this);
    }
}

function createInteractiveObject(scene, x, y, sprite, data) {
    const obj = scene.physics.add.sprite(x, y, sprite)
        .setInteractive()
        .setDataEnabled()
        .setScale(0.8);
    obj.data.set(data);
    evidenceItems.push(obj);
}

function checkEvidenceProximity(scene) {
    evidenceItems.forEach((evidence) => {
        if (Phaser.Math.Distance.Between(
            player.x, player.y,
            evidence.x, evidence.y
        ) < 50) {
            analyzeEvidence(scene, evidence);
        }
    });
}

function analyzeEvidence(scene, evidence) {
    const analysisWindow = scene.add.dom(640, 360).createFromCache(`
        <div style="
            background: rgba(0,0,0,0.9);
            color: #00ff00;
            padding: 20px;
            border: 2px solid #00ff00;
            text-align: left;
        ">
            <h3>Forensic Analysis</h3>
            <p>Type: ${evidence.data.get('type').toUpperCase()}</p>
            <pre>${evidence.data.get('content')}</pre>
            <button onclick="this.parentElement.remove()">Close</button>
        </div>
    `);
}