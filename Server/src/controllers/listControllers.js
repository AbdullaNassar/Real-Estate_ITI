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
        const queryBody = {}
        
        queryBody.host = req.user._id;

        let query = listModel.find(queryBody);

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

export const updateList = async (req,res)=> {
    try {
        const {id} = req.params;
        const list = await listModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(201).json({
            status:"Success",
            data: list
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
        const list  = await listModel.deleteOne({_id:id});
        res.status(201).json({
            status:"Success",
            message:"List Deleted",
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

export const searchLists = async (req,res)=>{
    try {
        const {title,description} = req?.query;
        const query = {};
        if(title?.trim()){
            query.title = {$regex: new RegExp(title,"i")}
        }
        if(description?.trim()){
            query.descrption = {$regex: new RegExp(description,"i")}
        }
        query.host = req.user._id;
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