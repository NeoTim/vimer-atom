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
const toast = require('../toast');

import open from '../open-window';

const util = require('../common/util.js');
const share = require('../share');

let INDEX_COPY = window.INDEX_COPY;
let INDEX_CODE = window.INDEX_CODE;



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
    'touchend .entry-rule': function() {
      logger.logClickRedirect(new Uri().path('../rule').str(), 'rules', {
        pg,
      });
    },
    'touchend .entry-share': function() {
      share(false, 'fb', 'page');
      logger.logClick('share', {
        pg
      });
    },

    'touchend .btn-redeem': function() {
      if ($(this.$('.btn-redeem')).hasClass('disabled')) {
        dialogRecord.open();
      } else {
        page.change('prize');
      }
    },

    'touchend .remain': function() {
      logger.logClick('prizeleft', {
        pg
      });
      dialogWinners.open();
    },

    'touchend .btn-share': function() {
      logger.logClick('sharefull', {
        pg
      });
      dialogGet.open();
      share(false, 'fb', 'page');
    },

    'touchend .btn-get': function() {
      // if (util.isUc && !util.firstEnter() && util.isNews) {
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

    'touchend .share-txt': function() {
      logger.logClick('newsbrowsershare', {
        pg
      });
      share(true, 'whatsapp-bbn', 'invite');
    },

    'touchend .entry-enter-code': function() {
      dialogCode.open();
      logger.logClick('newsentercode', {
        pg
      });
    },

    'touchend .entry-invitation-record': function() {
      logger.logClick('newsinvitationrecord', {
        pg
      });
      dialogRecord.open();
    },

    'touchend .item-star': function(e) {
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

  init() {
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

    // by cc
    this.openDialogInvite();
    this.firstAnimate();

    if (util.firstEnter()) {
      this.toast();
    }
  },

  render() {},

  toast() {

    let copy = INDEX_COPY.you_get_it.replace(/xxx/, util.user.collectCount).replace(/yyy/, util.virtualFeeThreshold - util.user.collectCount);

    setTimeout(function() {
      toast.info(copy, {
        delay: 3000
      });
    }, 6000);

  },

  renderCollectCount() {
    $(this.$('.collect-count')).html(util.user.collectCount);
  },

  renderRemain() {
    $(this.$('.num')).html(util.remainingPrizesPercent + '%');
  },

  renderProgress() {
    const percent = (util.user.collectCount / util.virtualFeeThreshold).toFixed(2) * 100 + '%';
    this.$('.progress-percent').style.width = percent;
    $(this.$('.done i')).html(util.user.collectCount);
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
    // let status = util.collectStatus || util.hasExchange ? 'hide' : 'show';
    let status = util.hasExchange ? 'hide' : 'show';
    $(this.$('.btn-get'))[status]();
  },

  renderBtnShare() {
    let status = util.hasExchange ? 'show' : 'hide';
    $(this.$('.btn-share'))[status]();
  },

  renderShareTxt() {
    let status = !util.hasExchange ? 'show' : 'hide';
    $(this.$('.share-txt'))[status]();
  },

  renderEntryEnterCode() {
    let status = util.isShowEnterCode ? 'show' : 'hide';
    $(this.$('.entry-enter-code'))[status]();
  },

  renderEntryEnterRecord() {
    let status = (util.isUc && util.user.hasUcnewsEnter) || util.isNews ? 'show' : 'hide';
    $(this.$('.entry-invitation-record'))[status]();
  },

  openDialogInvite() {
    if (util.isEmpty(util.inviteUser)) return;

    if (((util.isUc && util.user.hasUcnewsEnter) || util.isNews) && util.isShowEnterCode) {
      return dialogCode.open(true);
    }

    if (((util.isUc && util.user.hasUcnewsEnter) || util.isNews) && !util.isShowEnterCode) {
      return dialogInviteNews.open();
    }

    dialogInviteNotNews.open();
  },

  firstAnimate() {
    if (util.firstEnter()) {
      $(this.$('.box-charge')).addClass('first-time');
    }
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
