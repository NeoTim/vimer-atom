'use strict';

// 后端渲染的数据
var data = window.__data || {};
var dgDraw = require('../../components/dg-draw');

dgDraw.open();

setTimeout(() => {
  dgDraw.close();
}, 3000);
