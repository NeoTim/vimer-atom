'use strict';

const { h } = require('preact'); // 这里必须 引入 preact.h
const { Provider } = require('preact-redux');
const { IntlProvider, addLocaleData } = require('preact-intl');
const App = require('../../components/app-index');

/*
 * 添加中文支持，这里其实是一种hack
 * 因为我们目前的项目需求比较简单，不会用到标准化库提供的大部分功能，而引入标准化库locale-data会加大文件的大小
 * 所以，权衡之后，就先不引入，项目如果需要更加复杂的中文格式化，请使用标准的格式化文件，参考 react-intl/locale-data/zh。
 * 而如果你有更多的语言需求，且不想使用标准化库，请配置以下的locales数组
 */

const locales = ['zh_cn']; // 如果你有更多的语言需求，且不想使用标准化库，请配置以下的locales数组
locales.forEach(locale => addLocaleData({
  locale: locale,
  pluralRuleFunction(n) { return n; },
}));

module.exports = function container(store, intl) {
  console.log(intl);
  const { locale, messages } = intl;
  return (
    <div id="app-inner-container">
      {/* Redux Provide*/}
      <Provider store={store}>
        {/* 多语言Provide, 配置语言编号locale 以及 语言包messages*/}
        <IntlProvider locale={locale} messages={messages}>
          {/* App主体*/}
          <App />
        </IntlProvider>
      </Provider>
    </div>
  );
};
