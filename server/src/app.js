const testRoutes = require('./routes/api/test');
// ... other imports

// Add this with your other route registrations
app.use('/api/test', testRoutes); 