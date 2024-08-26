const Employee = require('../models/employeeModel');
const Candidate = require('../models/CandidateModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const candidate = await Candidate.findById(decoded.id);
                req.user = candidate;
                next();
            }
        } catch (err) {
            res.status(401).json({ message: 'Authorized token expired, please login again.' });
        }
    } else {
        res.status(401).json({ message: 'No token attached with the header.' });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the authorization header contains a Bearer token
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];

        try {
            if (token) {
               
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Log the decoded payload

                const employee = await Employee.findById(decoded.id);

                // Check if the employee exists and has an admin role
                if (employee && employee.role === 'admin') {
                    req.admin = employee; // Attach the admin employee to the request object
                    next(); // Proceed to the next middleware or route handler
                } else {
                    return res.status(403).json({ message: 'Only admins can access this resource.' });
                }
            }
        } catch (err) {
            // Log the exact error for better understanding
            console.error("JWT Verification Error:", err);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Authorized token expired, please login again.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token, please login again.' });
            } else {
                return res.status(401).json({ message: 'Token verification failed, please login again.' });
            }
        }
    } else {
        return res.status(401).json({ message: 'No token attached with the header.' });
    }
});

module.exports = { isAdmin };


module.exports = { authMiddleware, isAdmin };
