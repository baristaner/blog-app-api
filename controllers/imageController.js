const imageService = require('../services/imageService');

function getImage(req, res) {
  const imagePath = req.params.imagePath;
  try {
    const imageFilePath = imageService.getImage(imagePath);
    res.sendFile(imageFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getImage,
};
