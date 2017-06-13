'use strict';

var path = require('path');
var lwip = require('lwip');
var jetpack = require('fs-jetpack');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var uuid = require('node-uuid');

var getColor = require('./get-color');
var colorMaps = require('./color-maps')();

var color = require('onecolor');

  // console.log(parseInt('f0f0f0',16));
// console.log(color('#ccc').lighten(-0.25).hex());

module.exports = function() {
  var imagesPath = path.join(__dirname, '..', 'out');

  jetpack
    .find(imagesPath, {matching: ['*.png', '*.PNG']})
    .map(item => path.join(__dirname, '..', item))
    .forEach(item => {
      var cardColor = getColor(item)

      console.log(cardColor);
      // var cardColorValue = toInt(cardColor);

      var finds = _.filter(colorMaps, i => {
        if (
          compare(cardColor[0], i.color[0]) &&
          compare(cardColor[1], i.color[1]) &&
          compare(cardColor[2], i.color[2]) &&
          compare(cardColor[3], i.color[3])
          // compare(cardColor[4], i.color[4]) &&
          // compare(cardColor[5], i.color[5]) &&
          // compare(cardColor[6], i.color[6]) &&
          // compare(cardColor[7], i.color[7]) &&
          // compare(cardColor[8], i.color[8]) &&
          // compare(cardColor[9], i.color[9]) &&
          // compare(cardColor[10], i.color[10])
        ) {
          return true;
        } else {
          return false
        }
      });
      console.log(finds);
    });
};


function toInt(color) {
  return parseInt(color.replace('#', ''), 16);
}

/**
 * 对比两个颜色是否在一定范围相似
 * @param  {Array} source  eg:[ 205, 219, 237 ]
 * @param  {Array} target  eg:[ 204, 217, 242 ]
 * @return {Boolean}
 */
function compare1(source,target) {
  if(
    Math.abs(_.sum(source) - _.sum(target)) < 30
  ) {
    return true;
  }
  return false
}


function compare(source,target) {
  if(
    Math.abs(source[0] - target[0]) < 40
  ) {
    return true;
  }
  return false
}
