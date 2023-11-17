const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const login = async ({ email, password }) => {
  try {
    const user = await supabase.from("user").select("*").where();
    if (user) {
      //   const isMatch = await bcrypt.compare(password, user.password);
      //   if (!isMatch) throw ApiError.badRequest("Invalid credentials");
      //   let userData = {
      //     ...user._doc,
      //     id: user._id,
      //   };
      // return {
      //   result: true,
      //   message: "Login successful",
      //   data: _.omit(userData, ["password", "otp", "updatedAt", "__v", "_id"]),
      // };
      return {
        result: true,
        message: "Login successful",
        data: user,
      };
    } else {
      const body = { email: email, password: password };
      throw ApiError.badRequest("User does not exist");
    }
  } catch (error) {
    nextError(error);
  }
};

// const register = async ({ name, email, password, phone }) => {
//   // check if user already exists
//   try {
//     let user = await User.findOne({ email });
//     if (user && user.isDeleted) {
//       user.isVerified = false;
//     }

//     if (user && user.isVerified) {
//       throw ApiError.badRequest("User already exists");
//     }
//     const salt = await bcrypt.genSalt(10);
//     const otp = Math.floor(10000 + Math.random() * 9000);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     if (user && !user.isVerified) {
//       user = await User.findOneAndUpdate(
//         { email },
//         {
//           $set: {
//             name: name,
//             password: hashedPassword,
//             phone: phone,
//             isDeleted: false,
//             isVerified: false,
//             otp: {
//               code: otp,
//               expiresAt: Date.now() + 4 * 60 * 1000,
//             },
//           },
//         },
//         { new: true }
//       );
//     } else {
//       const uniqueCode = await getUniqueId(User);

//       const newUser = new User({
//         name: name,
//         email: email,
//         password: hashedPassword,
//         phone: phone,
//         otp: {
//           code: otp,
//           expiresAt: Date.now() + 4 * 60 * 1000,
//         },
//         highestRole: "customer",
//         code: uniqueCode,
//       });
//       user = await newUser.save();
//     }
//     //send mail with 5 digit otp
//     MailService.sendMail(user.email, user.otp.code, "OTP");
//     let userData = Object.assign({}, user._doc);
//     return {
//       result: true,
//       message: "User created successfully",
//       data: _.omit(userData, ["password", "otp", "updatedAt", "__v"]),
//     };
//   } catch (error) {
//     nextError(error);
//   }
// };

// const verifyOtp = async ({ email, otp }) => {
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       if (user.otp.isVerified === true) {
//         throw ApiError.badRequest("User already verified");
//       }
//       if (user.otp.code === otp && user.otp.expiresAt > Date.now()) {
//         const user = await User.findOneAndUpdate(
//           { email },
//           { $set: { "otp.isVerified": true, isVerified: true } },
//           { new: true }
//         );
//         return {
//           result: true,
//           message: "OTP verified successfully",
//           data: {
//             id: user._id,
//             email: user.email,
//             name: user.name,
//             phoneOne: user.phone,
//             phoneTwo: user.phone,
//             roles: user.roles,
//           },
//         };
//       } else {
//         throw ApiError.badRequest("Invalid OTP");
//       }
//     } else {
//       throw ApiError.badRequest("User does not exist");
//     }
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw ApiError.badRequest(error.message);
//     }
//     throw ApiError.internal(error.message);
//   }
// };

// const resendOtp = async ({ email }) => {
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       // if (user.otp.isVerified === true) {
//       //     throw ApiError.badRequest('User already verified');
//       // }
//       if (user.otp.expiresAt > Date.now()) {
//         throw ApiError.badRequest("OTP already sent");
//       }
//       const otp = Math.floor(10000 + Math.random() * 9000);
//       const updatedUser = await User.findOneAndUpdate(
//         { email },
//         {
//           $set: {
//             "otp.code": otp,
//             "otp.expiresAt": Date.now() + 4 * 60 * 1000,
//           },
//         },
//         { new: true }
//       );
//       //send mail with 5 digit otp
//       await MailService.sendMail(user.email, updatedUser.otp.code, "OTP");
//       return {
//         result: true,
//         message: "OTP sent successfully",
//         data: updatedUser,
//       };
//     } else {
//       throw ApiError.badRequest("User does not exist");
//     }
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw ApiError.badRequest(error.message);
//     }
//     throw ApiError.internal(error.message);
//   }
// };

// const resetPassword = async (password, id) => {
//   const user = await User.findById(id);
//   if (!user) throw ApiError.notFound("User not found");
//   if (user.tempPassword === false)
//     throw ApiError.badRequest("You can't reset password");
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);
//   let updated = await user.updateOne(
//     { password: hashPassword, tempPassword: false, status: "Active" },
//     { new: true }
//   );
//   if (!updated) throw ApiError.badRequest("Password not updated");
//   return {
//     message: "Success",
//   };
// };

// const forgetPassword = async (email) => {
//   try {
//     let user = await db.User.findOne({ email });
//     if (!user) {
//       throw ApiError.badRequest("User does not exist");
//     }
//     const otp = Math.floor(10000 + Math.random() * 9000);
//     if (user) {
//       user = await db.User.findOneAndUpdate(
//         { email },
//         {
//           $set: {
//             otp: {
//               code: otp,
//               expiresAt: Date.now() + 4 * 60 * 1000,
//             },
//           },
//         },
//         { new: true }
//       );
//     }
//     //send mail with 5 digit otp
//     await MailService.sendMail(user.email, user.otp.code, "OTP");
//     return {
//       result: true,
//       message: "OTP sent successfully",
//     };
//   } catch (error) {
//     nextError(error);
//   }
// };

module.exports = {
  login,
  //   register,
  //   verifyOtp,
  //   resendOtp,
  //   resetPassword,
  //   forgetPassword,
};
