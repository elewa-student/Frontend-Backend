//      learning tasks
// access /all then /reset - explain what happens in the console
// change shuffle around the routes, what happens?

var express = require("express")
var app = express()

var notes_service = require('./json-sync-model');

// Body parser for forms
var bodyParser= require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var cors = require('cors');

// cross origin resource sharing
// for accepting traffic from gh-pages while hosted on heroku
app.use(cors());

// routes =>

/* ------------------- INDEX -------------------*/
// GET  "/notes/"                     => greetings

/* ------------------- INDEX -------------------*/
// GET  "/notes/all"                     => show all notes

/* ------------------- INDEX -------------------*/
// GET  "/notes/reset"                     => resets db

/* ------------------- CREATE -------------------*/
// GET  "/notes/add"                => Create new Beaver
// POST "/notes/add"                => Create new Beaver
//                                 Redirect to "/note/:id"

/* ------------------- READ -------------------*/
// GET  "/notes/:id"             => View Beaver Info with id ...

/* ------------------- UPDATE -------------------*/
// GET  "/notes/:id/update"     => update Beaver with id...
// POST "/notes/:id/update"     => update Beaver with id...
//                                 Redirect to "/note/:id"

/* ------------------- DELETE -------------------*/
// GET  "/notes/:id/delete"     => delete Beaver with id...
// POST "/notes/:id/delete"     => delete Beaver with id...
//                                 Redirect to "/"

/* reinitialize  - most APIs don't expose this operation */
// POST "/notes/reset"


app.get("/notes", function(req, res) {
    console.log("-- GET /notes/all --");
    res.json("hi, you're at my notes api")
})

app.get("/notes/all", function(req, res){
    console.log("-- GET /notes/all --");
    res.json(notes_service.read_all());
})
app.post("/notes/reset", function(req, res){
    console.log("-- GET /notes/reset --");
    notes_service.reset();
    res.redirect("/notes/all");
})

app.get("/notes/add", function(req, res){
    console.log("-- GET /notes/add --");
    res.json('put a new "note" property in the body and submit')
})

app.post("/notes/add", function(req, res){
    console.log("-- POST /notes/add --");
    var new_note = req.body.note;
    var id = notes_service.create(new_note);
    res.redirect("/notes/" + id)
})

app.get("/notes/:id", function(req, res){
    console.log("-- GET /notes/:id --");
    var note_id = req.params.id
    res.json(notes_service.read_one(note_id));
})

app.get("/notes/:id/update", function(req, res){
    console.log("-- GET /notes/:id/update --");
    var note_id = req.params.id
    var response = {}
    response[note_id] = notes_service.read_one(note_id);
    response.next_step = 'post with a \'note\' property in the body';
    res.json(response);
})

app.post("/notes/:id/update", function(req, res){
    console.log("-- POST /notes/:id/update --");
    var note_id = req.params.id
    notes_service.update(note_id, req.body.note)
    res.redirect("/notes/" + note_id)
})

app.get("/notes/:id/delete", function(req, res){
    console.log("-- GET /notes/:id/delete --");
    var note = notes_service.read_one(req.params.id);
    res.json({id: note, message: 'confirm deleting this note'});
})

app.post("/notes/:id/delete", function(req, res){
    console.log("-- POST /notes/:id/delete --");
    notes_service.remove(req.params.id);
    res.redirect("/notes/all")
})



app.listen(3001 || process.env.PORT, function() {
    console.log("litening in port 3001")
})



