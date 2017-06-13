'use strict';
const {h, Component} = require('preact');
const {FormattedMessage} = require('preact-intl');
require('./marquee.styl');

class Marquee extends Component {
  render() {
    return (
      <div class="cmp-marquee">
        <FormattedMessage id="i18n"/>
      </div>
      );
  }

}

module.exports = Marquee;
