var util = require('../../../../utils/util.js')
class Movie {
  constructor(url) {
    this.url = url;
  }

  getMovieData(cb) {
    this.cb = cb;
    util.http(this.url, this.pocessDoubanData.bind(this));
  }

  pocessDoubanData(data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.data.directors[0] != null) {
      
      if (data.data.directors[0].avatars != null) {
        director.avatar = data.data.directors[0].avatars.large

      }
      director.name = data.data.directors[0].name;
      director.id = data.data.directors[0].id;
    }
    var movie = {
      movieImg: data.data.images ? data.data.images.large : "",
      country: data.data.countries[0],
      title: data.data.title,
      originalTitle: data.data.original_title,
      wishCount: data.data.wish_count,
      commentCount: data.data.comments_count,
      year: data.data.year,
      generes: data.data.genres.join("、"),
      stars: util.convertToStarsArray(data.data.rating.stars),
      score: data.data.rating.average,
      director: director,
      casts: util.convertToCastString(data.data.casts),
      castsInfo: util.convertToCastInfos(data.data.casts),
      summary: data.data.summary
    }
    this.cb(movie);
  }
}

export {
  Movie
}