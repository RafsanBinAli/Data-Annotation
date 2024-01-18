const mongoose= require("mongoose")
const schema = mongoose.Schema

const fileschema= new schema({
    payment:
    {
        type: String
    },

    file_type:
    {
        type: String
    },
    csv_file:
    {
        type: String
    },
    updated_csv_file:
    {
        type:String
    },
    completionStatus:
    {
        type: Boolean
    }
})

const file = mongoose.model('file',fileschema);

module.exports = file