import listModel from '../models/listModel.js'

export const createList = async (req,res) => {
    try {
        req.body.host = req.user._id;

        const list = await listModel.create(req.body);

        res.status(201).json({
            status:"Success",
            message:"List Created",
            data:list
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const readLists = async (req,res)=> {
    try {
        const {sort,page,limit,field} = req?.query;
        const queryBody = {
            isApproved:true
        }
        
        let query = listModel.find(queryBody).populate('categoryId amenitiesId');

        if(sort){
            query= query.sort(sort.split(',').join(' '))
        }

        if(field){
            query= query.select(field.split(',').join(' '));
        }

        if(page){
            const skip = (page -1) * limit;
            query= query.skip(skip).limit(+limit);
        }

        const lists = await query;
        res.status(201).json({
            status:"Success",
            results:lists.length,
            data:lists
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const getListById =async (req,res)=>{
    try {
        const {id} = req.params;
        const list = await  listModel.findOne({_id:id});
        if(!list){
            return res.status(404).json({
            status:"Failed",
            message:"List Not Found"
        })
        }
        return res.status(201).json({
            status:"Success",
            data: list
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const updateList = async (req,res)=> {
    try {
        const {id} = req.params;
        const host = req.user._id;

        const list = await listModel.findOne({_id:id});
        if(!list){
            return res.status(404).json({
            status:"Failed",
            message:"List Not Found"
        })
        }
        if(list.host.toString()!==host.toString()){
            return res.status(403).json({
            status:"Failed",
            message:"Can not to Update this List"
        })
        }
        const newList = await listModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            status:"Success",
            data: newList
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const deleteList = async (req,res)=> {
    try {
        const {id} = req.params;
        const host = req.user._id;

        const list = await listModel.findOne({_id:id});
        if(!list){
            return res.status(404).json({
            status:"Failed",
            message:"List Not Found"
        })
        }
        if(list.host.toString()!==host.toString()){
            return res.status(403).json({
            status:"Failed",
            message:"Can not to Delete This List",
        })
        }
        const resData  = await listModel.deleteOne({_id:id});
        return res.status(200).json({
            status:"Success",
            message:"List Deleted",
            data:resData
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const searchLists = async (req,res)=>{
    try {
        const {title,description,price,date,location,amenities} = req?.query;
        const query = {};
        if(title?.trim()){
            query.title = {$regex: new RegExp(title,"i")}
        }
        if(description?.trim()){
            query.descrption = {$regex: new RegExp(description,"i")}
        }
        if(price?.trim()){
            query.pricePerNight = {$lte:price};
        }
        if(date?.trim()){
            const currDate = new Date(date);
            const nextDate = new Date(currDate);
            nextDate.setDate(nextDate.getDate() + 1);

            query.createdAt = {
            $gte: currDate,
            $lt: nextDate
            };
        }
        if(location?.trim()){
            query.location = {$regex: new RegExp(location,"i")}
        }
        if(amenities?.trim()){
            query.amenities = {$regex: new RegExp(amenities,"i")}
        }
        const lists = await listModel.find(query);
        
        res.status(200).json({
            status:"Success",
            results:lists.length,
            lists:lists
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const approvedListing = async (req,res)=>{
    try {
        const {id} = req.params;
        const listing = await listModel.findByIdAndUpdate(id,{isApproved:true},{new:true,runValidators:true});
        return res.status(200).json({
            status:"Success",
            message:"Listing Approved Successfuly",
            data:listing
        })

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}