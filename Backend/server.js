const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const authRoutes = require("./app/routes/auth.route");
const contactRouter = require("./app/routes/contact.route");

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");
    // Gán database vào app.locals để dùng ở controller
    app.locals.db = MongoDB.client.db();

    app.use("/api/auth", authRoutes); // Đảm bảo đúng route

    app.use("/api/contacts", contactRouter);

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();
