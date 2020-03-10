// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: "",
    movies:{},
    requestUrl:"",
    totalCount:0,
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = app.globalData.doubanBase
    var name = options.name;
    this.data.navigateTitle = name;
    switch (name) {
      case "正在热映":
        var inTheatersUrl = data + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        var inTheatersUrl = data + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        var inTheatersUrl = data + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = inTheatersUrl
    util.http(inTheatersUrl, this.pocessDoubanData)
  },
  pocessDoubanData(moviesDouban) {
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
    var totalMovies = {}
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.data.isEmpty = false
    }
    this.setData({
      movies:totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading()
  },
  onScrollLower(e){
    var nextUrl = this.data.requestUrl+
    "?start="+this.data.totalCount + "&count=20";
    util.http(nextUrl, this.pocessDoubanData)
    wx.showNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
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