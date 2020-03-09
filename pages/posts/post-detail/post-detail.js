var postsData = require('../../../Data/post-data.js')
var app = getApp()//获取全局变量方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { //获取前面传过来的文章id数据
    var postId = options.id
    this.data.id = postId
    var postData = postsData.postList[postId]
    this.setData({
      postData
    })

    var postsCollected = wx.getStorageSync('postsCollected')
    if (postsCollected) {
      this.setData({
        collected: postsCollected[postId]
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('postsCollected', postsCollected)
    }
    var that = this
    wx.onBackgroundAudioPlay(()=>{
      that.setData({
        isPlayingMusic:true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_id = postId
    })

    wx.onBackgroundAudioPause(()=>{
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_id = null
      
    })

    if (app.globalData.g_isPlayingMusic && app.globalData.g_id === postId){
      this.setData({
        isPlayingMusic:true
      })
    }
  },
  onColletionTap: function(e) {
    var postsCollected = wx.getStorageSync('postsCollected')
    var postCollected = postsCollected[this.data.id]
    postCollected = !postCollected
    postsCollected[this.data.id] = postCollected

    wx.setStorageSync('postsCollected', postsCollected)

    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功~' : '取消收藏',
      icon: postCollected ? 'success' : 'none',
      duration: 2000
    })

  },
  
  onShareTap: function(e) {
    let itemList = ['分享到朋友圈', '分享到微信好友', '分享到通讯录好友']

    wx.showActionSheet({
      itemList, 
      success(res) {
        wx.showModal({
          title: '提示',
          content: '用户' + itemList[res.tapIndex]+'功能暂时不可用,请谅解',
        })
      },
    })
  },
  onMusicTap:function(e){
    var id = this.data.id
    var isPlayingMusic = this.data.isPlayingMusic
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
    }else{
      var postDataMusic = postsData.postList[id].music
      wx.playBackgroundAudio({
        dataUrl: postDataMusic.url,
        title: postDataMusic.title,
        coverImgUrl: postDataMusic.coverImg
      })
      this.setData({
        isPlayingMusic:true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})