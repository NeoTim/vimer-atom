'use strict';
const {h, Component} = require('preact');
require('./shake.styl'); // 加载样式定义文件

class Shake extends Component {
  render() {
    return (
      <section class="cmp-shake" end-text="" end-url="">
        <div class="draw-ready">
          <div class="shakebg">
            <div class="gift-wrap">
              <div class="giftbox"></div>
              <div class="giftcup"></div>
            </div>
            <div class="star">
              <span class="ani-star1"></span>
              <span class="ani-star2"></span>
              <span class="ani-star3"></span>
              <span class="ani-star4"></span>
            </div>
          </div>
          <div class="num">
              你有<b class="chance">2</b>次抽奖机会
              你的抽奖机会用完了
          </div>
        </div>

        <div class="draw-result" style="display:none" data-win-img="" data-not-win-img=""></div>
        {/* <audio style="display:none;" class="music" preload="auto" controls="controls" src="images/music_cup.mp3">不支持</audio> */}
      </section>
      );
  }

}


module.exports = Shake;
