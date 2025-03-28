import { Router } from "express";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshToken,
  registerUserController,
  resetpassword,
  updateUserDetils,
  uploadAvatar,
  userDetails,
  varifyEmailController,
  varifyForgotPasswordOtp,
} from "../controllers/user.controller.js";
import { createLive, deleteLivePost, getLiveDetails } from "../controllers/live.controller.js";
import { createLatestNews, deleteLatestNews, getLatestnewsDetails } from "../controllers/latestnews.controller.js";
import { createEventDetails, deleteEventdetails, getEventDetails } from "../controllers/eventadd.controller.js";
import { createSportDetails, deleteSportDetails, getSportDetails } from "../controllers/sport.controller.js";
import { createPolitices, deletePoliticsDetails, getPoliticsDetails } from "../controllers/politics.controller.js";
import { createComic, deleteComic, getComicDetails } from "../controllers/comic.controller.js";
import { createOccsion, deleteOccsionData, getOccsionDetails } from "../controllers/occasion.controller.js";
import { createPromotionalDetails, deletePromotionalDetails, getPromotionalData } from "../controllers/promotinal.controller.js";
import { createRequestPost, deleterequestlDetails, getRequestPost } from "../controllers/requestPost.controller.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", varifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.put("/update-user", auth, updateUserDetils);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-forgot-password-otp", varifyForgotPasswordOtp);
userRouter.put("/reset-password", resetpassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", auth, userDetails);


// Live Post Routes
userRouter.post("/livedetails", auth, upload.fields([
  { name: "livefirstImage", maxCount: 1 },
  { name: "liveSecondImage", maxCount: 1 }
]), createLive);

userRouter.get("/livedetails", getLiveDetails);
userRouter.delete('/livedetails/:id', auth, deleteLivePost);
userRouter.post("/create-news",auth, upload.fields([{ name: "latestFirstImage" }, { name: "latestSecondImage" }]), createLatestNews);
userRouter.get ("/getalllatestdetails",getLatestnewsDetails)
userRouter.delete('/create-news/:id',auth,deleteLatestNews)
userRouter.post("/eventdata",auth,upload.fields([
  {name : "eventImage",maxCount: 1}
]),createEventDetails)
userRouter.get("/geteventdetails",getEventDetails)

userRouter.delete('/eventdata/:id',auth,deleteEventdetails)
userRouter.post("/sport-data",auth,upload.fields([
  {name:"sportImage",maxCount:1,}
]),createSportDetails)
userRouter.get("/getAllSportDetails",getSportDetails)
userRouter.delete('/sport-data/:id',auth,deleteSportDetails)

userRouter.post("/politics-data",auth,upload.fields([
  {name :"politicsImage",maxCount:1,}
]),createPolitices)
userRouter.get("/getAllPolitics",getPoliticsDetails)
userRouter.delete("/politics-data/:id",auth,deletePoliticsDetails)

userRouter.post("/create-comic", upload.fields([{ name: 'comicFirstImage' }, { name: 'comicSecondImage' }]), createComic);

userRouter.get("/getComicDetails",getComicDetails)
userRouter.delete("/create-comic/:id",auth,deleteComic)

userRouter.post("/create-occsion",auth,upload.fields([
  {name : "occsionImage",maxCount: 1,}
]),createOccsion)

userRouter.get("/getOccusionDetails",getOccsionDetails)

userRouter.delete("/create-occsion/:id",auth,deleteOccsionData)

userRouter.post("/create-promo", auth, upload.single("promoImage"), createPromotionalDetails);
userRouter.get("/getPromoAllDetails", getPromotionalData);
userRouter.delete("/delete-promo/:id", auth, deletePromotionalDetails);

userRouter.post("/create-requestPost", upload.single("requestPostImage"), createRequestPost);

userRouter.get("/getAllRequest",getRequestPost)
userRouter.delete("/create-requestPost/:id", auth,deleterequestlDetails)
export default userRouter;