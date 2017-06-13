'use strict';
require('./page_index.styl'); // 加载样式定义文件

const { h, Component } = require('preact');
const { connect } = require('preact-redux');
const { openModal } = require('@ali/preact-redux-modal');
const { route } = require('@ali/preact-router');
const { Loading } = require('@ali/bucket/components/loading');
const classNames = require('classnames');


const Islands = require('../islands');
const Top = require('../top');
const Progress = require('../progress');
const News = require('../news');
const MyCode = require('../my_code');
const LoadingContent = require('../loading_content');

const BtnPrizeLeft = require('../btns/btn_prize_left');
const BtnEnterCode = require('../btns/btn_enter_code');
const BtnInviteRecords = require('../btns/btn_invite_records');
const BtnGroup = require('../btns/btn_group');


const { MODAL_LOTTERY_PRIZE } = require('../../constants/modal');
const { ACTIVITY_END, SUBMIT_PROFILE_END } = require('../../constants/index');

const resources = require('./resources');

class PageIndex extends Component {
  render({ isLoading, period, la }) {

    // 活动结束则统一跳转到结束页面
    const currentRoute = route.current();
    if ((period === ACTIVITY_END || period === SUBMIT_PROFILE_END) && currentRoute !== 'end') {
      if (currentRoute !== 'profile' || period === SUBMIT_PROFILE_END) {
        return route.go('end');
      }
    }

    if (isLoading) return this.renderLoading(la);
    return this.renderApp(this.props);
  }

  renderLoading(la) {
    return (
      <Loading
        resources={resources[la]}
        spinner={LoadingContent}
        onAfterLoading={this.onAfterLoading}
      />
    );

  }

  renderApp(props) {
    const isNotUCStyle = classNames({ 'not-uc': !props.isUC });
    return (
      <div id="page_index" className={isNotUCStyle}>
        {/* 公共顶部*/}
        <Top />
        <div className="main">
          <MyCode />
          {/* 剩余奖品数按钮 */}
          <BtnPrizeLeft />
          {/* 奖金进度条*/}
          <Islands loadedCallBack={this.loadedCallBack.bind(this)}/>
          {/* 中间按钮组合*/}
          <BtnGroup />
          {/* 输入邀请码 */}
          <BtnEnterCode/>
          {/* 邀请码邀请记录 */}
          <BtnInviteRecords/>
          {/* 操作指引进度条 */}
          <Progress />
        </div>
        <News />
      </div>
    );
  }

  loadedCallBack() {
    // 判断是否中奖，未集满，未展示过
    const storage = require('storage');
    const collectCount = this.props.userStatusData.user.collectCount;
    if (parseInt(collectCount) < 10000) {
      const prizeIdInStore = storage.getLocal('prizeId');
      const prizeId = this.props.userStatusData.gift && this.props.userStatusData.gift.id || '';
      if (prizeId && prizeIdInStore !== prizeId) {
        this.props.openModal(MODAL_LOTTERY_PRIZE);
        storage.setLocal('prizeId', prizeId);
      }
    }
  }
}


function mapStateToProps(state) {
  return {
    userStatusData: state.user.userStatusData,
    isLoading: state.isLoading,
    period: state.context.period,
    la: state.context.la,
    isUC: state.context.isUC,
  };
}

const mapDispatchToProps = {
  openModal,
};


module.exports = connect(mapStateToProps, mapDispatchToProps)(PageIndex);
