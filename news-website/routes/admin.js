const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const router = express.Router();
const { checkAdmin } = require("../middleware/checkAuth");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "../output.sqlite3");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    email === predefinedAdmin.email &&
    (await bcrypt.compare(password, predefinedAdmin.password))
  ) {
    req.session.userId = email;
    req.session.isAdmin = true;
    req.session.isSubscribed = true;
    res.json({
      success: true,
      message: "Login successful",
      redirectUrl: "/admin/dashboard",
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid credentials" });
  }
});

// Admin dashboard
router.get("/dashboard", checkAdmin, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  // First, get total count for pagination
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM "New Parts" 
    WHERE ("Article Title" LIKE ? OR "NPNWID" LIKE ?)
  `;
  
  // Then get the actual data with pagination
  const dataQuery = `
    SELECT * 
    FROM "New Parts" 
    WHERE ("Article Title" LIKE ? OR "NPNWID" LIKE ?)
    LIMIT ? OFFSET ?
  `;

  const searchParam = `%${search}%`;

  db.get(countQuery, [searchParam, searchParam], (err, countRow) => {
    if (err) {
      console.error("Error getting total count:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    db.all(dataQuery, [searchParam, searchParam, limit, offset], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({
        data: rows,
        total: countRow.total,
        currentPage: page,
        totalPages: Math.ceil(countRow.total / limit),
        limit
      });
    });
  });
});

// Filter news
router.get("/filter", checkAdmin, (req, res) => {
  const filterArticleType = req.query.filterArticleType || "";
  let filterNewsTypes = req.query.filterNewsType || [];

  if (!Array.isArray(filterNewsTypes)) {
    filterNewsTypes = [filterNewsTypes];
  }

  getFilteredNews(filterArticleType, filterNewsTypes)
    .then((filteredData) => res.json({ data: filteredData }))
    .catch((err) => {
      console.error("Error fetching filtered news:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

function getFilteredNews(articleType, newsTypes) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM "New Parts" WHERE 1=1';
    const params = [];

    if (articleType) {
      if (articleType === "isFree") {
        query += ' AND "isFree" = 1';
      } else if (articleType === "isLoginRequired") {
        query += ' AND "isLoginRequired" = 1';
      } else if (articleType === "isSubscriptionRequired") {
        query += ' AND "isSubscriptionRequired" = 1';
      }
    }

    if (newsTypes.length > 0) {
      const conditions = newsTypes.map((type) => `"${type}" = 1`).join(" OR ");
      query += ` AND (${conditions})`;
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Add news
router.post("/addNewsArticle", (req, res) => {
  const {
    title,
    description,
    date,
    sourceUrl,
    imageUrl,
    articleType,
    newsType,
  } = req.body;
  const newsTypes = Array.isArray(newsType) ? newsType : [newsType];

  const isFree = articleType === "isFree" ? 1 : 0;
  const isLoginRequired = articleType === "isLoginRequired" ? 1 : 0;
  const isSubscriptionRequired =
    articleType === "isSubscriptionRequired" ? 1 : 0;

  const isAutomotive = newsTypes.includes("automotive") ? 1 : 0;
  const isIndiasemiconductor = newsTypes.includes("Indiasemiconductor") ? 1 : 0;
  const isStudent = newsTypes.includes("student") ? 1 : 0;
  
  db.run(
    'INSERT INTO "New Parts" ("Article Title", "Description", "Image url", "Date of Publication", "Source url", "isFree", "isLoginRequired", "isSubscriptionRequired", "automotive", "Indiasemiconductor", "student", "View_Count") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      title,
      description,
      imageUrl,
      date,
      sourceUrl,
      isFree,
      isLoginRequired,
      isSubscriptionRequired,
      isAutomotive,
      isIndiasemiconductor,
      isStudent,
      0,
    ],
    (err) => {
      if (err) {
        console.error("Error adding news:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ success: true, message: "News added successfully" });
      }
    }
  );
});

// Update news
router.post("/edit/:id", (req, res) => {
  const {
    title,
    description,
    imageUrl,
    dateOfPublication,
    sourceUrl,
    articleType,
    newsType,
  } = req.body;
  const id = req.params.id;
  console.log("articleType",articleType)
  const newsTypes = Array.isArray(newsType) ? newsType : [newsType];

  const isFree = articleType === "isFree" ? 1 : 0;
  const isLoginRequired = articleType === "isLoginRequired" ? 1 : 0;
  const isSubscriptionRequired =
    articleType === "isSubscriptionRequired" ? 1 : 0;

  const isAutomotive = newsTypes.includes("automotive") ? 1 : 0;
  const isIndiasemiconductor = newsTypes.includes("Indiasemiconductor") ? 1 : 0;
  const isStudent = newsTypes.includes("student") ? 1 : 0;

  db.run(
    'UPDATE "New Parts" SET "Article Title" = ?, "Description" = ?, "Image url" = ?, "Date of Publication" = ?, "Source url" = ?, "isFree" = ?, "isLoginRequired" = ?, "isSubscriptionRequired" = ?, "automotive" = ?, "Indiasemiconductor" = ?, "student" = ? WHERE "NPNWID" = ?',
    [
      title,
      description,
      imageUrl,
      dateOfPublication,
      sourceUrl,
      isFree,
      isLoginRequired,
      isSubscriptionRequired,
      isAutomotive,
      isIndiasemiconductor,
      isStudent,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating news:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ success: true, message: "News updated successfully" });
      }
    }
  );
});

// Delete news
router.delete("/delete/:id", checkAdmin, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM "New Parts" WHERE "NPNWID" = ?', id, (err) => {
    if (err) {
      console.error("Error deleting news:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ success: true, message: "News deleted successfully" });
    }
  });
});

// User Analytics Route
router.get("/user-analytics", checkAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query; // Defaults for pagination and search
    const offset = (page - 1) * limit;

    // SQL query for filtering and pagination
    const userAnalyticsQuery = `
            SELECT user_id, username, article_id AS viewedArticle, viewed_at
            FROM ArticleViews
            WHERE username LIKE ?
            ORDER BY viewed_at DESC
            LIMIT ? OFFSET ?;
        `;

    // Total count for pagination info
    const countQuery = `
            SELECT COUNT(*) AS total
            FROM ArticleViews
            WHERE username LIKE ?;
        `;

    // Fetching total count for pagination
    db.get(countQuery, [`%${search}%`], (err, countRow) => {
      if (err) {
        console.error("Error fetching user analytics count:", err);
        return res
          .status(500)
          .json({ error: "Error fetching user analytics count." });
      }

      // Fetch paginated and filtered results
      db.all(
        userAnalyticsQuery,
        [`%${search}%`, parseInt(limit), parseInt(offset)],
        (err, rows) => {
          if (err) {
            console.error("Error fetching user analytics:", err);
            return res
              .status(500)
              .json({ error: "Error fetching user analytics." });
          } else {
            const totalPages = Math.ceil(countRow.total / limit);
            //console.log(rows)
            res.json({ users: rows, totalPages });
          }
        }
      );
    });
  } catch (err) {
    console.error("Error fetching user analytics:", err);
    res.status(500).json({ error: "Error fetching user analytics." });
  }
});

// Route to get article analytics
router.get("/article-analytics", checkAdmin, async (req, res) => {
  try {
    const { search = "", sort = "asc", page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // SQL query to fetch article analytics with pagination
    let articleAnalyticsQuery = `
            SELECT 
                ArticleViews.article_id,
                COUNT(ArticleViews.user_id) AS total_users,
                GROUP_CONCAT(ArticleViews.user_id) AS user_ids,
                GROUP_CONCAT(Users.username) AS usernames
            FROM ArticleViews
            INNER JOIN Users ON ArticleViews.user_id = Users.id
            WHERE ArticleViews.article_id LIKE ?
            GROUP BY ArticleViews.article_id
            ORDER BY total_users ${sort === "desc" ? "DESC" : "ASC"}
            LIMIT ? OFFSET ?;
        `;

    // Run the SQL query with pagination
    db.all(
      articleAnalyticsQuery,
      [`%${search}%`, limitNum, offset],
      (err, rows) => {
        if (err) {
          console.error("Error fetching article analytics:", err);
          res.status(500).json({ error: "Error fetching article analytics." });
        } else {
          // Get the total count for pagination
          const totalQuery = `
                    SELECT COUNT(DISTINCT article_id) AS total
                    FROM ArticleViews
                    WHERE article_id LIKE ?;
                `;
          db.get(totalQuery, [`%${search}%`], (err, totalRow) => {
            if (err) {
              console.error("Error fetching total count:", err);
              res.status(500).json({ error: "Error fetching total count." });
            } else {
              const total = totalRow.total || 0;
              res.json({ data: rows, total, page: pageNum, limit: limitNum });
            }
          });
        }
      }
    );
  } catch (err) {
    console.error("Error fetching article analytics:", err);
    res.status(500).json({ error: "Error fetching article analytics." });
  }
});
// Get subscription data with optional user_id filter
// Get subscription data with pagination and optional user_id filter
router.get("/subscriptions", checkAdmin, async (req, res) => {
  try {
    const userId = req.query.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = userId
      ? `SELECT id, username, email, isSubscribed FROM users WHERE id = ? LIMIT ? OFFSET ?`
      : `SELECT id, username, email, isSubscribed FROM users LIMIT ? OFFSET ?`;
    const params = userId ? [userId, limit, offset] : [limit, offset];

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error("Error fetching subscriptions:", err);
        res.status(500).json({ error: "Error fetching subscriptions." });
      } else {
        const countQuery = userId
          ? `SELECT COUNT(*) as count FROM users WHERE id = ?`
          : `SELECT COUNT(*) as count FROM users`;
        const countParams = userId ? [userId] : [];

        db.get(countQuery, countParams, (err, countResult) => {
          if (err) {
            console.error("Error fetching total count:", err);
            res.status(500).json({ error: "Error fetching total count." });
          } else {
            //console.log(rows)
            res.json({ data: rows, total: countResult.count, page, limit });
          }
        });
      }
    });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    res.status(500).json({ error: "Error fetching subscriptions." });
  }
});

// Update subscription status for a user
router.put("/subscriptions", checkAdmin, async (req, res) => {
  const { user_id, is_subscribed } = req.body;
  console.log("userid",user_id)
  console.log("issub",is_subscribed)
  if (user_id == null || is_subscribed == null) {
    return res
      .status(400)
      .json({ error: "user_id and is_subscribed are required" });
  }

  try {
    const updateQuery = `UPDATE users SET isSubscribed = ? WHERE id = ?`;
    db.run(updateQuery, [is_subscribed, user_id], function (err) {
      if (err) {
        console.error("Error updating subscription status:", err);
        res.status(500).json({ error: "Error updating subscription status." });
      } else {
        res.json({ message: "Subscription status updated successfully" });
      }
    });
  } catch (err) {
    console.error("Error updating subscription status:", err);
    res.status(500).json({ error: "Error updating subscription status." });
  }
});

router.post("/setAdminSession", (req, res) => {
  try {
    const { isAdmin } = req.body;

    console.log("SetAdminSession request:", {
      body: req.body,
      sessionBefore: req.session,
    });

    if (isAdmin) {
      req.session.isAdmin = true;

      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Failed to save session" });
        }

        console.log("Session after setting admin:", {
          sessionID: req.sessionID,
          session: req.session,
        });

        res.json({
          success: true,
          message: "Admin session set successfully",
          sessionInfo: {
            isAdmin: req.session.isAdmin,
            sessionID: req.sessionID,
          },
        });
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }
  } catch (error) {
    console.error("SetAdminSession error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
