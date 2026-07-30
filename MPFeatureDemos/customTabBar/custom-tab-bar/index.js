Component({
  data: {
    selected: 0,
    color: "#123321",
    selectedColor: "#3cc51f",
    list: [
      {
        "pagePath": "/pages/index/index",
        "text": "Index",
        "iconPath": "/image/cup.png",
        "selectedIconPath": "/image/cup-select.png"
      }, {
        "pagePath": "/pages/second/second",
        "iconPath": "/image/hourse.png",
        "selectedIconPath": "/image/hourse-select.png",
        "text": "Second"
      }, {
        "pagePath": "/pages/third/third",
        "iconPath": "/image/movie.png",
        "selectedIconPath": "/image/movie-select.png",
        "text": "Third"
      }]
  },
  pageLifetimes: {
    show() {
      this.updateSelectedTab();
    }
  },
  attached() {
    this.updateSelectedTab();
  },
  methods: {
    updateSelectedTab() {
      const pages = getCurrentPages();
      if (!pages.length) return;
      const currentPage = pages[pages.length - 1].route.toLocaleLowerCase();
      const currentPagePath = currentPage;
      for (let i = 0; i < this.data.list.length; i++) {
        const listPath = this.data.list[i].pagePath.replace(/^\//, '').toLowerCase();
        if (listPath === currentPagePath) {
          this.setData({ selected: i });
          return;
        }
      }
    },
    tabClick(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({
        selected: data.index
      })
    }
  }
})