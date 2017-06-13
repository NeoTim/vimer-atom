'use strict';

const { h, Component } = require('preact');
const { connect } = require('preact-redux');

const getLocale = require('../../utils/get_locale');
const { fetchWinners } = require('./action');

const isServer = typeof window === 'undefined';
let id = null;


class Marquee extends Component {
  constructor(props) {
    super(props);
  }

  // TODO hack for bug
  shouldComponentUpdate(nextProps) {
    // if (!nextProps) return true;
    // if (nextProps.winners.length > this.props.winners.length) return true;
    // return false;
  }

  componentDidMount() {
    this.props.fetchWinners().then(() => {
      // this.runMarquee();
      this.run();
    });
  }

  run() {
    const dom = isServer ? {} : require('./utils/dom');
    const RAF = isServer ? {} : require('./utils/requestAnimationFrame.js');
    window.requestAnimationFrame = RAF.requestAnimationFrame;

    const $content = this.base.querySelector('.content-marquee');
    const elementWidth = dom.css($content, 'width');
    const element = this.base.querySelector('.container-marquee');
    const width = textWidth(element);
    dom.addClass($content, 'move');
    // setTimeout(() => {
    //   dom.removeClass($content, 'move');
    // }, 10*1000);

    setCss3Style($content, 'transition', 'transform 10s linear');

    setTimeout(() => {
      setTranslateX($content, - width);
      let i = 0;
      setInterval(() => {
        i++
        const value = (i % 2) === 0 ? ( - width) : 0;
        console.log(value);
        setTranslateX($content, value);
        console.log(i);
      }, 10*1000);
    }, 1);

    // dom.css($content, {
    //   transition: 'transform 10s linear',
    //   '-webkit-transition': 'transform 10s linear',
    // });

    // dom.addClass($content, 'move');


    function toCamelCase(str) {
        return str.toLowerCase().replace(/(\-[a-z])/g, function($1) {
            return $1.toUpperCase().replace('-', '');
        });
    }

    function setCss3Style(el, prop, val) {
      const vendors = [
      '-webkit-',
      '-o-',
      '-moz-',
      '-ms-',
      ''
      ];

      console.log(vendors);
        vendors.forEach(function(vendor) {
            var property = toCamelCase(vendor + prop);
            console.log(property);
            el.style[property] = val;
        });
    }

    // $content.addEventListener('transitionend', loopTransition, false);
    // $content.addEventListener('webkitTransitionEnd', loopTransition, false);
    // $content.addEventListener('mozTransitionEnd', loopTransition, false);
    // $content.addEventListener('msTransitionEnd', loopTransition, false);
    // $content.addEventListener('oTransitionEnd', loopTransition, false);
    //
    // $content.addEventListener('oTransitionEnd', loopTransition, false);
    //
    // function loopTransition(e) {
    //   console.log(e.propertyName);
    //   if (e.propertyName === 'transform') {
    //     const className = e.target.className;
    //     if (className.indexOf('move') > -1) {
    //       console.log('has move');
    //       dom.css($content, {
    //         // transition: 'transform 10s linear',
    //         // '-webkit-transition': 'transform 10s linear',
    //         '-webkit-transform': `translateX(-0px)`,
    //       });
    //       dom.removeClass($content, 'move');
    //     } else {
    //       console.log('no move');
    //       dom.addClass($content, 'move');
    //       dom.css($content, {
    //         // 'transition': 'transform 10s linear',
    //         // '-webkit-transition': 'transform 10s linear',
    //         'transform': `translateX(-${width}px)`,
    //         '-webkit-transform': `translateX(-${width}px)`,
    //       });
    //     }
    //   }
    //   console.log(e);
    // }
    //
    // let css = `
    //   .content-marquee {
    //     position: relative;
    //     left: 0;
    //     width: {width}px;
    //     animation: move 10s linear infinite;
    //     -webkit-animation: move 10s linear infinite;
    //   }
    //   @keyframes move {
    //     from {
    //       transform: translateX(0);
    //       -webkit-transform: translateX(0);
    //     }
    //     to {
    //       transform: translateX(-{width}px);
    //       -webkit-transform: translateX(-{width}px);
    //     }
    //   }
    // `;

    // css = css.replace(/{width}/g, width);
    //
    // const head = document.head || document.getElementsByTagName('head')[0];
    // const style = document.createElement('style');
    //
    // style.type = 'text/css';
    //
    // if (style.styleSheet){
    //   style.styleSheet.cssText = css;
    // } else {
    //   style.appendChild(document.createTextNode(css));
    // }

    // head.appendChild(style);

    ///////////////////////////
    function move() {
      var step = speed / 100;
      var x = getTranslateX($content);
      var value = x < -width ? elementWidth : x - step;
      setTranslateX($content, value);
    }

    function animate() {
      move();
      id = requestAnimationFrame(animate);
    }

    function textWidth(elem) {
      var width = 0;
      var tmpElem = dom.createElement();
      dom.css(tmpElem, 'display', 'block');

      // text width may be long
      dom.css(tmpElem, 'width', '10000px');

      var text = dom.text(elem);
      var newElem = dom.createElement(text);
      var paddingLeft = dom.css(elem, 'padding-left');
      var paddinRight = dom.css(elem, 'padding-right');

      dom.css(newElem, 'white-space', 'nowrap');
      dom.appendTo(newElem, tmpElem);
      dom.appendTo(tmpElem, elem);
      width = newElem.offsetWidth + paddingLeft + paddinRight;
      elem.removeChild(tmpElem);
      return width;
    }

    function getTranslateX(element) {
      var key = element.style.transform ? 'transform' : '-webkit-transform';

      if (dom.css(element, key) === 'none') {
        return 0;
      }

      return dom.css(element, key).split(',')[4];
    }

    function setTranslateX(element, value) {
      var x = 'translateX(' + value + 'px)';
      var key = element.style.transform ? 'transform' : '-webkit-transform';
      dom.css(element, key, x);
    }

  }

  componentWillUnmount() {
    // const RAF = isServer ? {} : require('./utils/requestAnimationFrame.js');
    // window.cancelAnimationFrame = RAF.cancelAnimationFrame;
    // cancelAnimationFrame(id);
  }


  runMarquee() {
    const dom = isServer ? {} : require('./utils/dom');
    const RAF = isServer ? {} : require('./utils/requestAnimationFrame.js');
    window.requestAnimationFrame = RAF.requestAnimationFrame;

    const speed = 50;
    const $content = this.base.querySelector('.content-marquee');
    const elementWidth = dom.css($content, 'width');
    const element = this.base.querySelector('.container-marquee');
    const width = textWidth(element);

    animate();

    ///////////////////////////
    function move() {
      var step = speed / 100;
      var x = getTranslateX($content);
      var value = x < -width ? elementWidth : x - step;
      setTranslateX($content, value);
    }

    function animate() {
      move();
      id = requestAnimationFrame(animate);
    }

    function textWidth(elem) {
      var width = 0;
      var tmpElem = dom.createElement();
      dom.css(tmpElem, 'display', 'block');

      // text width may be long
      dom.css(tmpElem, 'width', '10000px');

      var text = dom.text(elem);
      var newElem = dom.createElement(text);
      var paddingLeft = dom.css(elem, 'padding-left');
      var paddinRight = dom.css(elem, 'padding-right');

      dom.css(newElem, 'white-space', 'nowrap');
      dom.appendTo(newElem, tmpElem);
      dom.appendTo(tmpElem, elem);
      width = newElem.offsetWidth + paddingLeft + paddinRight;
      elem.removeChild(tmpElem);
      return width;
    }

    function getTranslateX(element) {
      var key = element.style.transform ? 'transform' : '-webkit-transform';

      if (dom.css(element, key) === 'none') {
        return 0;
      }

      return dom.css(element, key).split(',')[4];
    }

    function setTranslateX(element, value) {
      if (element.className === 'content-marquee') {
        var x = 'translateX(' + value + 'px)';
        var key = element.style.transform ? 'transform' : '-webkit-transform';
        dom.css(element, key, x);
      }
    }

  }


  getMarqueeContent(winners) {
    const { localeKeyNormal, localeKeyEmpty } = this.props;
    return getLocale(localeKeyEmpty);
    if (winners.length < 1) return getLocale(localeKeyEmpty);

    const normalText = getLocale(localeKeyNormal);
    return winners
      .map(winner => (
        normalText
          .replace(/x{2,}/, winner.nickName)
          .replace(/y{2,}/, winner.prizeName)
      ))
      .join('&nbsp;&nbsp;&nbsp;&nbsp;') // 加点空格呗
  }

  render() {
    const { winners } = this.props;
    return (
      <div className="cmp-marquee">
        <i className="icon-message"></i>
        <div className="container-marquee">
          <div
            className="content-marquee"
            dangerouslySetInnerHTML={{__html: this.getMarqueeContent(winners)}}
          >
          </div>
        </div>
      </div>
    );
  }
}

Marquee.defaultProps = {
  localeKeyNormal: '',
  localeKeyEmpty: '',
};

const mapStateToProps = state => {
  return {
    winners: state.marqueeReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWinners() {
      return dispatch(fetchWinners());
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Marquee);
