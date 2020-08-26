const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');
const Role = db.role;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());


db.mongoose
  .connect(process.env.MONGODB_URI || db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to database!');
    initial();
  })
  .catch(err => {
    console.log('Cannot connect to database');
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.error('error: ', err);
        }
        console.log('Added user to roles collection');
      });

      new Role({
        name: 'employee'
      }).save(err => {
        if (err) {
          console.error('Error: ', err);
        }
        console.log('Added employee to role collection');
      });

      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.error('Error:', err);
        }
        console.log('Added admin role to collection');
      });
    }
  })
}

app.get('/', (req, res) => {
  res.json({ 'message': 'Welcome to Auto Parts Arica' });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/product.routes')(app);
require('./app/routes/user.route')(app);
require('./app/routes/image.routes')(app);
require('./app/routes/sales.route')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is listening on port 3000')
});
