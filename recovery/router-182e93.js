'use strict';

module.exports = app => {
  // router的前缀，默认以项目名(即package.json的name配置)
  // 如有不同，请自行修改下方配置
  app.router.prefix(`/${app.config.pkg.name}`);

  // 在这里编写路由的绑定
  app.get('/index', app.controller.index.render);
  app.get('/rule', app.controller.rule.render);
  app.get('/u2', app.controller.u2.render);

  app.get('/winners', app.controller.winners);
  app.get('/prizes', app.controller.prizes);
  app.get('/draw', app.controller.draw);
  app.get('/get-user', app.controller.user.get);
  app.get('/update-user', app.controller.user.update);
  app.get('/test', app.controller.user.test);
  app.get('/chance', app.controller.chance.get);
