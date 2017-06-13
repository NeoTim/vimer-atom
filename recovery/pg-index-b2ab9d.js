'use strict';

const cmp = require('component');
const page = require('page');
const dialog = require('tiny-dialog');
const ejs = require('ejs');
const net = require('network');
const logger = require('log');
const Uri = require('simple-uri');
const Marquee = require('marquee');
const $ = require('query');
const _ = require('lod');
const lazying = require('lazying');

const toast = require('../toast');

import open from '../open-window';

const util = require('../common/util.js');
const share = require('../share');

let INDEX_COPY = window.INDEX_COPY;
let INDEX_CODE = window.INDEX_CODE;
const PRIZE = window.PRIZE;

// 弹窗们
const dialogCode = require('../dialog-code/dialog-code');
const dialogRecord = require('../dialog-record/dialog-record');
const dialogGet = require('../dialog-get/dialog-get');
const dialogDownload = require('../dialog-download/dialog-download');
const dialogWinners = require('../dialog-winners/dialog-winners');

const dialogInviteNews = require('../dialog-invite-news/dialog-inivite-news');
const dialogInviteNotNews = require('../dialog-invite-not-news/dialog-inivite-not-news');

const pg = 'index';

module.exports = cmp({
  el: '.cmp-pg-index',
  events: {
    'click .entry-rule': function() {
      logger.logClickRedirect(new Uri().path('../rule').str(), 'rules', {
        pg,
      });
    },
    'click .entry-share': function() {
      share(false, 'fb', 'page');
      logger.logClick('share', {
        pg
      });
    },

    'click .btn-redeem': function() {
      if ($(this.$('.btn-redeem')).hasClass('disabled')) {
        dialogRecord.open();
        return;
      }

      if (util.hasExchange) {
        page.change('prize');
        return;
      }

      net.get('exchange', null, res => {
        if (res && res.code !== '000') {
          toast.info(PRIZE.redeem_fail_tip);
          return;
        }

        page.change('prize');

      }, err => {
        console.log(err);
      });

    },

    'click .remain': function() {
      logger.logClick('prizeleft', {
        pg
      });
      dialogWinners.open();
    },

    'click .btn-share': function() {
      logger.logClick('sharefull', {
        pg
      });
      share(false, 'fb', 'page');
    },

    'click .btn-get': function() {
      if ((util.isUc && util.user.hasUcnewsEnter) || util.isNews) {
        share(true, 'fb', 'invite');
        logger.logClick('newsshare	', {
          pg
        });
        return;
      }

      util.download();
      logger.logClick('downloadafter', {
        pg
      });
    },

    'click .share-txt': function() {
      logger.logClick('newsbrowsershare', {
        pg
      });
      share(true, 'whatsapp_bbn', 'invite');
    },

    'click .entry-enter-code': function() {
      dialogCode.open();
      logger.logClick('newsentercode', {
        pg
      });
    },

    'click .entry-invitation-record': function() {
      logger.logClick('newsinvitationrecord', {
        pg
      });
      dialogRecord.open();
    },

    'click .item-star': function(e) {
      let id = e.currentTarget.getAttribute('data-id');
      logger.logClick('influencer', {
        pg,
        influencerno: parseInt(id, 10) + 1
      });

      if (util.browserType.indexOf('NEWS') < 0) {
        return dialogDownload.open();
      }

      let link = e.currentTarget.getAttribute('data-link');
      open(link);
    }

  },

  init() {},

  render() {
    this.renderCollectCount();
    this.renderRemain();
    this.renderProgress();
    this.renderBtnRedeem();
    this.renderBtnGet();
    this.renderBtnShare();
    this.renderShareTxt();
    this.renderEntryEnterCode();
    this.renderEntryEnterRecord();
    this.renderMarquee();

    this.openDialogInvite();

    if (util.firstEnter()) {
      this.firstAnimate();
      this.toast();
    }
    lazying.check();
  },

  toast() {

    let copy = INDEX_COPY.you_get_it
      .replace(/xxx/, util.convert(util.user.collectCount))
      .replace(/yyy/, util.convert(util.virtualFeeThreshold - util.user.collectCount));

    setTimeout(function() {
      toast.info(copy, {
        delay: 3000
      });
    }, 6000);

  },

  renderCollectCount() {
    $(this.$('.collect-count')).html(util.convert(util.user.collectCount));
  },

  renderRemain() {
    $(this.$('.num')).html(util.remainingPrizesPercent + '%');
  },

  renderProgress() {
    const percent = (util.user.collectCount / util.virtualFeeThreshold).toFixed(2) * 100 + '%';
    this.$('.progress-percent').style.width = percent;
    $(this.$('.done i')).html(util.convert(util.user.collectCount));
  },

  renderBtnRedeem() {
    if (util.hasExchange) {
      $(this.$('.btn-redeem')).html(INDEX_CODE.news_contact);
    }

    if (util.collectStatus) {
      $(this.$('.btn-redeem')).removeClass('disabled');
    } else {
      $(this.$('.btn-redeem')).addClass('disabled');
    }
  },

  renderBtnGet() {
    let status = util.collectStatus ? 'hide' : 'show';
    $(this.$('.btn-get'))[status]();
  },

  renderBtnShare() {
    let status = util.collectStatus ? 'show' : 'hide';
    $(this.$('.btn-share'))[status]();
  },

  renderShareTxt() {
    let status = util.isUc && util.user.hasUcnewsEnter && !util.collectStatus ? 'show' : 'hide';
    $(this.$('.share-txt'))[status]();
  },

  renderEntryEnterCode() {
    let status =  util.isEnded || !util.isShowEnterCode? 'hide' : 'show';
    $(this.$('.entry-enter-code'))[status]();
  },

  renderEntryEnterRecord() {
    let status = (util.isUc && util.user.hasUcnewsEnter) || util.isNews ? 'show' : 'hide';
    $(this.$('.entry-invitation-record'))[status]();
  },

  openDialogInvite() {
    if (util.isEmpty(util.inviteUser) || util.isEnded) return;

    if (((util.isUc && util.user.hasUcnewsEnter) || util.isNews) && util.isShowEnterCode) {
      return dialogCode.open(true);
    }

    if (((util.isUc && util.user.hasUcnewsEnter) || util.isNews) && !util.isShowEnterCode) {
      return dialogInviteNews.open();
    }

    dialogInviteNotNews.open();
  },

  firstAnimate() {
    $(this.$('.box-charge')).addClass('first-time');
  },
  renderMarquee() {
    net.get('winners', null, res => {
      if (res.code !== '000') {
        res.data = [];
      }

      var content = _.map(res.data, item => {
        return INDEX_COPY.subtitle1.replace(/xxx|XXX/, item.nickName)
      }).join('&nbsp;&nbsp;&nbsp;');

      $('#container-marquee').html(INDEX_COPY.subtitle2 + '&nbsp;&nbsp;' + content);

      new Marquee({
        element: document.getElementById('container-marquee'),
        pauseOnHover: false,
        speed: 80,
      });

    }, err => {
      console.log(err);
    });
  },

  enter() {
    this.render();
    this.show();
  },

  exit() {
    this.hide();
  }


});
