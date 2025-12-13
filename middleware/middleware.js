const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET


const auth = (req, res, next) => {

    try {
        const token = req.header('Authorization'); 

        if (!token) {
            return res.status(401).json({ message: "Authorization Token is Missing" });
        }

        jwt.verify(token, secretKey, async (err, decoded) => {
            // console.log(token, "check ")
            if (err) {
                return res.status(700).json({ message: "Invalid token" });
            }

            if (!decoded.id) {
                return res.status(700).json({ message: "Token is invalid: ID not found" });
            }
            req.user = decoded;
            next();
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = auth;