// import jwt from "jsonwebtoken";

// const generateRefreshToken = (userId, isLogged) => {
//   const refreshToken = jwt.sign({ _id: userId }, process.env.tokenSignature, {
//     expiresIn: process.env.tokenExpires,
//   });
//   if (isLogged) {
//     try {
//       const decoded = jwt.verify(refreshToken, process.env.tokenSignature);
//       if (decoded) {
//         return refreshToken;
//       }
//     } catch (err) {
//       const newRefreshToken = jwt.sign({ _id: userId }, process.env.tokenSignature, {
//         expiresIn: process.env.tokenExpires,
//       });
//       return newRefreshToken;
//     }
//   }

//   return refreshToken;
// };

// // Example usage:
// const userId = 'user_id_here'; // Replace with the actual user ID
// const userIsLogged = true; // Replace with the user's logged-in status
// const refreshToken = generateRefreshToken(userId, userIsLogged);
