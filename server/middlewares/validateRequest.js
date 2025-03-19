const { z } = require("zod")

const validateRequest = (schema) =>{
    return (req,res,next) =>{
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if(error instanceof z.ZodError){
                const formattedErrors = error.errors.map( err=> ({
                    path: err.path.join('.'),
                    message: err.message
                }))
                return res.status(400).json({ 
                    error: 'Validation failed', 
                    details: formattedErrors 
                  });
            }
        }
    }
}

module.exports = validateRequest;