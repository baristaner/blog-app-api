const path = require('path');

function getImage(imagePath) {
  const imageFilePath = path.join(__dirname, '../uploads', imagePath);
  return imageFilePath;
}

module.exports = {
  getImage,
};
