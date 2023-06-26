const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const google = require('./google');
const uri = "mongodb://bot:yMe8PBQYBtHBEVVc@ac-txjx8wg-shard-00-00.z6swqaz.mongodb.net:27017,ac-txjx8wg-shard-00-01.z6swqaz.mongodb.net:27017,ac-txjx8wg-shard-00-02.z6swqaz.mongodb.net:27017/?ssl=true&replicaSet=atlas-gaunk8-shard-0&authSource=admin&retryWrites=true&w=majority";
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
const dbName = "botVideo";



module.exports = {
  addVideo: async function (urlVideo, usuario) {
    try {
      let detalhesVideo = await google.obterDetalhesVideo(urlVideo);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      // Use the collection "people"
      const col = db.collection("video");
      // Construct a document                                                                                                                                                              
      let videoRequest = {
        "_id": new ObjectId,
        "url": urlVideo,
        "usuario": usuario,
        "titulo": detalhesVideo.data.items[0].snippet.title,
        "criador": detalhesVideo.data.items[0].snippet.channelTitle
      }
      // Insert a single document, wait for promise so we can read it back
      const p = await col.insertOne(videoRequest);
      // Find one document
      const myDoc = await col.findOne({_id: p.insertedId});
      await client.close();

      return myDoc;
    } catch (err) {
      console.log(err.stack);
    }


  },
  listarVideos: async function () {
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("video");
      const myDoc = await col.find().toArray();
      await client.close();
      return myDoc;
    } catch (err) {
      console.log(err.stack);
    }


  },
  deletarVideo: async function (id) {
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("video");
      console.log(id)
      await col.deleteOne({ _id: new ObjectId(id) });
      await client.close();
    } catch (err) {
      console.log(err.stack);
    }


  },
  deletarVideoPosicao: async function (p) {
    try {
      let n = Number(p)
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("video");
      const myDoc = await col.find().limit(n + 1).toArray();
      await col.deleteOne( myDoc[n] );
      
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }


  }
};
