const User = require("../../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserInputError}= require('apollo-server')


const Joi = require('joi');



function jwtSign(user) {

 return jwt.sign({id:user.id,email:user.email,username:user.username}, process.env.JWT_TOKEN,{expiresIn:60*60*24});
}



module.exports = {
  Mutation: {

    async login(_,{username,password})
    {

      //Validate 
      const schema = Joi.object().keys({
        username:Joi.string().required(),
        password:Joi.string().required()
      })

     const result =  schema.validate({username,password})
     if(result.error) {
        throw new UserInputError("Errors", {error:result.error.details[0]})
      }

      //Check If User Exist

      const user= await User.findOne({username})

      if(!user) throw new UserInputError("User Does Not Exist",{error:"User Does Not Exist"})

      //Password Verify
      const passCheck = await bcrypt.compare(password,user.password)

      if(!passCheck)  throw new UserInputError("Password Does Not Match",{error:"Password Does  Not Match"})

      //Return Token
      const token= jwtSign(user)
      
      return {
        ...user._doc,
        id: user._id,
        token
      };

    },

    async register(
      _,
      {
        registerInput: { username, email, password }
      },
    ) 
    {

      //Validation

      const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().required()
    })
    const result = schema.validate({ username,email,password});
    // console.log(result.error)
    
    if(result.error)  throw new UserInputError("Errors", {error:result.error.details[0]})




      
      //Check If User Exists
      const checkUser= await User.findOne({username})

      if(checkUser)
      {
        throw new UserInputError('Username Is Taken',{
          errors:{
            username:"Username Is Already Taken"
          }
        })
      }

      // Take In Info And Register
      const pass = await bcrypt.hash(password, 12);
      const user = new User({
        email:email,
        username:username,
        password:pass,
        createdAt: new Date().toISOString()
      });

      const res = await user.save();
      const token = jwtSign(res)

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
