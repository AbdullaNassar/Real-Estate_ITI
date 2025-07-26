import mongoose, { Schema }  from "mongoose";

const listSchema = new Schema({
    host:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Host is required']
    },
    title:{
        type:String,
        required:[true,"Listing Title is required"],
        trim:true
    },
    descrption:{
        type:String,
        required:[true,"Listing Description is required"]
    },
    pricePerNight:{
        type:Number,
        required:[true,'Price Per Night is Required'],
        min:[0,'preice Per Night must be grater than Or equal to 0']
    },
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:[true,"Category Id Is Required"]
    },
    locationType:{
        type:String,
        enum:['seaside', 'city', 'mountain', 'rural'],
        default:'city'
    },
    location:{
        type:String,
        required:[true,'Location is Required']
    },
    amenitiesId:{
        type:[mongoose.Types.ObjectId],
        ref:'Amenity',
        default:[]
    },
    maxGustes:{
        type:Number,
        required:[true,'Max Gustes is Required'],
        min:[1,'Max Gustes must be grater than Or equal to 1']
    },
    photos:{
        type:[String],
        required:[true,"One To Five Photo Required"],
        validate:{
            validator: (value)=>{
                return value.length <=5;
            },
            message:"Max 5 photos are allowed."
        }
    },
    averageRating:{
        type:Number,
        default:0
    },
    isApproved:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
);

const listModel = mongoose.model('List',listSchema);
export default listModel;