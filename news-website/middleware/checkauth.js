// middleware/checkAuth.js

// Enhanced middleware for checking authentication
function checkAuth(req, res, next) {
    if (!req.session) {
        return res.status(500).json({ 
            error: 'Session not initialized',
            details: 'Server session configuration error'
        });
    }
    
    if (!req.session.userId) {
        return res.status(401).json({ 
            error: 'Authentication required',
            details: 'Please log in to access this resource'
        });
    }
    next();
}

// Enhanced middleware for checking admin status
function checkAdmin(req, res, next) {
    if (!req.session) {
        return res.status(500).json({ 
            error: 'Session not initialized',
            details: 'Server session configuration error'
        });
    }
    console.log("Check admin",req.headers.isadmin)
    if (!req.headers.isadmin) {
        return res.status(403).json({ 
            error: 'Access forbidden',
            details: 'Admin privileges required'
        });
    }
    
    next();
}

// Middleware to verify session health
function checkSession(req, res, next) {
    if (!req.session) {
        return res.status(500).json({ 
            error: 'Session not initialized',
            details: 'Server session configuration error'
        });
    }
    next();
}

module.exports = {
    checkAuth,
    checkAdmin,
    checkSession
};