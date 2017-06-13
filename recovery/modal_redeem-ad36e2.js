'use strict';
const { h, Component } = require('preact');
const { connect } = require('preact-redux');
const Modal = require('@ali/preact-modal');
const { FormattedMessage } = require('@ali/preact-intl');
const { open, close } = require('../../actions/modal');
const { redeem } = require('../../actions/index');
const PrizeImg = require('../prize_img');
const ShareEntry = require('../share_entry');
const { PRIZE_NAME, PREVIEW_DATA } = require('../../constants');
const { changePath } = require('../common/utils');
const isServer = typeof window === 'undefined';
const logger = isServer ? {} : require('log');
const pg = 'index';

require('./modal_redeem.styl'); // 加载样式定义文件

class ModalRedeem extends Component {
  // 常量 PREVIEW_DATA 中对应 index
  getIndex() {
    const { cards } = this.props;
    let index;
    PREVIEW_DATA.forEach((item, key) => {
      if (cards.join('') === item.join('')) {
        index = key;
      }
    });
    return index;
  }

  getPrizeName() {
    const index = this.getIndex();
    return PRIZE_NAME[index];
  }

  getPrizeCode() {
    const { locale } = this.props;
    const index = this.getIndex();
    // 不同国家index对应的Code
    const maps = {
      // 印尼
      id: {
        0: '101',
        1: '102',
        2: '103',
      },

      // 印度
      in: {
        0: '201',
        1: '202',
        2: '203',
      },
    };

    if (locale.indexOf('id') > -1) return maps.id[index]; // 印尼
    return maps.id[index]; // 印度
  }

  titleText() {
    const titleCopy = this.context.getLocale('claimprize.introclaim');
    const prizeName = this.getPrizeName();
    return titleCopy.replace(/x{2,}/, prizeName);
  }

  render(props) {
    const { redeem, cards } = props;
    const code = this.getPrizeCode();
    return (
      <div className="cmp-modal-redeem">
        <Modal
          isOpen={props.isOpen}
          className="modal-redeem"
        >
          <button className="close" onClick={() => props.close()}>close</button>
          <div className="tit"></div>
          <div className="text-center">
            <PrizeImg className={`prize-${code}`} code={code}/>
          </div>
          <h2>
            {this.titleText()}
          </h2>
          <p className="tip">
            <FormattedMessage id="claimprize.introclaim2"/>
          </p>
          <div align="center"><button className="btn btn-redeem" onClick={() => redeem(cards)}>
            <FormattedMessage id="claimprize.claimbutton"/>
          </button>
          </div>
          <ShareEntry
            type="fb"
            localeKey="cashpage.sharecash"
            logParams={{
              ckId: 'shareredeem',
              pg,
            }}
            />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { modal } = state;
  const { locale } = state.context;
  const { cards } = state.user;
  return {
    locale,
    isOpen: modal.MODAL_REDEEM.isOpen,
    cards,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close() {
      dispatch(close('MODAL_REDEEM'));
    },
    redeem(cards) {
      logger.logClick('redeemnow', { pg, type: cards.join('') });
      dispatch(redeem())
        .then(data => { redeemSuccess(data, dispatch); })
        .catch(() => { redeemFail(dispatch); });
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ModalRedeem);

// ////////////////////////////

function redeemSuccess(data, dispatch) {
  const code = data.prize.prizeBrief.code;
  dispatch(close('MODAL_REDEEM'));

  if (code === '101' || code === '201') {
    changePath('cash');
  }

  if (code === '102' || code === '202') {
    changePath('charge');
  }

  if (code === '103' || code === '203') {
    dispatch(open('MODAL_COUPON'));
  }
}

function redeemFail(dispatch) {
  dispatch(open('MODAL_REDEEM_FAIL'));
}
