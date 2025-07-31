import { body, validationResult } from "express-validator";

const signupFormvalidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .customSanitizer((email) => email.toLowerCase()), // Normalize email case

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters")
    .escape(), // Prevent XSS

  body("age")
    .trim()
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 18 })
    .withMessage("Must be at least 18 years old")
    .toInt(), // Convert to number

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "non-binary", "prefer-not-to-say"])
    .withMessage("Invalid gender value"),

  // Validation handler
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          param: err.param,
          msg: err.msg,
          location: err.location,
        })),
      });
    }

    next();
  },
];

export default signupFormvalidator;
