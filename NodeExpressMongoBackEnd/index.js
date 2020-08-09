// Import Server and secret
const server = require("./server.js");
require("dotenv").config();

// Establish dynamic PORT
const PORT = process.env.PORT || 5000;

// Run the server
server.listen(PORT, () => {
  console.log(`Port running from ${PORT}`);
});
