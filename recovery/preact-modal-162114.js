'use strict';

const { h, Component } = require('preact');
const elementClass = require('element-class');

require('./preact-modal.less'); // 加载样式定义文件

class PreactModal extends Component {
  componentDidMount() {
    const { isOpen } = this.props;
    this.do(isOpen);
  }

  componentWillReceiveProps(nextProps) {
    const { isOpen } = nextProps;
    this.do(isOpen);
  }

  do(isOpen) {
    const action = isOpen ? 'add' : 'remove';
    elementClass(this.base)[action]('is-open');
  }

  render(props) {
    const { children } = props;
    return (
      <div
        className="tiny-dialog"
      >
        <div className="tiny-dialog-content">
          {children}
        </div>
      </div>
    );
  }
}

PreactModal.defaultProps = { isOpen: false };

module.exports = PreactModal;
