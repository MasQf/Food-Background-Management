const imageFiles = require.context('@/assets/food_images', false, /\.jpg$/)
const imagePaths = {}

imageFiles.keys().forEach(key => {
  const imageName = key.split('/').pop().split('.')[0]
  imagePaths[imageName] = imageFiles(key)
})

export default imagePaths
