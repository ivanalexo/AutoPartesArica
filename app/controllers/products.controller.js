const db = require('../models');
const Products = db.productos;
const ImageController = require('../controllers/image.controller');

exports.create = async (req, res) => {
  let img = {}
  if (!req.body.code && !req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  img = {
    id: !("id" in req.body.image) ? undefined : req.body.image.id,
    src: !("src" in req.body.image) ? undefined : req.body.image.src
  }
  
  const product = new Products({
    code: req.body.code,
    name: req.body.name,
    model: req.body.model,
    image: img,
    description: req.body.model,
    price: req.body.price,
    quantity: req.body.quantity
  });

  product
    .save(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'An error occurred while creating the product'
      });
    });
};

exports.findAll = (req, res) => {
  const code = req.query.code;
  var condition = code ? { code: { $regex: new RegExp(code), $options: 'i' } } : {};

  Products.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retriving products'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: 'Not found product with id ' + id });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: 'Error retriving product with id ' + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty'
    });
  }

  const id = req.params.id;

  Products.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: 'Cannot update Product'
      });
    } else res.send({ message: 'Product was updated succesfully' });
  })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Product wit id ' + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Products.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: 'Cannot delete'
        });
      } else res.send({ message: 'Product was deleted succesfully' });
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete this product'
      });
    });
};

exports.deleteAll = (req, res) => {
  Products.deleteMany({})
  then(data => {
    res.send({
      message: `${data.deletedCount} Productss were deleted`
    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while deleting'
      });
    });
};
