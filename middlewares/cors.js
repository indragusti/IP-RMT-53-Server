const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
};

// app.use(cors(corsOptions));

module.exports = corsOptions;
