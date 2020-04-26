const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;
const dbPath = "./db/db.json";

app.use(express.static("public"));

// index.html served by default by express.static()

// serve the notes.html
app.get("/notes",(req,res) => {
    res.sendFile(path.join(__dirname,"public/notes.html"));
});
// Return all notes from db.json
app.get("/api/notes",(req,res) => {
    
    fs.readFile(dbPath,(err,data) => {
        if(err){
            console.log("Error reading db.json");
            return;
        }

        res.json(data);
        res.end();
    });
});
// save new note to db.json
app.post("/api/notes",(req,res) => {

    const note = req.body;

    fs.readFile(dbPath,(err,data) => {
        if(err){
            console.log("Error reading db.json");
            return;
        }
        
        const notes = JSON.parse(data);

        notes.push(note);

        fs.writeFile(dbPath,JSON.stringify(notes),(err) => {
            if(err)
                console.log("Error writing to db.json");
            else
                console.log("Note appended");
        });
    });

});
// delete note
app.delete("/api/notes/:id",(req,res) =>{

    const id = parseInt(req.params.id);

    const notes = fs.readFile(dbPath,(err,data) => {

        if(err) {
            console.log("Error reading db.json");
            return;
        }

        const notes = JSON.parse(data);

        notes.pop[id];

        fs.writeFile(dbPath,JSON.stringify(notes),(err) => {
            if(err)
                console.log("Error writing to db.json!");
            else
                console.log("Note deleted");
        });
    });


});
// start server
app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});





