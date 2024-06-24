// 生成适中的随机颜色
export default function generateRandomColor() {
  // 随机生成亮度适中的颜色
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)

  // 确保颜色值总是六位数
  const hexColor = `#${(`000000${randomColor}`).slice(-6)}`

  return hexColor
}
