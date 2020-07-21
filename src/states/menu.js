/*jshint -W008 */

(function(STATES) {
  'use strict';

  STATES.menu = function() {};
  STATES.menu.prototype.init = function() { console.debug('[ MENU ]') };
  STATES.menu.prototype.create = function() {
    // Color
    game._.color = game._.color || UTILS.getJuicyColor();

    // Bg
    bg = game.add.image(0, 0, 'bg');

    // Gui
    gui = {
      title: UTILS.write(CFG.name, 0, 46, .5, .5, 'center', 1, game._.color),
      score: UTILS.write(game._.score + ' pts', game.width * .5, CFG.tileSize * 5, .5, .5, 'center', .6, 0xFFEE66),
      play: UTILS.addButton('play', game.width * .5, game.height * .57, .5, .5, 0, function() {
        gui.title._.tweenPlay.onComplete.addOnce(function() {
          game.state.start('level');
        });

        gui.title._.tweenPlay.start();
        gui.play._.exitTween.start();
        gui.remove._.exitTween.start();
        gui.score._.exitTween.start();
      }),
      remove: UTILS.addButton('remove', CFG.tileSize * 6.5, CFG.tileSize * 5, .5, .5, 0, function() {
        game.sound.play('match');
        game._.score = 0;
        game._.currLvl = 0;
        gui.score.text = game._.score + ' pts';
      }),
      info: UTILS.addButton('info', CFG.tileSize * .12, CFG.tileSize * 4, 0, .5, .31, function() {
        gui.title._.tweenPlay.onComplete.addOnce(function() {
          game.state.start('credits');
        });

        gui.title._.tweenPlay.start();
        gui.play._.exitTween.start();
        gui.remove._.exitTween.start();
        gui.score._.exitTween.start();
      }),
      sound: UTILS.addButton('sound', CFG.tileSize * .12, CFG.tileSize * 5, 0, .5, .31) // logic in utils.js
    };

    // gui:title
    gui.title.x = gui.title.width * -.5;
    gui.title._.step = 0;

    gui.title._.tween = game.add.tween(gui.title._);
    gui.title._.tween.to({step: 10}, 1000, 'Linear', true);
    gui.title._.tween.onComplete.add(function() {
      gui.title._.step = 0;
      game._.color = UTILS.getJuicyColor();
      gui.title._.tween.start();
    });
    gui.title._.tween.onUpdateCallback(function() {
      gui.title.tint = Phaser.Color.interpolateColor(gui.title.tint, game._.color, 100, gui.title._.step);
    });

    gui.title._.tweenPlay = game.add.tween(gui.title).to({x: -game.width}, 600, 'Quart.easeIn');
    gui.title._.enterTween = game.add.tween(gui.title).to({x: game.width * .5}, 600, 'Quart.easeOut', true);

    // gui:score
    gui.score.alpha = 0;
    gui.score._.enterTween = game.add.tween(gui.score).to({ alpha: 1 }, 400, 'Quart.easeOut', true);
    gui.score._.exitTween = game.add.tween(gui.score).to({ alpha: 0 }, 400, 'Quart.easeIn');

    // gui:play
    gui.play.scale.x = gui.play.scale.y = 0;
    gui.play._.enterTween = game.add.tween(gui.play.scale).to({x: 1, y: 1}, 400, 'Quart.easeOut', true);
    gui.play._.exitTween = game.add.tween(gui.play.scale).to({x: 0, y: 0}, 400, 'Back.easeIn');

    // gui:remove
    gui.remove.scale.x = gui.remove.scale.y = 0;
    gui.remove._.enterTween = game.add.tween(gui.remove.scale).to({x: .36, y: .36}, 400, 'Quart.easeOut', true);
    gui.remove._.exitTween = game.add.tween(gui.remove).to({y: game.height + CFG.tileSize}, 300, 'Quart.easeIn');

    gui.title._.tween.start();
  };

  var bg, gui;
})(STATES = STATES || {});