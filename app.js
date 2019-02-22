//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var wechid = "";
    var userSession = wx.getStorageSync('user');
    if (userSession && userSession['expires_in']) {
      wechid = userSession['openid'];
      wx.setStorageSync('wechid', wechid);
      this.globalData.wechid = wechid;
    } else {
      wx.login({
        success: res => {
          if (res.code) {
            var code = res.code;
            wx.setStorageSync('code', code);
            console.log("code" + code);
            var that = this;
            var d = that.globalData;//这里存储了appid、secret、token串    
            var url = d.host + "applet/api";
            var post_data = {
              orgId: d.orgId, code: code, grant_type: 'authorization_code'
            };
            wx.request({
              url: url,
              headers: {
                'Content-Type': 'application/json'
              },
              data: post_data,
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT     
              success: function (res) {
                if (res) {
                  var jsonData = res['data']['DATA'];
                  if (jsonData) {
                    jsonData = JSON.parse(jsonData);
                    var obj = {};
                    wechid = jsonData['openid'];
                    obj.openid = wechid;
                    obj.expires_in = Date.now() + 3600*2*24;
                    // wx.setStorageSync('wechid', wechid);
                    that.globalData.wechid = wechid;
                    wx.setStorageSync('user', obj);//存储openid     
                  }
                  var user = res['data']['USER'];
                  if (user['ORGGUID']) {
                    that.globalData.orgId = user['ORGGUID'];
                    that.globalData.orgName = user['COMNAME'];
                    that.globalData.phone = user['PHONE'];
                    that.globalData.userName = user['USERNAME'];
                    wx.setStorageSync('userImg', user['IMG']);//存储用户头像

                  }
                }
              }
            });
            // wx.getUserInfo({
            //   success: function (res) {
            //     wx.setStorageSync('userinfo_iv', res.iv);
            //     wx.setStorageSync('userInfo', res.userInfo);
            //   }
            // });
            // 获取用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      wx.setStorageSync("authorizeState", 1);
                      // 可以将 res 发送给后台解码出 unionId
                      this.globalData.userInfo = res.userInfo
                         this.globalData.userInfo = wx.getStorageSync('userInfo') ;

                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }

                      wx.setStorageSync('userinfo_iv', res.iv);
                      wx.setStorageSync('userInfo', res.userInfo);
                    }
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/userAuthorize/userAuthorize',
                  })
                }
              }
            })
          }
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
    }
    // // 登录
    // wx.getUserInfo({
    //   success: function (res) {
    //     wx.setStorageSync('res', res.userInfo.avatarUrl);
    //     var userInfo = res.userInfo
    //     var nickName = userInfo.nickName
    //     var avatarUrl = userInfo.avatarUrl
    //     var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //     var province = userInfo.province
    //     var city = userInfo.city
    //     var country = userInfo.country
    //   }
    // }),
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            console.log("已授权");
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync("authorizeState", 1);
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          } else {
            console.log("未授权");
            wx.redirectTo({
              url: '/pages/userAuthorize/userAuthorize',
            })
          }
        }
      })
  },onbind:function(){
  },

  globalData: {
    userInfo: null,
    code: '',
    host: 'https://im.yiyao365.cn/',
    userinfo_encryptedData: '',
    userinfo_iv: '',
    userInfo: '',
    user: '',
    formShowView: true,
    // orgId: 'LY20JP',//再康信息
    // appid: 'wxa9c45d1ceb731a6e',//再康信息
    // secret: 'maf5007933c4maf5007933c4maf50079',
     orgId: 'LY20JP',//再康信息
     appid: 'wx887e071a461d8a7c',//再康信息
     secret: '39fd115e8139f2e7a42ee07568ed170c',
    //再康信息
    // orgId: '888888',//公司信息
    // appid: 'wx83e46e23f56a92e4',//公司信息
    // secret: 'cf2180ef4b8806373250b623f63722e8',//公司信息
    //orgId: '888888',//会议小程序公司信息
    //appid: 'wx0539aca0b9168c22',//会议小程序公司信息
    //secret: '6b276df2cbcd498b691e0d89d0ee7ef5',//会议小程序公司信息
    orgName: '',
    phone: '',
    userName: '',
    wechid:''
  }
})