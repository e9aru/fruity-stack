/*jshint -W008 */

var STATES, UTILS, game, CFG;

(function(STATES){
  'use strict';

  CFG = {
    name: 'Fruity Stack',
    tileSize: 80,
    fruitWidth: 60,
    padding: 10,
    fontSize: 76,
    fruits: ['apple', 'banana', 'cherry', 'lemon', 'lime', 'orange', 'peach', 'plum', 'starfruit', 'strawberry', 'watermelon'],
    pts: {
      win: 100,
      match: 16
    }
  };

  game = new Phaser.Game(640, 480, Phaser.AUTO, '', { preload: preload, create: create });

  function preload() {
    console.debug('[ BOOT ] Preloader');
    game.load.bitmapFont('default', './assets/lobster.png', './assets/lobster.xml');
  }

  function create() {
    game.canvas.oncontextmenu = function(e) { e.preventDefault() };
    game.physics.startSystem(Phaser.Physics.NONE);

    game.state.add('level', STATES.level);
    game.state.add('menu', STATES.menu);
    game.state.add('credits', STATES.credits);

    game._ = {
      score: 0,
      collected: 0,
      combo: 0,
      currLvl: 0
    };

    LOAD();
  }

  function LOAD() {
    console.debug('[ LOAD ASSETS ]');

    var loadBar, loadStart, loadComplete, fileComplete;

    // Load fruits
    CFG.fruits.forEach(function(e) { game.load.image(e, './assets/' + e + '.png') });
    game.load.image('cover', './assets/cover.png');
    game.load.image('bg', './assets/bg.png');
    game.load.spritesheet('buttons', './assets/buttons.png', 182, 190);

    game.load.audio('match', ['./assets/jingles_SAX08.mp3', './assets/jingles_SAX08.ogg']);
    game.load.audio('match2', ['./assets/jingles_SAX04.mp3', './assets/jingles_SAX04.ogg']);
    game.load.audio('win', ['./assets/jingles_SAX10.mp3', './assets/jingles_SAX10.ogg']);
    game.load.audio('clapping', ['./assets/clapping.mp3', './assets/clapping.ogg']);
    game.load.audio('click', ['./assets/switch10.mp3', './assets/switch10.ogg']);
    game.load.audio('bg', ['./assets/bg.ogg', './assets/bg.ogg']);


    loadStart = function() {
      game.stage.backgroundColor = 0xC0AB77;
      loadBar = game.add.graphics(0, 0);
    };

    loadComplete = function() {
      game.state.clearCurrentState();
      game.sound.play('bg', .2, true);
      game.state.start('menu');
    };

    fileComplete = function(progress, cacheKey, success, totalLoaded, totalFiles) {
      console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

      loadBar.beginFill(0xFFCCEE);
      loadBar.drawRect(.5 * (game.width - (game.width * progress / 100)), game.height * .5 - 4, game.width * progress / 100, 8);
      loadBar.endFill();
    };

    game.load.onLoadStart.add(loadStart, this);
    game.load.onFileComplete.add(fileComplete, this);
    game.load.onLoadComplete.add(loadComplete, this);

    game.load.start();
  }

})(STATES = STATES || {});