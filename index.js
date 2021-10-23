const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const ObjectId = require('mongodb').ObjectId;
const port = 5000;
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello from node , nodemon,mongodb')
})
const uri = "mongodb+srv://first-database_1:7hffH5kEtkMFgTpw@cluster0.aghhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('practice')
        const userCollection = database.collection('users')

        // const result = await userCollection.insertOne(user)
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        });
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query);
            console.log('this is fetch by id.', result)
            res.json(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const update = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: update.name,
                    price: update.price,
                    category: update.category
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
            console.log('put is hitting', update);
        })
        app.post('/users', async (req, res) => {
            const product = req.body;
            const result = await userCollection.insertOne(product)
            res.send(result)
            console.log('post hitting', product)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
            console.log('delete hitting.', result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir)
app.listen(port, () => {
    console.log('This is contain', port)
})