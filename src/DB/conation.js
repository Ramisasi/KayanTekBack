// imports section
import mongoose from "mongoose";
// conation DB function
export const conationDB = async () => {
  return await mongoose.connect(process.env.dbName).then((result) => {
    console.log(`connoted DB ${process.env.dbName}`);
  });
};
