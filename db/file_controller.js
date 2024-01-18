const express= require("express")
const File= require("../db/file_model")
const bodyParser= require("body-parser")
const app = express();

app.use(bodyParser.json());

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

const index = (req,res,next)=>{
    File.find()
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'an error occured'
        })
    })
}



const store = (req,res,next) => {
    try {
        let file= new File(
            {
                payment: req.body.payment,
                file_type: req.body.file_type
                
            }
        )
        if(req.file){
            file.csv_file= req.file.path
        }
    
        file.save()
    
        res.status(200).json({'message':'All ok'})
    } catch (error) {
        throw new error
    }
}

module.exports = {
    index , store
}