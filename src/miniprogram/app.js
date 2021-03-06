const regeneratorRuntime = require('./libs/regenerator-runtime/runtime-module');
const { login } = require('./utils/login');

App({
  onLaunch: async function () {
    wx.setStorageSync('token', '');
    let token = '';
    // 登录
    try {
      token = await login();
    } catch(e) {
      // console.log(e);
      wx.showToast({
        title: e + '，将无法使用收藏夹和听音选字功能',
        icon: 'none',
        duration: 2000
      })
    }
    // 存储token
    try {
      wx.setStorageSync('token', token);
      // let token1 = wx.getStorageSync('token') || ''
      // console.log(token1);
    } catch(e) {
      console.log(e);
      wx.showToast({
        title: '程序错误，将无法使用收藏夹和听音选字功能',
        icon: 'none',
        duration: 2000
      })
    }
    wx.setInnerAudioOption({obeyMuteSwitch: false});
    wx.loadFontFace({
      family: 'alifont',
      source: 'url("data:font/truetype;charset=utf-8;base64,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")',
      global: true
    })
  }
})
