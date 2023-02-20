const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//ROUTE-1 Get all the notes /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("INTERNAL SERVER ERROR")
    };


});


//ROUTE-2 Add a new notes using POST /api/notes/addnote
router.post('/addnote', fetchUser, [
    body('title', 'enter valid title').isLength({ min: 3 }),
    body('description', 'enter valid description').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("INTERNAL SERVER ERROR")
    };
});


//ROUTE 3 - Update the existing note..login required PUT /api/notes/updatenote
router.put('/updatenote/:id', fetchUser, async (req, res) => {

    try {
        const {title, description, tag}=req.body;
        //create a new note object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
    
        //find the note to be updated and update it
    
       let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        };
    
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        };
    
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note);
    
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("INTERNAL SERVER ERROR")
    };
});


//ROUTE 4 - Delete the note..login required DELETE /api/notes/deletenote
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    

    try {
    //find the note to be deleted and delete it

   let note=await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not found");
    };

    // allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    };

    note=await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"note has been deleted",note:note});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("INTERNAL SERVER ERROR")
    };
});





module.exports = router;