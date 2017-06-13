'use strict';

const cmp = require('component');
const dialog = require('tiny-dialog');
const toast = require('../toast');
const Form = require('form');
const logger = require('log');

const util = require('../common/util.js');

const CODE_POP = window.CODE_POP;

const pg = 'index';

module.exports = cmp({
  el: '.cmp-dialog-code',
  events: {
    'touchend .btn-submit': function() {
      this.form.submit(() => {
        let ckId = this.fromInvited ? 'newsbeeinvitesubmit' : 'entercodesubmit';
        logger.logClick(ckId, {
          pg
        });
      });
    },
    'touchend .close': function() {
      this.close();
    },
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

    const that = this;

    this.form = new Form({
      el: '#form-code',
      submit: 'support',
      type: 'Get',
      autoload: true,
      onFieldInvalid: function() {
        $(this).addClass('warn');
      },
      onFieldInput: function() {
        $(this).removeClass('warn');
      },
      success(res = {}) {
        if (res.code === '233') {
          toast.info(CODE_POP.friend_collected_all);
          return;
        }

        if (res.code === '232') {
          toast.info(CODE_POP.enter_code_valid);
          return;
        }

        if (res.code === '234') {
          toast.info(CODE_POP.enternamevalid);
          return;
        }


        if (res.code !== '000') {
          toast.info(CODE_POP.enter_code_valid);
          return;
        }

        toast.success(CODE_POP.enter_code_success.replace(/xxx/, res.data.count));

        setTimeout(() => {
          that.close();
          $('.entry-enter-code').hide()
        }, 2000);
      },
      error(err) {
        console.log(err);
      // toast.success('Submitted fail!');
      }
    });

  },

  open(fromInvited = false) {
    this.fromInvited = fromInvited;
    this.i.open();
  },

  close() {
    this.i.close();
  },

  beforeOpen() {},

  afterOpen() {
    if (this.fromInvited) {
      $(this.$('.input-code')).value(util.inviteUser.inviteCode);
    }
  },

  beforeClose() {},

  afterClose() {}

});
