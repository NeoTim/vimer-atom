'use strict';
const {h, Component} = require('preact');
const {FormattedMessage} = require('@ali/preact-intl');
require('./gallery.styl');

class Gallery extends Component {
  render() {
    return (
      <section class="cmp-gallery">
          <dl>
              <dt class="">我的奖品 <em></em></dt>
              <dd>
                  <ul class="prize-list">
                      <center>加载中...</center>
                  </ul>
              </dd>
          </dl>
      </section>
    );
  }
}

module.exports = Gallery;
