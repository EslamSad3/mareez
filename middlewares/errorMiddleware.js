const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
   if(process.env.NODE_ENV === 'development'){
    sendErrorToDev(err,res)
   } else {
    sendErrorToPro(err,res)
   }
    
  }

  const sendErrorToDev = (err,res)=>{
    return  res.status(err.statusCode).json({ 
        status : err.status,
        error : err,
        message : err.message,
        stack : err.stack
       });
  }
  const sendErrorToPro = (err,res)=>{
    return  res.status(err.statusCode).json({ 
        status : err.status,
        message : err.message,

       });
  }

  module.exports = globalError