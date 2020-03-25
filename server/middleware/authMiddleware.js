module.exports ={
    usersOnly: (req, res, next) =>{
        if(!req.session.user){
           res.status(400).send('Please Log In')
        }
         next();
    },
    adminsOnly: (req, res, next) =>{
        if(!req.session.user.isAdmin){
            res.status(403).send('You are not an admin')
        }
        next();
    } 
}