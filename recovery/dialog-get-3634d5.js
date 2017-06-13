'use strict';

const cmp = require('component');
const dialog = require('tiny-dialog');
const toast = require('../toast');
const net = require('network');

const util = require('../common/util.js');
const share = require('../share');
const dialogDownload = require('../dialog-download/dialog-download');

module.exports = cmp({
  el: '.cmp-dialog-get',
  events: {
    'touchend .btn-get': function() {
      this.close();
      dialogDownload.open();
    }
  },

  init() {
    this.i = dialog.create({
      el: this.dom,
      dialogClass: 'dialog-code',
      canTouchMove: true
    });

    this.i.on('beforeOpen', this.beforeOpen.bind(this));
    this.i.on('afterOpen', this.afterOpen.bind(this));
    this.i.on('beforeClose', this.beforeClose.bind(this));
    this.i.on('afterClose', this.afterClose.bind(this));
  },

  open() {
    this.i.open();
  },

  close() {
    this.i.close();
  },

  beforeOpen() {},

  afterOpen() {
  },

  beforeClose() {},

  afterClose() {}

});
