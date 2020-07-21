/*jshint -W008 */
// FIXME: remove all stuff from window scope
(function(STATES){
  'use strict';

  STATES.level = function() {};
  STATES.level.prototype.init = function() { console.debug('[ LEVEL ]') };
  STATES.level.prototype.preload = function() {};
  STATES.level.prototype.render = function() {
    // game.debug.text(game._.collected, 10, 10);
    // game.debug.text(game._.fruitsOnGrid, 10, 20);
  };

  STATES.level.prototype.create = function() {
    // scoreX
    scoreX = game.width * .5 + 50;

    // Bg
    bg = game.add.image(0, 0, 'bg');

    // Gui
    gui = {
      scoreColorStep: 0,
      scoreFx: UTILS.write('', game.width * .5, 46, .5, .5, 'left', 1, game._.color),
      score: UTILS.write(game._.score + ' pts', scoreX, 50, .5, .5, 'left', 1, game._.color),
      combo: UTILS.write('', game.width * .5, game.height * .5, .5, .5, 'center', 1, game._.color),
      home: UTILS.addButton('home', CFG.tileSize * .12, CFG.tileSize * 4, 0, .5, .31, function() {
        gui.score._.exitTween.start();
        cleanLevel(function() { game.state.start('menu') });
      }),
      sound: UTILS.addButton('sound', CFG.tileSize * .12, CFG.tileSize * 5, 0, .5, .31) // logic in utils.js
    };

    // gui:scoreFx
    gui.scoreFx._.scaleTween = game.add.tween(gui.scoreFx.scale).to({x: 1.2, y: 2}, 400, 'Linear');
    gui.scoreFx._.alphaTween = game.add.tween(gui.scoreFx).to({alpha: 0, y: gui.scoreFx.y - CFG.tileSize * .5}, 400, 'Linear');

    // gui:score
    gui.score._.enterTween = game.add.tween(gui.score).to({x: scoreX}, 600, 'Quart.easeOut');
    gui.score._.exitTween = game.add.tween(gui.score).to({x: -game.width}, 600, 'Quart.easeIn');
    if (!game._.collected) {
      gui.score.x = scoreX;
      gui.score._.enterTween.start();
    }

    gui.score._.colorTween = game.add.tween(gui).to({scoreColorStep: 100}, 1000, 'Linear');
    gui.score._.colorTween.onUpdateCallback(function() {
      gui.score.tint = Phaser.Color.interpolateColor(gui.score.tint, game._.color, 100, gui.scoreColorStep);
    });

    // gui:combo
    gui.combo._.scaleTween = game.add.tween(gui.combo.scale).to({x: 3, y: 3}, 360, 'Expo.easeIn');
    gui.combo._.alphaTween = game.add.tween(gui.combo).to({alpha: 0}, 360, 'Expo.easeIn');
    gui.combo._.alphaTween.onComplete.add(function() {
      gui.combo.scale.x = 0;
      gui.combo.scale.y = 0;
      gui.combo.alpha = .7;
    });


    game._.locked = false;

    // Reset stats - must be after score animation
    game._.combo = 0;
    game._.collected = 0;
    game._.color = game._.color || UTILS.getJuicyColor();
    game._.fruitsOnGrid = Math.min(24, 6 + game._.currLvl * 2);

    // Generate map
    fruits = generateMap(game._.fruitsOnGrid, 24);

    // Layers
    game.world.bringToTop(gui.combo);
  };

  var _tmp, fruits = [], selectedFruits = [], gui, bg, scoreX;

  function generateMap(items, cells) {
    _tmp = [];
    for (var i = 0; i < items * .5; i++) {
      _tmp.push(CFG.fruits[i] || game.rnd.pick(CFG.fruits));
      _tmp.push(_tmp[_tmp.length - 1]);
    }

    return Phaser.ArrayUtils.shuffle(_tmp.concat(new Array(cells - items))).map(function(e, index) {
      if (!e) return;
      if (typeof _tmp !== 'number') _tmp = 0;
      _tmp++;

      // Fruit
      e = game.add.image(0, 0, e);
      e.name = e.key;
      e.anchor.set(.5);
      e.x = CFG.tileSize * (index%6) + CFG.tileSize * 1.5;
      e.y = CFG.tileSize * Math.floor(index/6) + CFG.tileSize * 2;
      e.alpha = 0;

      // Cover
      e._ = {
        cover: game.add.image(e.x, e.y, 'cover'),
        tween: {
          clean: game.add.tween(e).to({y: game.height + e.height}, 400, 'Quart.easeIn')
        },
        reveal: function() {
          if (this.cover._.locked) return;

          this.cover._.stopAllTweens();

          this.cover._.locked = true;
          this.cover._.tween.scaleClick.start();
          this.cover._.tween.alphaClick.start();
        },
        vanish: function() {
          if (!this.cover._.locked) return;

          this.cover._.stopAllTweens();

          this.cover._.locked = false;
          this.cover._.tween.scale.start();
          this.cover._.tween.alpha.start();
        }
      };
      e._.cover._ = {
        fruit: e,
        tween: {
          scale: game.add.tween(e._.cover.scale).to({x: 1, y: 1}, 300, 'Quart.easeOut'),
          alpha: game.add.tween(e._.cover).to({alpha: 1}, 300, 'Quart.easeOut'),
          scaleClick: game.add.tween(e._.cover.scale).to({x: 1.1, y: 1.1}, 600, 'Quart.easeOut'),
          alphaClick: game.add.tween(e._.cover).to({alpha: 0}, 600, 'Quart.easeOut')
        },
        stopAllTweens: function() {
          var tweens = this.tween;
          Object.keys(tweens).forEach(function(t) { tweens[t].stop(); tweens[t].pendingDelete = false; });
        }
      };

      e._.cover.anchor.set(.5);
      e._.cover.tint = 0xEEEEEE;
      e._.cover.scale.x = 0;
      e._.cover.scale.y = 0;

      // Tween
      game.time.events.add(_tmp * 60, function() {
        game.add.tween(e._.cover.scale).to({x: 1, y: 1}, 200, 'Quart.easeOut', true);
        game.add.tween(e._.cover).to({alpha: 1}, 200, 'Quart.easeOut', true).onComplete.add(function() {
          e.alpha = 1;

          e._.cover.inputEnabled = true;
          e._.cover.events.onInputDown.add(onCoverClick);
          e._.cover.events.onInputOver.add(onCoverOver);
          e._.cover.events.onInputOut.add(onCoverOut);
        });
      }).autoDestroy = true;

      return e;
    });
  }

  function onCoverClick(c) {
    if (c._.locked) return;

    // 2 selected, unselect all
    if (selectedFruits.length === 2) {
      selectedFruits.forEach(function(f) { f._.vanish() });
      selectedFruits.length = 0;
    }

    // Select
    c._.fruit._.reveal();
    game.sound.play('click', .8);
    selectedFruits.push(c._.fruit);

    // Match
    if (selectedFruits.length === 2) {
      if (selectedFruits[0].name === selectedFruits[1].name) {
        game.sound.play(game._.combo ? 'match' : 'match2', .8);
        game._.combo++;
        score(CFG.pts.match * game._.combo + game._.currLvl);
        selectedFruits.length = 0;
      } else {
        game._.combo = 0;
        gui.combo.text = '';

        // Punishment
        if (game._.score > 0) {
          score(-1);
        }
      }
    }
  }
  function onCoverOver(c) { c.tint = 0xFFFFFF }
  function onCoverOut(c) { c.tint = 0xEEEEEE }

  function score(pts) {
    // Rewand
    if (pts >= 0) {
      game._.collected += 2;

      // Won game ?
      if (game._.collected === game._.fruitsOnGrid) {
        game.time.events.add(1000, function() { cleanLevel(nextLevel) }).autoDestroy = true;
        game.sound.play('clapping');
        game.sound.play('win', .7);

        // Level bonus per win
        pts += game._.currLvl * 10 + CFG.pts.win;
      }
    } else {
      // Punishment - missing match
    }

    game._.score += pts;

    // Score text animation
    gui.score.text = game._.score + ' pts';

    gui.scoreFx.y = gui.score.y;
    gui.scoreFx.scale.x = 1;
    gui.scoreFx.scale.y = 1;
    gui.scoreFx.alpha = 1;
    gui.scoreFx.text = pts >= 0 ? '+' + pts : pts;
    gui.scoreFx.tint = gui.score.tint;

    gui.scoreFx._.alphaTween.start();
    gui.scoreFx._.alphaTween.start();

    gui.scoreColorStep = 0;
    game._.color = UTILS.getJuicyColor();

    gui.score._.colorTween.start();

    // Combo text
    gui.combo.scale.x = 1;
    gui.combo.scale.y = 1;
    gui.combo.tint = UTILS.getJuicyColor();
    gui.combo.text = game._.combo > 1 ? 'COMBO\nx' + game._.combo : '';

    gui.combo._.scaleTween.start();
    gui.combo._.alphaTween.start();
  }

  function cleanLevel(callback) {
    // Trim
    if (game._.fruitsOnGrid < 24) {
      fruits.sort();
      fruits.splice(fruits.indexOf(), fruits.length - fruits.indexOf());
    }

    // Animate
    fruits.forEach(function(e, index) {
      game.time.events.add(index * 100, function() {
        e._.tween.clean.start();
        e._.cover._.locked = true;

        e._.cover._.tween.scaleClick.start();
        e._.cover._.tween.alphaClick.start();
      }).autoDestroy = true;
    });

    game.time.events.add(fruits.length * 100 + 400, function() {
      if (callback) callback();
    }).autoDestroy = true;
  }

  function nextLevel() {
    if (game._.locked) return;
    game._.locked = true;
    game._.currLvl++;
    restartLevel();
  }

  function restartLevel() {
    game.state.clearCurrentState();
    game.state.restart();
  }

})(STATES = STATES || {});