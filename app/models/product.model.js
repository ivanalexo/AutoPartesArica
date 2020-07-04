module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      model: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      description: {
        type: String
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  );

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Products = mongoose.model('products', schema);
  return Products;
};
