const Admin = require("../../../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("../../../service/mail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
exports.signupAdmin = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (email) {
      email = email.toLowerCase();
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      token: generateToken(newAdmin._id, newAdmin.role, newAdmin.email),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (email) {
      email = email.toLowerCase();
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    res.json({
      success: true,
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar
      },
      token: generateToken(admin._id, admin.role, admin.email),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const otp = generateOTP();
    admin.otp = otp;
    await admin.save();

    await sendMail(admin.email, "Password Reset OTP", "forgotPassword.html", {
      username: admin.username,
      otp: admin.otp,
    });

    res.json({ success: true, message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };
    const otp = generateOTP();
    admin.otp = otp;
    await admin.save();
    await sendMail(admin.email, "Resend OTP", "resendOtp.html", {
      username: admin.username,
      otp: admin.otp,
    });
    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.query;
    const {oldPassword, newPassword } = req.body;

    if (!id || !newPassword || !oldPassword) {
      return res.status(400).json({ message: "Missing id or newPassword" });
    }
    const admin =  await Admin.findById(id)
    if(!admin){
      return res.status(404).json({message: "User not found"})
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Old Password" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.query;

    const admin = await Admin.findById(id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const updateData = req.body;
    const admin = await Admin.findById(id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.username = updateData.username || admin.username;
    // admin.email = updateData.email || admin.email;
    if (updateData.avatar !== undefined) {
      admin.avatar = updateData.avatar;
    }
    await admin.save();
    return res.status(200).json({ success: true, admin , message:"Successfully Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
