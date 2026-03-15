import createApp from "./configs/app";
import { AppDataSource } from "./configs/psqlDb.config";
import { envConfig } from "./configs/env.config";
import "./queue/email_worker";

const app = createApp();
const PORT = Number(envConfig.PORT) || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
