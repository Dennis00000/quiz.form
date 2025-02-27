const jwt = require('jsonwebtoken');
const serviceSupabase = require('../config/serviceSupabase');

const auth = async (req, res, next) => {
  try {
    // Log the authorization header for debugging
    console.log('Auth header:', req.header('Authorization'));
    console.log('Headers:', JSON.stringify(req.headers));
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'none');
    
    if (!token) {
      return res.status(401).json({ 
        error: { message: 'Authentication required', status: 401 }
      });
    }

    try {
      // For debugging, just pass through without verification
      console.log('Bypassing token verification for debugging');
      req.user = {
        userId: '3d14ac63-1b79-433f-9e7a-bae427cf49f3',
        role: 'user'
      };
      next();
      
      /* Normal verification code
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Decoded token:', decoded);
      
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      
      next();
      */
    } catch (error) {
      console.error('Token verification error:', error.name, error.message);
      return res.status(401).json({ 
        error: { message: 'Invalid token', status: 401 }
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      error: { message: 'Authentication failed', status: 401 }
    });
  }
};

module.exports = auth; 