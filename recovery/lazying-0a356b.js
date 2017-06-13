'use strict';

var winWidth = window.innerWidth || document.documentnode.clientWidth || document.body.clientWidth;
var winHeight = window.innerHeight || document.documentnode.clientHeight || document.body.clientHeight;

/**
 *  helper
 */

var util = {
  hasClass: function (node, className) {
    var classes = node.className.split(' ');
    return classes.indexOf(className) > -1;
  },

  addClass: function (node, className) {
    var classes = node.className.split(' ');
    if (classes.indexOf(className) < 0) {
      classes.push(className);
    }

    node.className = classes.join(' ');
    return node;
  },

  forEach: function (arr, fn) {
    for (var i = 0; i < arr.length; i++) {
      fn(arr[i], i);
    }
  },

  filter: function (arr, fn) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      if (fn(arr[i], i)) {
        result.push(arr[i]);
      }
    }

    return result;
  },

  bind: function (node, name, listener) {
    node.addEventListener(name, listener, false);
  }
};

/**
 * Public method
 */
function getNodes(cb) {
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.aaa'));
  // return nodes;
  cb(nodes)
}

function getOriginSrc(node) {
  return node.getAttribute('data-src');
}

function setSrc(node, src) {
  util.addClass(node, 'loaded');
  node.setAttribute('src', src);
}

function inView(node) {
  var box = node.getBoundingClientRect();
  return box.top < winHeight && box.left > 0 && box.left < winWidth;
}

/**
 * Public method
 */
function check() {
  getNodes(function (data) {
    var nodes = util.filter(data, function (node) {
      return !util.hasClass(node, 'loaded');
    });

    util.forEach(nodes, function (node) {
      console.log(inView(node));
      if (!inView(node)) {
        return;
      }

      setSrc(node, getOriginSrc(node));
    });

  });
}

function init() {
  util.bind(window, 'scroll', check);
}

module.exports = { init: init, check: check };
