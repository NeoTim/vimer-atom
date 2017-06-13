'use strict';

require('./modal_coupon.styl'); // 加载样式定义文件

const { h, Component } = require('preact');
const { connect } = require('preact-redux');
const Modal = require('@ali/preact-modal');
const { FormattedMessage } = require('@ali/preact-intl');
const { close } = require('../../actions/modal');
const ShareEntry = require('../share_entry');
const PrizeImg = require('../prize_img');
const isServer = typeof window === 'undefined';
const logger = isServer ? {} : require('log');
const { PRIZE_NAME } = require('../../constants');
const pg = 'wincoupon';


class ModalCoupon extends Component {
  componentDidMount() {
  }

  getPrizeName(code) {
    const index = this.getIndex(code);
    return PRIZE_NAME[index];
  }

  getIndex(code) {
    return parseInt(code.substr(2, 1)) - 1;
  }

  titleText() {
    const { prize } = this.props;
    const { code } = prize.prizeBrief;
    if (!code) return;
    const titleCopy = this.context.getLocale('couponpage.introcoupon');
    return titleCopy.replace(/x{2,}/, this.getPrizeName(code));
  }

  afterOpen() {
    // 统计： 现金奖领奖页面访问
    logger.logVisit(pg);
  }
  render(props) {
    const { prize } = props;
    const { prizeContent, prizeBrief } = prize;
    const { code } = prizeBrief;
    const { number } = prizeContent;

    return (
      <div className="cmp-modal-coupon">
        <Modal
          afterOpen={this.afterOpen}
          isOpen={props.isOpen}
          className="modal-coupon"
        >
          <button className="close" onClick={() => props.close()}>close</button>
          <div className="tit"></div>
          <div className="text-center">
            <PrizeImg className={`prize-${code}`} code={code}/>
          </div>
          <h2>
            {this.titleText()}
          </h2>
          <div className="coupon-code">
            <span><FormattedMessage id="couponpage.codecoupon"/></span>
              <num>{number}</num>
             <i><FormattedMessage id="myprize.copycode"/></i>
          </div>
          <p className="tip">
            <FormattedMessage id="couponpage.conditioncoupon"/>
            <br />
            <FormattedMessage id="couponpage.datecoupon"/>
          </p>

          <div align="center"><button className="btn btn-redeem" onClick={() => props.close()}>
            <FormattedMessage id="couponpage.submitcoupon"/>
          </button></div>

          <ShareEntry
            type="fb"
            localeKey="cashpage.sharecash"
            logParams={{
              ckId: 'sharecoupon',
              pg,
            }}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { modal, prize } = state;
  const { locale } = state.context;
  const { cards } = state.user;
  return {
    locale,
    isOpen: modal.MODAL_COUPON.isOpen,
    cards,
    prize,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close() {
      logger.logClick('getcoupon', { pg });
      dispatch(close('MODAL_COUPON'));
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ModalCoupon);
