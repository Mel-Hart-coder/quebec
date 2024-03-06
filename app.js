require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser')
// set the view engine to ejs
let path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function getBookData() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const result = await client.db("mels-books").collection("books-collection").find().toArray();
    console.log("cxnDB result: ", result);

    return result; 

    
  } 
  catch(err){
    console.log("mongoConnect()error: e", err)
  }
  finally {
    // Ensures that the client will close when you finish/error
    
  }
}

app.get('/', async (req, res) => {

  let result = await getBookData().catch(console.error); 

  console.log("cxnDB result: ", result);

  res.render('index', {
   
    pageTitle: "mel's books",
    bookData: result

  });
  
});


app.post('/addBook', async (req, res) =>{

  try{
      client.connect;
      const collection = client.db("mels-books").collection("books-collection");
      
      console.log(req.body);
      
      await collection.insertOne(req.body);

      
      res.redirect('/');

    }
    catch(err){
      console.log(err);
  
    }
    finally{
     //dddx
    }
})


app.post('/updateBook/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("mels-books").collection("books-collection");
    let result = await collection.findOneAndUpdate( 
      {"_id": ObjectId(req.params.id)}, { $set: {"bookName": "Percy Jackson" } }
    )
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})


app.post('/deleteBook/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("mels-books").collection("books-collection");
    let result = await collection.findOneAndDelete( 
      {
        "_id": ObjectId(req.params.id)
      }
    )
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})





app.listen(port, () => {
console.log(`mel's books listening on port ${port}`)
})