export const userPermission = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user?.role)){
            return res.status(403).json({
                status:"Failed",
                message:"You do not have permission to access this route"
            });
        }
        next();
    }
}