const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const multer = require("multer");
const csv= require('csv-parser')
const fs = require('fs');
const fastcsv = require('fast-csv');
const path = require("path"); 
const File= require("./db/file_model")

const app= express();
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://octopus:Rafsan67@cluster0.rllrx4c.mongodb.net/?retryWrites=true&w=majority').then( function(){
    console.log("yahoo")
}).catch(e=>{
    console.log(e)
})

const routee = require("./routes/routef")
const user =require("./routes/UserAuthentication")


app.use(express.static(path.join(__dirname, 'public'), { 'extensions': ['html'] }));

const upfolder= "./upload_file/";

var upload = multer(
    {
        dest: upfolder

    }
);


app.set('view engine', 'ejs');

app.get('/upload/complete', async function(req, res) {
    try{
        const files= await File.find()
        res.render("../view/completeJobs",{ files});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Internal error");

    }
})


app.get("/upload",async function(req,res)
{

   
    try{
        const files = await File.find();


        res.render("../view/upload",{ files})
    }
    catch(error){
    console.log(error)
    }
})

// Define a new route to handle the AJAX request for the JSON data
app.get('/api/get-updated-csv/:id', async (req, res) => {
    try {
        // Retrieve the JSON data you want to send to the client
        const fileId = req.params.id; // If needed, replace this with the appropriate data retrieval logic
        const file = await File.findById(fileId); // Replace with your actual data retrieval logic

        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Send the JSON data as a response
        const updatedCsvFile = JSON.parse(file.updated_csv_file);
        res.json(updatedCsvFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving updated CSV file" });
    }
});

app.get('/upload/complete/:id',async function (req, res) {
    try {
        // Retrieve the JSON data you want to send to the client
        const fileId = req.params.id; // If needed, replace this with the appropriate data retrieval logic
        const file = await File.findById(fileId); // Replace with your actual data retrieval logic

        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Send the JSON data as a response
        console.log(file.updated_csv_file)

        const updatedCsvFile = JSON.parse(file.updated_csv_file);
       
        res.render('../view/completeJobShow',{file})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving updated CSV file" });
    }
});



app.get("/", function(req,res)
{
    res.render(path.join(__dirname , "./view/index"));
    
})

app.get("/available-work", async function(req,res)
{
    try{
        const files = await File.find();


        res.render("../view/available_work",{ files})
    }
    catch(error){
    console.log(error)
    }
})



app.post("/upload", upload.single("filename"), async function (req, res, next) {
    

    try {
        
        // Create a new instance of your Mongoose model with the form data
        const file = new File({
            payment: req.body.payment,
            file_type: req.body.file_type,
            updated_csv_file:null,
            completionStatus:false
            
        });
        if(req.file){
            file.csv_file= req.file.path
        }
        // Save the data to MongoDB
        await file.save();
        res.redirect("/upload");

       
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.delete('/delete/:fileid', async function(req,res)
{
    const fileid=req.params.fileid;
    try{
        const file= await File.findOneAndDelete({_id: fileid});
        res.json({ success: true });
    }
    catch(error){
        console.log(error)
    }
})

app.get('/show/:fileid', async function (req, res) {
    const fileid = req.params.fileid;


    try {
        const fileData = await File.findOne({ _id: fileid });
        if (!fileData) {
            res.status(404).send("File not found");
        } else {
            const csvFilePath = fileData.csv_file;

            const data = [];
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    
                    data.push(row);
                    
                })
                .on('end', () => {
                    console.log('Parsed CSV data:', data);
                    // Render the workshow view with the CSV data
                    res.render('../view/workshow', { fileData, csvData: data });
                });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("DB query error: " + error.message);
}
    
});


app.post('/show/:fileid', async function (req, res) {
    const fileid = req.params.fileid;
    const labels = req.body.labels;

    
    try {
        const fileData = await File.findOne({ _id: fileid });
        if (!fileData) {
            res.status(404).send("File not found");
        } else {
            const csvFilePath = fileData.csv_file;

            const data = [];
            let i=0;
            fs.createReadStream(csvFilePath)
            .pipe(fastcsv.parse({ headers: true }))
                .on('data', (row) => {
                    row.Label= labels[i];
                    data.push(row);
                    i++;

                })
                .on('end', async () => {
                    
                  
                   const updatedCsvBuffer = Buffer.from(JSON.stringify(data));

                   try{
                    fileData.updated_csv_file = updatedCsvBuffer;
                    fileData.completionStatus=true
                    await fileData.save();
                    res.send("CSV data updated and saved to the database successfully");
                   }
                   catch{
                    console.error("Error saving updated CSV data to the database:", error);
                        res.status(500).send("Error saving updated CSV data to the database");
                   }


                   
                    

                    // Render the workshow view with the CSV data
                    
                });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("DB query error: " + error.message);
}
    
});

app.use('/api', routee);
app.use('/user', user);

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
