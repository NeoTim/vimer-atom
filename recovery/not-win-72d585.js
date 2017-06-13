'use strict';

const {h, Component} = require('preact');
const {connect} = require('preact-redux');
const {FormattedMessage, FormattedHTMLMessage} = require('@ali/preact-intl');
const Marquee = require('../marquee');

const isserver = typeof window === 'undefined';
const location = isserver ? {} : window.location;

require('./not-win.styl');

class Coupon extends Component {
  componentWillMount() {}

  render(props, state) {
    return (
      <section id="cmp-not-win" class="cmp-not-win" style="display: none;">
        <div class="result">
          <img src={require('../images/not-win.png')} />
        </div>
        <div class=" wrap-try-again">
          <div class="num">
            <FormattedMessage id="index.not_hit_the_jackpot"/>
          </div>
          <div class="btn-shadow">
            <div class="btn-green btn-play-again" onClick={props.playAgain}>
              <FormattedMessage id="index.play_again"/>
            </div>
          </div>
        </div>
        <div class="num tip">
          <FormattedMessage id="index.tomorrow_tip"/>
        </div>
        {/* <div class="btn-shadow">
          <a class="btn-green" href="<%= endurl %>">抽奖结束按钮</a>
        </div> */}
      </section>
      );
  }

}

const mapStateToProps = state => {
  return {
    winners: state.winners
  };
};

const mapDispatchToProps = dispatch => {
  return {
    playAgain() {
      resetDraw();
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Coupon);

// 重置抽奖状态
function resetDraw() {
  const $notWin = document.querySelector('#cmp-not-win');
  let elPrize = document.querySelector('#cmp-shake .gift-wrap');
  let elBox = document.querySelector('#cmp-shake .giftbox');
  let elStar = document.querySelector('#cmp-shake .star');
  let elResult = document.querySelector('#cmp-shake .draw-result');

  $notWin.style.display = 'none';
  // drawing = false;
  elResult.style.display = 'none';
  elPrize.className = 'gift-wrap';
  elBox.className = 'giftbox';
  elStar.className = 'star';
  // elReady.style.display = '';
}
