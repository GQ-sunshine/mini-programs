const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const randomColor = () => {
  const colorList = ['#4285f4', '#0a66c2', '#333333', '#1da1f2'];
  const randomIndex = Math.floor(Math.random() * colorList.length);
  const color = colorList[randomIndex];
  return color;
}

module.exports = {
  formatTime,
  randomColor
}
