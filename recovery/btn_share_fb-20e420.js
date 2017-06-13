'use strict';

require('./btn_share_fb.styl'); // 加载样式定义文件


const { h, Component } = require('preact');
const { FormattedMessage } = require('@ali/preact-intl');
const { connect } = require('preact-redux');
const { share } = require('../../common/utils');


const { getRandom } = require('@ali/bucket/components/util/index');

const { statUserBehavior } = require('../../../actions/user');

const tIndex = getRandom(0, 9);

class BtnShareFb extends Component {


  share() {
    if (this.props.isUC) {
      return this.shareInvite.call(this);
    }
    return this.shareGame.call(this);
  }


  shareInvite() {
    const { la, na, shareMagic, id } = this.props;
    const pg = 'home';
    const opt = {
      scene: 'share_to_invite',
      // type: 'fb',
      // 切换为whatsapp
      type: 'whatsapp',
      // 统计打点：页面分享
      logParams: {
        ckId: 'sharefb',
        pg: 'home',
      },
      replaces: {
        code: id,
      },
      query: {
        link: { isShare: true, shareType: 'share_to_invite', forcela: la, forcena: na, pg, shareMagic, tIndex, code: id },
        redirect: { isRedirectShare: true, shareType: 'share_to_invite', forcela: la, forcena: na, pg },
      },
    };

    // 用户行为统计
    this.props.statUserBehavior({
      type: 'share',
    });

    share(opt);
  }

  shareGame() {
    const { la, na } = this.props;
    const pg = 'home';
    const opt = {
      scene: 'share_game',
      type: 'fb',
      // 统计打点：页面分享
      logParams: {
        ckId: 'sharefb',
        pg: 'home',
      },
      query: {
        link: { isShare: true, shareType: 'share_game', forcela: la, forcena: na, pg, tIndex },
        redirect: { isRedirectShare: true, shareType: 'share_game', forcela: la, forcena: na, pg },
      },
    };

    // 用户行为统计
    this.props.statUserBehavior({
      type: 'share',
    });

    share(opt);
  }

  render() {
    const { hasUcnewsEnter, hasCollectAll } = this.props;
    if (!hasCollectAll) {
      if (hasUcnewsEnter) {
        return (
          <button type="btn" className="btn" onClick={this.share.bind(this)}>
            <FormattedMessage id="index.news_share"/>
          </button>
        );
      }
      return (
        <button type="btn" className="btn" onClick={this.share.bind(this)}>
          <FormattedMessage id="index.download_share"/>
        </button>
      );
    }
    return null;
  }
}

function mapStateToProps(state) {
  const { hasCollectAll, user, shareMagic } = state.user.userStatusData;
  const { hasUcnewsEnter, id } = user;
  const { la, na, isUC } = state.context;
  return {
    hasCollectAll,
    hasUcnewsEnter,
    shareMagic,
    id,
    la,
    na,
    isUC,
  };
}
const mapDispatchToProps = {
  statUserBehavior,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(BtnShareFb);
