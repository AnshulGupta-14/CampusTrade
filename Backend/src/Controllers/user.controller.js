import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ObjectId } from "mongodb";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../Utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendOTPFromTwilio } from "../Utils/twilio.js";

const generateAccessAndRefereshTokens = async (user) => {
  try {
    // const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password, regno, mobno } = req.body;
  // console.log(req.);

  if (
    [email, username, password, fullname, regno, mobno].some(
      (field) => field?.trim === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }, { regno }, { mobno }],
  });

  if (existedUser) {
    if (existedUser.username === username.toLowerCase()) {
      throw new ApiError(409, "User already exists with the same username");
    }
    if (existedUser.email === email.toLowerCase()) {
      throw new ApiError(409, "User already exists with the same email");
    }
    if (existedUser.regno === regno) {
      throw new ApiError(409, "User already exists with the same regno");
    }
    if (existedUser.mobno === mobno) {
      throw new ApiError(409, "User already exists with the same mobno");
    }
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  //   console.log(avatar);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await sendOTPFromTwilio(otpCode, mobno);

  req.session.otpCode = otpCode;
  req.session.userData = {
    fullname,
    email,
    username,
    password,
    regno,
    mobno,
    avatar,
    coverImage,
  };
  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const { username, password, email, regno } = req.body;
  if (!email && !username && !regno) {
    throw new ApiError(400, "Username, email or regno is required");
  }

  // console.log(username);

  const user = await User.findOne({
    $or: [{ username }, { email }, { regno }],
  });

  // console.log(user);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user
  );

  const options = {
    // httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none", // CSRF protection
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // console.log(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    // httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "None", // CSRF protection
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "User refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confPassword } = req.body;
  if (!currentPassword || !newPassword || !confPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password and current password should not be same"
    );
  }

  if (newPassword !== confPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid current password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed succesfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.params?.id;
  const _id = new ObjectId(userId);
  console.log(userId);

  const user = await User.findOne({ _id }).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email, username } = req.body;

  if (!fullname || !email || !username) {
    throw new ApiError(400, "Fullname, username and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname,
        email,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  console.log(req.file);

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const oldUser = await User.findById(req.user._id);
  const arr = oldUser.avatar.split("/");
  const filepath = arr[arr.length - 1].split(".")[0];
  console.log(filepath);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  const deleteOldAvatar = await deleteFromCloudinary(filepath);
  console.log(deleteOldAvatar);

  if (deleteOldAvatar.result !== "ok") {
    throw new ApiError(400, "Error while deleting avatar from cloudinary");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading cover image");
  }

  const oldCoverImage = await User.findById(req.user._id).coverImage;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (oldCoverImage) {
    const deleteOldCoverImage = await deleteFromCloudinary(oldCoverImage);
    if (deleteOldCoverImage.result !== "ok") {
      throw new ApiError(
        400,
        "Error while deleting cover image from cloudinary"
      );
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

// const sendOTP = asyncHandler(async (req, res) => {
//   const { mobno } = req.body;
//   // console.log(phoneNumber);

//   const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//   const user = await User.findOne({ mobno });

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   user.otp = otpCode;
//   user.otpexpire = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
//   await user.save();

//   sendOTPFromTwilio(otpCode, mobno);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "OTP sent successfully"));
// });

const updateMobileNumber = asyncHandler(async (req, res) => {
  const { mobno } = req.body;
  if (!mobno) {
    throw new ApiError(400, "Mobile number is required");
  }

  const user = await User.findOne({ mobno });
  if (user) {
    throw new ApiError(400, "Mobile number already exists");
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await sendOTPFromTwilio(otpCode, mobno);

  req.session.otpCode = otpCode;
  req.session.mobno = mobno;

  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      throw new ApiError(400, "OTP is required");
    }

    if (otp !== req.session.otpCode) {
      throw new ApiError(400, "Invalid OTP");
    }

    if (req.session.userData) {
      const {
        fullname,
        email,
        username,
        password,
        regno,
        mobno,
        avatar,
        coverImage,
      } = req.session.userData;

      const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        regno,
        mobno,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
      });

      res
        .status(201)
        .json(new ApiResponse(201, user, "User registered successfully"));
    } else {
      const mobno = req.session.mobno;
      const token = req.cookies?.accessToken;
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findByIdAndUpdate(
        { _id: decodedToken?._id },
        { $set: { mobno } },
        { new: true }
      );

      console.log(user);
      return res
        .status(200)
        .json(new ApiResponse(200, user, "Mobile number updated successfully"));
    }
  } catch (error) {
    throw new ApiError(500, "Invalid OTP");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  verifyOTP,
  updateMobileNumber,
};
