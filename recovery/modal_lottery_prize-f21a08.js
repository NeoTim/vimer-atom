'use strict';

require('./modal_lottery_prize.styl'); // 加载样式定义文件


const { h, Component } = require('preact');
const { connect } = require('preact-redux');
const { closeModal } = require('@ali/preact-redux-modal');
const { FormattedMessage } = require('@ali/preact-intl');
const { share } = require('../../common/utils');

const { MODAL_LOTTERY_PRIZE } = require('../../../constants/modal');
const { prizeImageName } = require('../../../constants/prize');

const { randomNum } = require('../../util/utils');
const { getRandom } = require('@ali/bucket/components/util/index');

const tIndex = getRandom(0, 9);
const pg = 'prizepage';


class ModalLotteryPrize extends Component {
  shareCele() {
    const { la, na } = this.props;
    const opt = {
      scene: 'share_cele',
      // type: 'fb',
      // 切换为whatsapp
      type: 'whatsapp',
      logParams: {
        ckId: 'celebsharefb',
        pg,
      },
      query: {
        link: { isShare: true, shareType: 'share_cele', forcela: la, forcena: na, pg, tIndex },
        redirect: { isRedirectShare: true, shareType: 'share_cele', forcela: la, forcena: na, pg },
      },
    };
    share(opt);
  }

  shareGoodNews() {
    const { la, na } = this.props;
    const opt = {
      scene: 'share_good_news',
      // type: 'fb',
      // 切换为whatsapp
      type: 'whatsapp',
      logParams: {
        ckId: 'couponsharefb',
        pg,
      },
      query: {
        link: { isShare: true, shareType: 'share_good_news', forcela: la, forcena: na, pg, tIndex },
        redirect: { isRedirectShare: true, shareType: 'share_good_news', forcela: la, forcena: na, pg },
      },
    };
    share(opt);
  }

  renderCoupon() {
    const imageList = prizeImageName[this.props.la];
    const couponType = this.props.userStatusData.gift.prizeCode;
    const couponCode = this.props.userStatusData.gift.prizeNumber;
    return (
      <div className="cmp-modal-lottery-coupon">
        <button className="close" onClick={() => this.props.closeModal(MODAL_LOTTERY_PRIZE)}></button>
        <div className="pop-content">
          <p className="title"><FormattedMessage id="couponpage.introcoupon"/></p>
        </div>
        <img className="coupon-img" src={imageList[couponType]} alt=""/>
        <div className="coupon-code">
          {this.context.getLocale('couponpage.code').replace('xxx', couponCode)}
        </div>
        <p className="coupon-date"><FormattedMessage id="couponpage.datecoupon"/></p>
        <p className="coupon-tip"><FormattedMessage id="couponpage.conditioncoupon"/></p>
        <div className="wrap-btn">
          <button className="btn" onClick={this.shareGoodNews.bind(this)}><FormattedMessage id="celecard.sharecele"/>
          </button>
        </div>
      </div>
    );
  }

  renderCeleCard() {
    const courageArray = this.context.getLocale('celecard.courage') || [];
    const selectedCourage = randomNum(0, courageArray.length - 1);
    return (
      <div className="cmp-modal-lottery-card">
        <button className="close" onClick={() => this.props.closeModal(MODAL_LOTTERY_PRIZE)}></button>
        <div className="pop-content">
          <b><FormattedMessage id="celecard.celetitle"/></b>
          <span><FormattedMessage id="celecard.celecoupon"/></span>
          <div className="wish-text">{courageArray[selectedCourage]}</div>
        </div>
        <div className="wrap-btn">
          <button className="btn" onClick={this.shareCele.bind(this)}><FormattedMessage id="celecard.sharecele"/>
          </button>
        </div>
      </div>
    );
  }

  render(props) {
    const prizeType = props.userStatusData.gift.prizeCode;
    if (prizeType === '201' || prizeType === '202') {
      return this.renderCoupon.call(this);
    }
    return this.renderCeleCard.call(this);
  }
}

const mapStateToProps = state => {
  return {
    userStatusData: state.user.userStatusData,
    la: state.context.la,
    na: state.context.na,
    isUCBrowser: state.context,
  };
};

const mapDispatchToProps = {
  closeModal,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ModalLotteryPrize);
