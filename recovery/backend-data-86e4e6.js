module.exports = [{
  name: 'data',
  desc: '服务器返回的一个什么数据',
  placeholder: '__BACKEND_DATA__',
  data: {
    "isExchangeFinisheded": false,
    "browserType": "UC_ANDROID_U3", //浏览器版本 UC_NEWS | UC_ANDROID_U3
    "isNews": true, // true | false, //是否News
    "isUc": true, // true | false, //是否UC高版本，高于10.7.0.0版本

    "collectStatus": true, // true | false,   //虚拟话费是否集齐
    "isFirstEnter": true, // true | false, //是否首次进入,//只针对UCNews和UC高版本有效; 其余版本，前端做判断，客户端缓存，不取这个字段
    //如果是UCNews/UC高版本首次进入, 首页展示Get Mine按钮，点击展示首次领取弹窗;

    "virtualFeeThreshold": 1000000, //虚拟话费收集的阈值，达到多少才能兑换正式话费话费
    "remainingPrizesPercent": 80, //剩余奖品百分比，整数值

    "isShowEnterCode": true, // true | false, //是否可以展示Enter Code按钮；UCNews或者用UCNews用户登陆过的UC高版本用户，并且还未帮助过好友，才可以展示

    "hasExchange": false, // true | false, //是否已经兑换真实话费
    "shareMagic": "343434", //当前用户userId分享的加密字符串

    //当前用户的信息
    "user": {
      "nickName": "zhangsan", //当前用户的昵称
      "collectCount": 500000, //已集齐的话费值
      "hasUcnewsEnter": true, // true | false, //是否UC News首次进入
      "hasUcEnter": true, //  true | false, //是否UC Browser首次进入
      "hasHelpFriend": false, // true | false, //是否已经帮助过好友
      "hasProfile": true, // true | false //兑换话费之后，是否已经填写用户信息
    },

    //邀请用户的信息，magic参数为空的时候，inviteUser不存在
    // "inviteUser": {
    //   "inviteCode": 1234567, //邀请码
    //   "collectCount": 1000000  //邀请用户已集齐的话费值 >=virtualFeeThreshold 好友集满
    // },

    //下载说明，特殊版本需要GP下载
    "isGPDownload": true // true | false //是否要GP下载
  }
}];
