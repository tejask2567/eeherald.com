const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const sqlite3 = require("sqlite3");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dbPath = path.join(__dirname, "../output.sqlite3");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database. news user DB");
  }
});

const router = express.Router();
const JWT_SECRET = "c41cbaadf05e4e364cf5e8143030663b"; // Ensure this is secured properly

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};
// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password, phone } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  // Check if user already exists in the database
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (row) {
      return res.status(400).json({ message: "User already exists" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    // Hash the password before storing in the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Insert new user into the database
      db.run(
        "INSERT INTO users (username, email, password, token, phone_number) VALUES (?, ?, ?, ?, ?)",
        [username, email, hashedPassword, token, phone],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error registering user lolme" });
          }
          sendVerificationEmail(email, token, username);
          // Respond with success
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  });
});
function sendVerificationEmail(email, token, username) {
  return new Promise((resolve, reject) => {
    // Configure the email transporter
    let transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like Yahoo, Outlook, etc.
      auth: {
        user: "a33708130@gmail.com", // Replace with your email
        pass: "xuve juwp novc qecr", // Replace with your email password or an app-specific password
      },
    });

    // Verification URL
    const verifyUrl = `http://localhost:5173/verify-email/${token}`;

    // Email options
    let mailOptions = {
      from: "a33708130@gmail.com",
      to: email,
      subject: "Email Verification - EE Herald",
      text: `Hello ${username},\n\nPlease verify your email by clicking the link below:\n${verifyUrl}\n\nThank you!`,
      html: `<p>Hello,</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verifyUrl}">Verify Email</a>
             <p>Thank you!</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        reject(error);
      } else {
        console.log("Verification email sent:", info.response);
        resolve(info);
      }
    });
  });
}

router.post("/verify-email/:token", (req, res) => {
  const { token } = req.params; // Extract token from req.params
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const query = "UPDATE users SET verified = 1 WHERE token = ?";
  db.run(query, [token], (err) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      db.get(
        "select username,email from users where token=?",
        [token],
        (err, row) => {
          if (err) {
            return res.status(500).json({ message: "Database error" });
          }
          if (row) {
            sendWelcomeEmail(row.email, row.username);
          }
        }
      );

      return res.status(200).json({ message: "verified" });
    }
  });
});

function sendWelcomeEmail(email, username) {
  return new Promise((resolve, reject) => {
    // Configure the email transporter
    let transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like Yahoo, Outlook, etc.
      auth: {
        user: "a33708130@gmail.com", // Replace with your email
        pass: "xuve juwp novc qecr", // Replace with your email password or an app-specific password
      },
    });
    // Email options
    let mailOptions = {
      from: "a33708130@gmail.com",
      to: email,
      subject: "Welcome to EE Herald",
      text: `Hello ${username},\n\nWelcome aboard \n\nThank you!`,
      html: `<p>Hello,</p>
             <p>Welcome aboard</p>
             <p>Thank you!</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        reject(error);
      } else {
        console.log("Welcome email sent:", info.response);
        resolve(info);
      }
    });
  });
}
// Login user and generate JWT
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  // Fetch user from database
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (!row) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare hashed passwords
    bcrypt.compare(password, row.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token with minimal information (user ID)
      const token = jwt.sign(
        { id: row.id }, // Only send the user ID in the token payload for security
        JWT_SECRET,
        { expiresIn: "4h" }
      );
      req.session.userId = email;
      req.session.isAdmin = true;
      req.session.isSubscribed = true;
      // Send back the token in the response
      res.json({ token, row, message: "Login successful" });
    });
  });
});

// Protected route example (use middleware)
const authenticateJWT = require("../middleware/auth");

router.get("/profile", authenticateJWT, (req, res) => {
  const userId = req.user.id; // ID from token payload

  // Fetch user details from the database
  const sql = `SELECT isSubscribed, roles,username FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, user) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user); // Send user data
  });
});

router.post("/request-password-reset", (req, res) => {
  const { email } = req.body;

  // Check if the email exists
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).send("Server error.");
    if (!user) return res.status(400).send("No account found with that email.");

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour (in ms)

    // Save the token and expiry to the database
    const updateQuery = `UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`;
    db.run(updateQuery, [resetToken, tokenExpiry, email], (err) => {
      if (err) {
        return res.status(500).send("Server error while saving token.");
      }

      // Send reset email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "a33708130@gmail.com", // Replace with your email
          pass: "xuve juwp novc qecr", // Replace with your app-specific password
        },
        port: 587,
        secure: false,
      });

      const mailOptions = {
        to: user.email,
        from: "no-reply@yourapp.com",
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://localhost:5173/reset-password/${resetToken}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).send("Error sending email.");
        }
        res.send("Password reset link has been sent to your email.");
      });
    });
  });
});

// Step 3: Reset Password
router.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const query = `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
  db.get(query, [token, Date.now()], (err, user) => {
    if (!user)
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send("Error hashing password.");

      const updateQuery = `UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`;
      db.run(updateQuery, [hashedPassword, user.id], (err) => {
        if (err) return res.status(500).send("Error updating password.");
        res.send("Password has been successfully reset.");
      });
    });
  });
});

router.post("/subcribe", async (req, res) => {
  const { username, email, phone } = req.body;

  // Check if all required fields are provided
  if (!username || !email) {
    return res.status(400).json({ message: "Username and email are required" });
  }

  // Check if user already exists in the database
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (row) {
      db.run(
        "UPDATE users SET isSubscribed = 1 WHERE email = ?",
        [email],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Error Subcribing use" });
          } else {
            res.status(201).json({ message: "User registered successfully" });
          }
        }
      );
    }
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "a33708130@gmail.com", // Replace with your email
        pass: "xuve juwp novc qecr", // Replace with your email password or app-specific password
      },
    });
    db.run(
      "INSERT INTO newsletter_users (name, email, phone) VALUES (?, ?, ?)",
      [username, email, phone || null],
      (err) => {
        if (err) {
          console.error("Error inserting into database:", err.message);
          return res.render("newsletter", {
            error: "An error occurred. Please try again.",
            username,
            email,
            phone,
            success: null,
          });
        }

        // Send a welcome email after successful registration
        const mailOptions = {
          from: "your-email@gmail.com", // Sender's email address
          to: email, // Receiver's email address (user's email)
          subject: "Welcome to EE Herald!",
          text: `Hi ${username},\n\nThank you for registering with EE Herald. Welcome aboard!\n\nBest Regards,\nEE Herald Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error.message);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }
    );
  });
});


module.exports = router;
