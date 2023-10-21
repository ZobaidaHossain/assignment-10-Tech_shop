const express = require('express');
const cors =require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express();
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxoo4ka.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
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

    const coffeeCollection=client.db('productDB').collection('product')

    const userCollection=client.db('productDB').collection('user');
    const cartCollection=client.db('productDB').collection('cart');

    app.get('/coffee',async(req,res)=>{
  const cursor=coffeeCollection.find();
  const result=await cursor.toArray();
  res.send(result);
    })

    //for update
//update
app.get('/coffee/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await coffeeCollection.findOne(query);
    res.send(result);
})



    //create
app.post('/coffee',async(req,res)=>{
    const newCoffee=req.body;
    console.log(newCoffee);
    const result=await coffeeCollection.insertOne(newCoffee)
    res.send(result);

})
//update
app.put('/coffee/:id',async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)};
    const options={upsert:true};
    const updatedCoffee=req.body;
    const coffee={
        $set:{
            photo:updatedCoffee.photo,
            name:updatedCoffee.name,
            brand:updatedCoffee.brand,
            type:updatedCoffee.type,
            price:updatedCoffee.price,
            short:updatedCoffee.short,
            rating:updatedCoffee.rating
            

        }
    }

    const result=await coffeeCollection.updateOne(filter,coffee,options);
    res.send(result);


})
   
//delete
app.delete('/coffee/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result=await coffeeCollection.deleteOne(query);
    res.send(result);
})

//user related api
app.post('/user',async(req,res)=>{
    const user=req.body;
    console.log(user);
    const result=await userCollection.insertOne(user)
    res.send(result);

})

app.patch('/user',async(req,res)=>{
    const user=req.body;
    const filter={email:user.email}
    const updateDoc={
        $set:{
            lastLoggedAt:user.lastLoggedAt
        }
    }
    const result=await userCollection.updateOne(filter,updateDoc);
    res.send(result);
})

//cart related api
app.get('/cart',async(req,res)=>{
    const cursor=cartCollection.find();
    const cart=await cursor.toArray();
    res.send(cart);
      })



app.post('/cart',async(req,res)=>{
    const cart=req.body;
    console.log(cart);
    const result=await cartCollection.insertOne(cart)
    res.send(result);

})


//cart delete
app.delete('/cart/:id',async(req,res)=>{
    const id=req.params.id;
    console.log('Received delete request for ID:', id);
    const query={_id: id};
    const result=await cartCollection.deleteOne(query);
    res.send(result);
})





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!!!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Technology making server is running');

})

app.listen(port,()=>{
    console.log(`Technology server is running on port: ${port}`)
})