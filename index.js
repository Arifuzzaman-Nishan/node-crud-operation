const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;


const password = 'nishanshathi@@';

const uri = "mongodb+srv://nishanshathi:nishanshathi@@@cluster0.azbpt.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000);



/// data base connection

client.connect(err => {
    const ProductCollection = client.db("organicdb").collection("products");

    app.get('/products',(req,res) => {
        ProductCollection.find({})
        .toArray((err,documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:id', (req,res)=> {
        // console.log(req.params.id);
        ProductCollection.find({_id: objectId(req.params.id)})
        .toArray((err,documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addProduct",(req,res) => {
        const product = req.body;
        ProductCollection.insertOne(product)
        .then(result => {
            console.log("data added successfully");
            res.redirect('/');
        })
    })

    app.patch('/update/:id',(req,res)=>{
        ProductCollection.updateOne({_id: objectId(req.params.id)},
        {
            $set: {price: req.body.price , quantity: req.body.quantity}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    app.delete('/delete/:id',(req,res) => {
        ProductCollection.deleteOne({_id: objectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })
    // client.close();
});
