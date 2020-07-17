const cloudinary = require('cloudinary');
const {Image} = require('../models/image.model');

const cloudinaryKeys = require('../config/cloudinaryKeys.json');

cloudinary.config({
    cloud_name: cloudinaryKeys.cloud_name,
    api_key: cloudinaryKeys.api_key,
    api_secret: cloudinaryKeys.api_secret
});

exports.create = (req, res) => {
    //const validate = Image.validate(req.body);
    if (!req.body.mime === 'image/jpeg' || !req.body.mime === 'image/png') {
        res.status(500).send({ message: 'Image format not supported' });
        return;
    }
    const file = `data:${req.body.mime};base64,${req.body.data}`;
    
        const response = cloudinary.uploader.upload(file)
            .then(image => {
                console.log(image.public_id);
                console.log(image.url);
                res.status(200).send({
                    id: image.public_id,
                    url: image.url
                });
            })
            .catch(error => {
                console.log(error);
            });
        return response;
}