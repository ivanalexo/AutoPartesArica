const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const db = require('./app/models');
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(err => {
        console.log('Cannot connect to database');
        process.exit();
    });

app.get('/', (req, res) => {
    res.json({'message': 'Welcome to Auto Parts Arica'});
});

require('./app/routes/product.routes')(app);
require('./app/routes/user.route')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is listening on port 3000')
});
