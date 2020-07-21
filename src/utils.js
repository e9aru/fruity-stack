/*jshint -W008 */

var UTILS = (function() {
  'use strict';

  function write(text, x, y, aX, aY, align, scale, color, onClick) {
    var _tmp;
    text = '' + text;
    x = x || 0;
    y = y || 0;
    aX = aX || 0;
    aY = aY || 0;
    scale = scale || 1;

    _tmp = null;
    _tmp = game.add.bitmapText(x, y, 'default', text, scale * CFG.fontSize);
    _tmp.anchor.set(aX, aY);

    if (align) _tmp.align = align;
    if (color) _tmp.tint = color;
    if (onClick) {
      _tmp.inputEnabled = true;
      _tmp.events.onInputDown.add(onClick);
    }

    _tmp._ = {};

    return _tmp;
  }

  function getJuicyColor() {
    return Phaser.Color.getColor.apply(null, Phaser.ArrayUtils.shuffle([game.rnd.integerInRange(100, 180), game.rnd.integerInRange(200, 255), game.rnd.integerInRange(220, 255)]));
  }

  function addButton(type, x, y, aX, aY, scale, onClick) {
    var _tmp;
    if (['play', 'sound', 'remove', 'home', 'info'].indexOf(type) === -1) throw 'Bad button type: ' + type;

    scale = scale || 1;
    x = x || 0;
    y = y || 0;
    aX = aX || 0;
    aY = aY || 0;

    _tmp = null;
    _tmp = game.add.sprite(x, y, 'buttons', 0);
    _tmp.scale.x = scale;
    _tmp.scale.y = scale;
    _tmp.anchor.set(aX, aY);

    _tmp._ = {
      frame: {
        default: 0,
        hover: 1,
        mute: 0
      }
    };

    switch (type) {
      case 'info':
        _tmp._.frame.default = 2;
        _tmp._.frame.mute = 2;
        _tmp._.frame.hover = 3;
        break;

      case 'play':
        _tmp._.frame.default = 4;
        _tmp._.frame.mute = 4;
        _tmp._.frame.hover = 5;
        break;

      case 'remove':
        _tmp._.frame.default = 7;
        _tmp._.frame.mute = 7;
        _tmp._.frame.hover = 6;
        break;

      case 'sound':
        _tmp._.frame.default = 8;
        _tmp._.frame.hover = 9;
        _tmp._.frame.mute = 10;
        break;

      default: //home
        break;
    }

    _tmp.frame = _tmp._.frame.default;
    if (type === 'sound' && game.sound.mute) _tmp.frame = _tmp._.frame.mute;

    _tmp.inputEnabled = true;
    _tmp.events.onInputOver.add(function() { _tmp.frame = _tmp._.frame.hover });
    _tmp.events.onInputOut.add(function() { _tmp.frame = game.sound.mute ? _tmp._.frame.mute : _tmp._.frame.default });
    _tmp.events.onInputDown.add(function() {
      // Sound
      if (type === 'sound') {
        game.sound.mute = !game.sound.mute;
      }

      game.sound.play('click');
      if (onClick) onClick();
    });

    return _tmp;
  }

  return {
    write: write,
    getJuicyColor: getJuicyColor,
    addButton: addButton
  };
})();