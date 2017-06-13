'use strict';

const cmp = require('component');
const dialog = require('tiny-dialog');
const net = require('network');
const $ = require('query');
const Form = require('form');
const ejs = require('ejs');

const toast = require('../toast');
const recordListTpl =  require('./list-record.html');
const share = require('../share');
const util = require('../common/util.js');
const INVITE_POP = window.INVITE_POP;

module.exports = cmp({
  el: '.cmp-dialog-record',
  events: {
    'touchend .btn-invite': function() {
      if (util.isUc && util.isNews) {
        share(true, 'fb', 'invite');
        return;
      }

      util.download();
    },
  },

  init() {
    this.i = dialog.create({
      el: this.dom,
      dialogClass: 'dialog-code',
      canTouchMove: true
    });

    this.i.on('beforeOpen', this.beforeOpen);
    this.i.on('afterOpen', this.afterOpen);
    this.i.on('beforeClose', this.beforeClose);
    this.i.on('afterClose', this.afterClose);
  },

  open() {
    this.i.open();
  },

  close() {
    this.i.close();
  },

  beforeOpen() {
  },

  afterOpen() {
    net.get('invites', null, res => {
      if (res && res.code !== '000') {
        toast.info('Opps, Something wrong~');
        return;
      }
      let recordList = res.data.inviteRecords;
      $('.list-record').html(ejs(recordListTpl, {recordList, INVITE_POP}))
      $('.invitation-code').html(res.data.inviteCode);
    }, err => {
      console.log(err);
    });

  },

  beforeClose() {
  },

  afterClose() {
  }

});
