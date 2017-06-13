'use strict';

const { h, Component } = require('preact');
const { connect } = require('preact-redux');
const { FormattedMessage } = require('@ali/preact-intl');
const { like } = require('../../actions');
const Modal = require('../preact-modal');
require('./page-index.styl'); // 加载样式定义文件

class PageIndex extends Component {
  render() {
    const likeNumber = this.props.likeNumber.toString();
    const isOpen = false;
    return (
      <div id="page-index">
        <Modal
          isOpen={isOpen}
        >
          <div>这是一个弹窗</div>
        </Modal>
        <div className="content">
          {/* 引用图片请使用 require('./path/to/image') */}
          <img alt="logo" src={require('../images/omelette-logo.jpg')} style={{ width: '100%' }} />
          {/* 多语言示例， id表示使用那一个语言的id */}
          <FormattedMessage id="welcome"/>
          <div>
            <button type="button" onClick={this.props.like} disabled={this.props.liked}>
              {this.props.liked ? <FormattedMessage id="liked"/> : <FormattedMessage id="like"/>}
            </button>
            <div><FormattedMessage id="likeNumber" values={{ likeNumber }}/></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const likeState = state.like;
  return {
    likeNumber: likeState.likeNumber,
    liked: likeState.liked,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    like() {
      // 发出 like 的action, 而具体的业务逻辑是在 reducers/like.js 进行定义的
      dispatch(like());
    },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(PageIndex);
