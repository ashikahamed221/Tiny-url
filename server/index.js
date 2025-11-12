import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import { nanoid } from "nanoid";
const { Schema } = mongoose;

const app = express();
dotenv.config();

app.use(express.json())
app.use(cors());

// connect to mongodb using an connect

mongoose.connect(process.env.TINY_MONGODB)
    .then(() => { console.log("mongo db connected") })
    .catch((err) => { console.log("mongo db error", err) })


// Creating an db model

const Url = mongoose.model('Url', new mongoose.Schema({
    Originalurl: String,
    ShortId: String,
    Clickcount: { type: Number, default: 0 }
}))



app.post('/api/shorturl', async (req, res) => {

    const { Originalurl } = req.body;

    const ShortId = nanoid(6);

    await Url.create({ Originalurl, ShortId })
    res.json({ Shorturl: `http://localhost:4000/${ShortId}`})

})

app.get('/:ShortId', async (req, res) => {

    try {

        const found = await Url.findOne({ ShortId: req.params.ShortId })

        if (!found) return res.status(404).send("Not Found");

        found.Clickcount++;

        await found.save();

        return res.redirect(found.Originalurl);
    }
    catch (error) {

        console.log("error in the link")

    }
})


app.get('/health', (req, res) => {

    res.send('hello world!!...')
})

const port = 4000;
app.listen(port, () => {
    console.log("Server is running on https://localhost:4000")
})



