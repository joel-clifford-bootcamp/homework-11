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
app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname,"public/notes.html"));
});
// Return all notes from db.json
app.get("/api/notes",(req,res) => {
    
    fs.readFile(dbPath,(err,data) => {
        if(err){
            console.log("Error reading db.json");
            return;
        }

        res.json(JSON.parse(data));
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

        note.id = notes.length + 1;

        notes.push(note);

        fs.writeFile(dbPath,JSON.stringify(notes),(err) => {
            if(err)
                console.log("Error writing to db.json");
            else
                console.log("Note appended");
                res.json(notes);
                res.end();
        });
    });

});
// delete note
app.delete("/api/notes/:id",(req,res) =>{

    const id = parseInt(req.params.id);

    const notes = fs.readFile(dbPath,(err,data) => {

        if(err) {
            console.log("Error reading db.json");
            res.end();
            return;
        }

        const notes = JSON.parse(data).filter(note => note.id != id);

        fs.writeFile(dbPath,JSON.stringify(notes),(err) => {
            if(err)
                console.log("Error writing to db.json!");
            else {
                console.log("Note deleted");
                res.json(notes);
            }

            res.end();
        });
    });


});
// start server
app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});





