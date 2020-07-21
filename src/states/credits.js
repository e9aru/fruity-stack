/*jshint -W008 */

(function(STATES) {
  'use strict';

  STATES.credits = function() {};
  STATES.credits.prototype.init = function() { console.debug('[ CREDITS ]') };
  STATES.credits.prototype.create = function() {
    // Bg
    bg = game.add.image(0, 0, 'bg');

    // Gui
    gui = {
      text: UTILS.write('Heroicode Game Studio', game.width * .5, CFG.tileSize * 3, .5, .5, 'center', .6, 0xFFDD33),
      text2: UTILS.write('heroicode.com\n@heroicode', game.width * .5, CFG.tileSize * 5, .5, .5, 'center', .3, 0x010101),
      title: UTILS.write('Credits', 0, 46, .5, .5, 'center', 1, UTILS.getJuicyColor()),
      home: UTILS.addButton('home', CFG.tileSize * .12, CFG.tileSize * 4, 0, .5, .31, function() {
        gui.title._.exitTween.onComplete.addOnce(function() { game.state.start('menu') });
        gui.title._.exitTween.start();
        gui.text._.exitTween.start();
        gui.text2._.exitTween.start();
      }),
      sound: UTILS.addButton('sound', CFG.tileSize * .12, CFG.tileSize * 5, 0, .5, .31) // logic in utils.js
    };

    gui.title._.enterTween = game.add.tween(gui.title).to({x: game.width * .5}, 600, 'Quart.easeOut', true);
    gui.title._.exitTween = game.add.tween(gui.title).to({x: -game.width}, 600, 'Quart.easeIn');

    gui.title.x = gui.title.width * -.5;

    // gui:text
    gui.text.alpha = 0;
    gui.text._.enterTween = game.add.tween(gui.text).to({ alpha: 1 }, 400, 'Quart.easeOut', true);
    gui.text._.exitTween = game.add.tween(gui.text).to({ alpha: 0 }, 400, 'Quart.easeIn');

    // gui:text2
    gui.text2.alpha = 0;
    gui.text2._.enterTween = game.add.tween(gui.text2).to({ alpha: 1 }, 400, 'Quart.easeOut', true);
    gui.text2._.exitTween = game.add.tween(gui.text2).to({ alpha: 0 }, 400, 'Quart.easeIn');
  };




  var bg, gui = 1;
})(STATES = STATES || {});