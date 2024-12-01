const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");
const path = require("path");

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

const getFormattedDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const milliseconds = ("000" + date.getMilliseconds()).slice(-3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000`;
};

// Path to the database
const dbPath = path.join(__dirname, "../output.sqlite3");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database. news DB");
  }
});
// Route to fetch news where "news" column is true
router.get("/news", (req, res) => {
  const sql = `SELECT "Article Title", "Description" ,"Date of Publication","NPNWID" as ID FROM "New Parts" WHERE news = 1 LIMIT 6`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (rows.length === 0) {
      console.log("No news articles found.");
      res.status(200).json([]); // Send an empty array if no news
    } else {
      res.status(200).json(rows); // Send the news articles as JSON
    }
  });
});
router.get("/search", (req, res) => {
  const { query, page = 1, limit = 50 } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Count total matching articles
  const countSql = `
    SELECT COUNT(*) as total 
    FROM "New Parts" 
    WHERE news = 1 
    AND (
      LOWER("Article Title") LIKE LOWER(?) OR 
      LOWER("Description") LIKE LOWER(?)
    )
  `;

  // Search query with pagination
  const searchSql = `
    SELECT "Article Title", "Description", "Date of Publication", "NPNWID" as ID 
    FROM "New Parts" 
    WHERE news = 1 
    AND (
      LOWER("Article Title") LIKE LOWER(?) OR 
      LOWER("Description") LIKE LOWER(?)
    )
    LIMIT ? OFFSET ?
  `;

  const searchParam = `%${query}%`;

  // First, get the total count of articles
  db.get(countSql, [searchParam, searchParam], (countErr, countRow) => {
    if (countErr) {
      console.error("Error counting search results:", countErr.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const totalArticles = countRow.total;
    const totalPages = Math.ceil(totalArticles / limit);

    // Then, fetch the paginated results
    db.all(searchSql, [searchParam, searchParam, limit, offset], (err, rows) => {
      if (err) {
        console.error("Error executing search query:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({
        articles: rows,
        totalPages: totalPages,
        currentPage: page,
        totalArticles: totalArticles
      });
    });
  });
});
router.get("/latest-products", (req, res) => {
  const sql = `SELECT "Article Title", "Description" ,"Date of Publication","NPNWID" as ID FROM "New Parts" WHERE news = 0 LIMIT 6`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (rows.length === 0) {
      console.log("No news articles found.");
      res.status(200).json([]); // Send an empty array if no news
    } else {
      res.status(200).json(rows); // Send the news articles as JSON
    }
  });
});

router.get("/design-articles", (req, res) => {
  const sql = `SELECT "Article Title", "Description" ,"Date of Publication","NPNWID" as ID FROM "New Parts" WHERE news = 1 LIMIT 6`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (rows.length === 0) {
      console.log("No news articles found.");
      res.status(200).json([]); // Send an empty array if no news
    } else {
      res.status(200).json(rows); // Send the news articles as JSON
    }
  });
});

router.get("/deep-coverage", (req, res) => {
  const sql = `SELECT "Article Title", "Description" ,"Date of Publication", "NPNWID" as ID FROM "New Parts" WHERE news = 1 LIMIT 6`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (rows.length === 0) {
      console.log("No news articles found.");
      res.status(200).json([]); // Send an empty array if no news
    } else {
      res.status(200).json(rows); // Send the news articles as JSON
    }
  });
});

router.get("/news-all", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 50; // Default to 50 articles per page
  const offset = (page - 1) * limit; // Calculate offset

  const sql = `SELECT "Article Title", "Description", "Date of Publication", image FROM "New Parts" WHERE news = 1 LIMIT ? OFFSET ?`;

  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Get the total count of articles for pagination
      db.get(
        `SELECT COUNT(*) as total , "NPNWID" as ID FROM "New Parts" WHERE news = 1`,
        (err, result) => {
          if (err) {
            console.error("Error fetching total count:", err.message);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res.json({
              ID: result.ID,
              articles: rows,
              total: result.total, // Total number of articles
              currentPage: page,
              totalPages: Math.ceil(result.total / limit), // Total pages
            });
          }
        }
      );
    }
  });
});

router.get("/product-all", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 50; // Default to 50 articles per page
  const offset = (page - 1) * limit; // Calculate offset

  const sql = `SELECT "Article Title", "Description", "Date of Publication", image FROM "New Parts" WHERE news = 0 LIMIT ? OFFSET ?`;

  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Get the total count of articles for pagination
      db.get(
        `SELECT COUNT(*) as total , "NPNWID" as ID FROM "New Parts" WHERE news = 0`,
        (err, result) => {
          if (err) {
            console.error("Error fetching total count:", err.message);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res.json({
              ID: result.ID,
              articles: rows,
              total: result.total, // Total number of articles
              currentPage: page,
              totalPages: Math.ceil(result.total / limit), // Total pages
            });
          }
        }
      );
    }
  });
});

router.get("/student", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 50; // Default to 50 articles per page
  const offset = (page - 1) * limit; // Calculate offset

  const sql = `SELECT "Article Title", "Description", "Date of Publication", image FROM "New Parts" WHERE student = 1 LIMIT ? OFFSET ?`;

  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Get the total count of articles for pagination
      db.get(
        `SELECT COUNT(*) as total , "NPNWID" as ID FROM "New Parts" WHERE student = 1`,
        (err, result) => {
          if (err) {
            console.error("Error fetching total count:", err.message);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res.json({
              ID: result.ID,
              articles: rows,
              total: result.total, // Total number of articles
              currentPage: page,
              totalPages: Math.ceil(result.total / limit), // Total pages
            });
          }
        }
      );
    }
  });
});

const authenticateJWT = require("../middleware/auth");
router.get("/article/:id", authenticateJWT, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const dateTime = getFormattedDate();

  db.serialize(() => {
    const userSql = `SELECT isSubscribed, username FROM users WHERE id = ?`;
    db.get(userSql, [userId], (err, user) => {
      if (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({ message: "Error fetching user details" });
      }

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const articleSql = `
        SELECT 
          "Article Title", 
          "Description", 
          "Date of Publication", 
          "topstoryimagename",
          "isFree", 
          "isLoginRequired", 
          "isSubscriptionRequired" 
        FROM "New Parts" 
        WHERE NPNWID = ?
      `;
      db.get(articleSql, [id], (err, article) => {
        if (err) {
          console.error("Error fetching article:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (!article) {
          return res.status(404).json({ error: "Article not found" });
        }

        if (article.isFree || (!article.isSubscriptionRequired && !article.isLoginRequired) ||
          (article.isLoginRequired && !article.isSubscriptionRequired) ||
          (article.isSubscriptionRequired && user.isSubscribed)) {
          res.json({ article });
        } else {
          const preview = article.Description.substring(0, 300);
          res.status(403).json({ error: "Subscription required", preview });
        }

        const insertViewSql = `
          INSERT INTO ArticleViews (user_id, article_id, viewed_at, username, isSubscribed)
          VALUES (?, ?, ?, ?, ?)
        `;
        insertArticleViewWithRetry(db, insertViewSql, [userId, id, dateTime, user.username, user.isSubscribed]);
      });
    });
  });
});

function insertArticleViewWithRetry(db, sql, params, retryCount = 5) {
  db.run(sql, params, (err) => {
    if (err && err.code === "SQLITE_BUSY" && retryCount > 0) {
      console.warn("Database locked, retrying...");
      setTimeout(() => {
        insertArticleViewWithRetry(db, sql, params, retryCount - 1);
      }, 100); // Retry after 100ms
    } else if (err) {
      console.error("Error updating article views:", err);
    } else {
      console.log("Article view updated successfully");
    }
  });
}


router.get("/carasoul", (req, res) => {
  const sql = `SELECT "Article Title", "Description", "topstoryimagename", "NPNWID" as ID FROM "New Parts" ORDER BY View_Count DESC LIMIT 5`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (rows.length === 0) {
      console.log("No news articles found.");
      res.status(200).json([]); // Send an empty array if no news
    } else {
      res.status(200).json(rows); // Send the news articles as JSON
    }
  });
});
module.exports = router;
