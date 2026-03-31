import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation -> verify the the details( eg. not empty)
  //      if valid procced    else re fetch
  // check if the user is already registered/exists: username, email
  // check for images, check for avatar
  // |_> if yes: upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res -> if null => error

  const { fullName, email, username, password } = req.body;
  console.log("username", username);

  /* if(fullName === "") {
        throw new ApiError(400, "fullName is required");
       } */

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  if (!email.includes("@")) {
    /////////////////
    throw new ApiError(400, "Email is invalid!");
    console.log(email);
  }
  const exitedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is needed");0
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required!");
  }

  const user = User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select(
    " -refreshToken -refreshToken"
  )

  if(!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
});

export { registerUser };