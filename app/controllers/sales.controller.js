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
        finalPrice: req.body.finalPrice,
        quantity: req.body.quantity,
        client: req.body.client
    });

    sales.save((err, sales) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.product) {
            Products.find({
                _id: { $in: req.body.product }
            }, (err, product) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }

                sales.product = product.map(product => product._id);
            });
        }
        if (req.body.salesman) {
            Users.find({
                _id: { $in: req.body.salesman }
            }, (err, user) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }
                sales.salesman = user.map(user => user._id);
                console.log(sales)
                sales.save(err => {
                    if (err) {
                        console.log(err)
                        return res.status(500).send({ message: err });
                    }

                    return res.send({
                        status: 1,
                        message: 'Sale registered successfully'
                    });
                });
            });
        }
    });
}