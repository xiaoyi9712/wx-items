var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = app.globalData.doubanBase
    //只请求3条数据
    var inTheatersUrl = data + "/v2/movie/in_theaters" + "?start=4&count=3";
    var comingSoonUrl = data + "/v2/movie/coming_soon" + "?start=10&count=3";
    var top250Url = data + "/v2/movie/top250" + "?start=14&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "豆瓣Top250")
  },
  onMoreTap(e) {
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: 'more-movie/more-movie?name=' + name,
    })
  },
  onMovieTap(e) {
    var movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId
    })
  },
  getMovieListData(url, settedKey, typeTitle) {
    var that = this
    wx.request({
      url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success(res) {
        that.pocessDoubanData(res, settedKey, typeTitle)
      },
      fail() {
        console.log('失败')
      }
    })
  },
  pocessDoubanData(moviesDouban, settedKey, typeTitle) {
    var movies = [];
    for (var idx in moviesDouban.data.subjects) {
      var subject = moviesDouban.data.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      movies,
      typeTitle: typeTitle
    }
    this.setData(readyData)
  },
  onBindFocus(e) {
    console.log(888,this.data.inTheaters)
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onCancelImgTap(e) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
  onBindConfirm(e) {
    var text = e.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
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