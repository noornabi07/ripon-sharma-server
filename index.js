const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnuoch3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const reviewCollection = client.db("riponDb").collection("reviews");
    const teamCollection = client.db("riponDb").collection("teams");
    const portfolioCollection = client.db("riponDb").collection("portfolio");

    // Review setting start here
    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })

    app.post('/addreview', async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    })
    // Review setting end here

    // portfolio setting start here

    app.get('/portfolio', async (req, res) => {
      const result = await portfolioCollection.find().toArray();
      res.send(result);
    })

    app.get('/portfolio/:text', async (req, res) => {
      if (req.params.text == "marketing" || req.params.text == "youtube" || req.params.text == "seo") {
        const result = await portfolioCollection.find({ category: req.params.text }).toArray();
        return res.send(result)
      }
      const result = await portfolioCollection.find({}).toArray();
      res.send(result);
    })

    app.get('/port/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await portfolioCollection.findOne(query);
      res.send(result);
    })

    app.post('/addportfolio', async(req, res) =>{
      const newPortfolio = req.body;
      const result = await portfolioCollection.insertOne(newPortfolio);
      res.send(result);
    })

    // portfolio setting end here

    app.get('/team', async (req, res) => {
      const result = await teamCollection.find().toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Ripon sharma is coming..")
})

app.listen(port, () => {
  console.log(`ripon sharma project running port: ${port}`);
})