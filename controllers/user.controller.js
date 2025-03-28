 import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
 import bcryptjs  from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageClodinary from "../utils/uploadimageClodinary.js";
import generatedOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotpasswordTemplate.js";
import jwt  from 'jsonwebtoken'


 export async function registerUserController(request,response){
    try {
        const { name, email, password} = request.body
        if(!name  || !email || !password){
            return response.status(400).json({
                message: "provide email,name,password",
                error:true,
                success:false
            })
        }
      
        const user = await UserModel.findOne({ email })


        if(user){
            return response.json({
                message:"Already register emial",
                error:true,
                success:false
            })
        }
        

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)
        

         const payload = {
            name,
            email,
            password: hashPassword
         }

       const newUser = new UserModel(payload)
       const save = await newUser.save()
       const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`
       const verifyEmail = await sendEmail({
              sendTo: email,
              subject:" verify email from binkelit ",
             html : verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
             })
       })
       if (!verifyEmail) {
        return response.status(500).json({
            message: "Failed to send verification email",
            error: true,
            success: false
        });
    }
       console.log(verifyEmail);

       return response.json({
        message:"user register successfully",
        error:false,
        success:true,
        data: save

       })

    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success: false
        })
    }
 }

 export async function varifyEmailController(request,response) {

    try {
        const {code} = request.body

        const user = await UserModel.findOne({_id :code})
        if(!user){
            return response.status(400).json({
                message :"invilid code",
                error: true,
                success: false
            })
        }

    const updateUser = await UserModel.updateOne({_id: code },{
        verify_email : true
    })
    
    return response.json({
        message :"verify email done",
        success:true,
        error:false
    })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true  })
    }
    
 }
 //login controleer 

 export async function loginController(request,response) {
    try {
        const { email, password } = request.body

        if(!email || !password) {
            return response.status(400).json({
                message : "provide emial,password",
                error: true,
                success: false
            })
        }
         
        const user = await  UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
              message : "User not register",
              error: true,
              success: false
            })
        }
      
        if(user.status !== "Active"){
            return response.status(400).json({
                message: "Contact to admin",
                error:true,
                success:false
            })
        }
     
        const checkPassword = await bcryptjs.compare(password,user.password)
      
          if(!checkPassword){
            return response.status(400).json({
                message: "check your password",
                error: true,
                success: false
            })
          }
        
      const accesstoken = await generatedAccessToken(user._id)
      const refreshToken = await generatedRefreshToken(user._id)
      
      const updateUser =  await UserModel.findByIdAndUpdate(user?._id,{
        last_login_date : new Date()

      }) 




      const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite :"None"
      }
      response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)
    

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })


        
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error: true,
            success:false
        })
    }
 }

 //logout controller 

export async function logoutController(request,response) {
    try {
        const userId = request.userId  
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite :"None"
          }
        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)
        
      const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
        refresh_token :" "
      })


        return response.json({
            message :" Logout sucessfully",
            error:false,
            success : true

        })

    } catch (error) {
         return response.status(500).json({
            message : error.message || error,
            error: true,
            success: false
         })
    }
    
}

//upload user avtar


export async function uploadAvatar(request,response) {
    try {
        const userId = request.userId
        const image = request.file
         
       const upload = await  uploadImageClodinary(image)

       const updateUser = await UserModel.findByIdAndUpdate(userId,{
        avatar:upload.url
       })

       return response.json({
        message : "upload profile",
        success : true,
        error : false,
        data : {
            _id : userId,
            avatar: upload.url
        }

       })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
        
    }
    
}


//update user details 



export async function  updateUserDetils(request,response) {
    try {
          const userId = request.userId
        const {name,email,mobile,password} = request.body

       let  hashPassword = " "
        if(password){
            
        const salt = await bcryptjs.genSalt(10)
        hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({_id : userId },{
            ...(name && {name : name} ),
            ...(email && { email : email } ),
            ...(mobile && {mobile : mobile} ),
            ...(password && {password : hashPassword} ),
        })
          

       return response.json({
            message :" Updated  successfully",
            error: false,
            success: true,
            data: updateUser
       })  


 


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success : false
        })
        
    }
    
}


//forget password not login 


export async function  forgotPasswordController(request,response) {
     
    try {
        const { email } = request.body
        const user = await UserModel.findOne({ email })
        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error: true,
                success : false
            })
        }
        
        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })
        
        await sendEmail({
            sendTo : email,
            subject : " forgot password from Binkeyit",
           html: forgotPasswordTemplate({
            name : user.name ,
            otp : otp
           })
        })


        return response.json({
            message :  " check your email",
            error: false,
            success : true

        })









    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }

    
}

//verify forgot password otp 

export async function varifyForgotPasswordOtp(request,response) {
    try {
        
        const {email , otp } = request.body 
        if(!email || !otp ){

            return response.status(400).json({
                message : "Provide required field email,otp ",
                error: true,
                success:false
            })
        }
        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error: true,
                success : false
            })
        }
         
        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime ){
            return response.status(400).json({
                message : " otp is expired",
                error: true,
                success : false

            })
        }
        
        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error: true,
                success : false
            })

        }
  // otp is not expired 
  // otp === user.otp 
  const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
    forgot_password_otp : "",
    forgot_password_expiry : ""
  }) 
  return response.json({
    message : "verify otp done" ,
    error : false,
    success : true
  })




    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//reset the password 

export async function resetpassword(request,response) {

    try {
        const {email , newPassword , confirmPassword } = request.body
        if(!email || !newPassword || !confirmPassword ){
             return response.status(400).json({
                message : "Provide required field email,newPassword,confirm Password"
            })
        }
       const user = await UserModel.findOne({ email })

       if(!user) {
        return response.status(400).json({
            message : "Email is not available ",
            error : true,
            success : false
        })
       }
       

       if(newPassword !== confirmPassword ){
        return response.status(400).json({
            message : " newpasswod and confirmPassword must be  same .  ",
            error : true,
            success : false
        })
       }
        
   const salt =  await bcryptjs.genSalt(10)
   const hashPassword = await bcryptjs.hash(newPassword,salt )

       const update = await UserModel.findByIdAndUpdate(user._id, {
        password : hashPassword
       })

 return response.json({
    message : "Password updated successfully ",
    error: false,
    success : true
 })






    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success : false
        })
    }
    
}



///refresh tokencontroller 

export async function refreshToken(request,response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split( " ")[1]

        if(!refreshToken){
            return  response.status(401).json({
                message : "Unauthorized access ",
                error : true,
                success : false 

            })
        }
          
         const varifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN) 

         if(!varifyToken){
            return response.status(401).json({
                message : "Token is expired",
                error :  true,
                success: false
            })
         }

         const userId = varifyToken?._id

       const newAccessToken = await generatedAccessToken(userId)

       const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite :"None"
      }
       
       response.cookie('accessToken',newAccessToken,cookiesOption)

       return response.json({
        message :"New access Token generated",
        error : false,
        success: true,
        data :{
            accesstoken : newAccessToken
        }
       })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}


// get login user details 
export async function userDetails(request,response){
    try {
        const userId = request.userId

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data: user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message :"something went wrong",
            error : true,
            success : false
        })
    }
}


