const db = require('../models');
const Sales = db.sales;
const Products = db.productos;
const Users = db.users;

exports.create = async (req, res) => {
    if(!req.body.product && !req.body.salesman) {
        res.status(400).send({ message: 'A product and seller must be set'});
        return;
    }

    const sales = new Sales({
        quantity: req.body.quantity,
        client: req.body.client
    });

    if (req.body.product) {
        Products.find({
            _id: { $in: req.body.product }
        }, (err, product) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            sales.product = product.map(product => product._id);
        });
    }

    if (req.body.quantity) {
        Products.find({
            _id: { $in: req.body.product }
        }, (err, product) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            sales.finalPrice = product.map(product => product.price) * req.body.quantity
        });

        let limitQuantity = await Products.find({
            _id: { $in: req.body.product }
        }, (err, product) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            return product.map(product => product.quantity);
        });

        if (req.body.quantity === 0) {
            res.status(500).send({ message: 'Producto no disponible' });
            return;
        }
        if (req.body.quantity > limitQuantity[0].quantity) {
            res.status(500).send({ message: `La cantidad disponible es: ${limitQuantity[0].quantity}`});
            return;
        } else {
            let updateQuantity = {
                quantity:  Math.abs(req.body.quantity - limitQuantity[0].quantity)
            }
            Products.findByIdAndUpdate(req.body.product, updateQuantity, { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: 'Cannot update product'
                        });
                    } 
                })
                .catch(err => {
                    res.status(500).send({
                        message: err
                    });
                    return;
                });
        }
    }

    if (req.body.salesman) {
        Users.find({
            _id: { $in: req.body.salesman }
        }, (err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            sales.salesman = user.map(user => user._id);
            sales
                .save(sales)
                .then(() => {
                    res.send({
                        status: 1,
                        message: 'Sale registered successfully'
                    });
                    return;
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'Error to save a sale'
                    });
                    return;
                })
        });
    }

}