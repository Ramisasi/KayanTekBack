import { apiError, asyncHandle } from "../../../middleware/errorHandle.js";
import { customerModel } from "../../../DB/model/customer.js";
import bcrypt from "bcryptjs";
export const updateCustomer = asyncHandle(async (req, res, next) => {
  const updateFields = {};

  const allowedFields = [
    "userName",
    "phoneNumber",
    "firstName",
    "lastName",
    "gender",
    "placeOfResidence",
    "personalInterests",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field]) {
      updateFields[field] = req.body[field];
    }
  });

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No valid fields to update." });
  }

  const options = {
    new: true,
  };

  const customer = await customerModel
    .findByIdAndUpdate(req.params.id, updateFields, options)
    .select("-_id -password");

  if (!customer) {
    return next(new apiError(`Invalid customer id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: customer });
});

export const updateCustomerEmail = asyncHandle(async (req, res, next) => {
  const { email } = req.body;
  const { id } = req.params;
  const findCustomer = await customerModel.findOneAndUpdate({ id }, { email });
  if (!findCustomer) {
    return next(new apiError("in-valid user id", 404));
  } else {
    res.status(200).json({
      message: "update email successfully",
      email: findCustomer.email,
    });
  }
});
// export const deleteCustomer = asyncHandle(async (req, res, next) => {
//   const { _id } = req.params;

//   const user = await customerModel.findById(_id);

//   if (!user) {
//     return next(new apiError(`No user found for this id ${_id}`, 404));
//   } else {
//     user.isDeleted = true;

//     await user.save();
//   }

//   res.status(200).json({ message: "the user is deleted" });
// });
export const deleteCustomer = async (req, res, next) => {
  const { id } = req.params;
  const user = await customerModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
  if (!user) {
    return next(new apiError("in-valid user Id ", 404));
  } else {
    res.status(200).json({
      message: "delete customer successfully",
    });
  }
};

// export const changeCustomerPassword = asyncHandle(async (req, res, next) => {
//   const { password, newPassword } = req.body;
//   const customerId = req.params.id;

//   const customer = await customerModel.findById(customerId);

//   if (!customer) {
//     return next(new apiError(`No document for this id ${customerId}`, 404));
//   }

//   const isPasswordValid = await bcrypt.compare(password, customer.password);

//   if (!isPasswordValid) {
//     res.status(401).json({ message: "Invalid current password" });
//   }

//   if (newPassword !== confirmPassword) {
//     res
//       .status(400)
//       .json({ message: "New password and confirm password do not match" });
//   }

//   const hashedNewPassword = await bcrypt.hash(
//     newPassword,
//     process.env.saltRand
//   );
//   const updatedcustomer = await customerModel.findByIdAndUpdate(
//     customerId,
//     { password: hashedNewPassword },
//     { new: true }
//   );

//   if (!updatedcustomer) {
//     return next(
//       new apiError(`Failed to update password for customer ${customerId}`, 500)
//     );
//   }

//   res.status(200).json({ message: "The password has been changed" });
// });

export const changeCustomerPassword = async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;
  const customerId = req.params.id;

  const customer = await customerModel.findById(customerId);

  if (!customer) {
    return next(new apiError(`No document for this id ${customerId}`, 404));
  }

  const isPasswordValid = await bcrypt.compare(password, customer.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid current password" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  try {
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.saltRand)
    );

    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedCustomer) {
      return next(
        new apiError(
          `Failed to update password for customer ${customerId}`,
          500
        )
      );
    }

    return res.status(200).json({ message: "The password has been changed" });
  } catch (error) {
    return next(new apiError(`Failed to update password: ${error}`, 500));
  }
};

export const getCustomer = asyncHandle(async (req, res, nex) => {
  const { id } = req.params;
  const customer = await customerModel
    .findById(id)
    .select(
      "-_id firstName lastName gender userName email phoneNumber placeOfResidence personalInterests"
    );
  if (!customer)
    return res.status(404).json({ message: "No Customer with this id found!" });
  else return res.status(200).json({ message: "don", customer });
});
