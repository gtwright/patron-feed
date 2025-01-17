const cloudinary = require("cloudinary").v2;

module.exports = event => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(`${process.env.feedDomain}/ticket${event.largeImagePath}`, {
        folder: "House of Blues Music Forward Foundation",
        width: 2000,
        crop: "limit",
        public_id: event.imgId,
        overwrite: true,
        format: "png"
      })
      .then(function(response) {
        // console.log(response.secure_url);
      })
      .catch(function(err) {
        console.log(err);
        reject(err);
      });
    resolve();
  });
};
