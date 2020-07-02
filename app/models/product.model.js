module.exports = mongoose => {
    var schema = mongoose.Schema(

            {
                code: String,
                name: String,
                model: String,
                description: String,
                price: Number,
                quantity: Number
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
