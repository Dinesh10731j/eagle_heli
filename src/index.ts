import createApp from "./configs/app";
import { AppDataSource } from "./configs/psqlDb.config";
import { envConfig } from "./configs/env.config";
import { createServer } from "http";
import { initSocket } from "./configs/socket.config";
import "./queue/email_worker";
import chalk from "chalk";

const app = createApp();
const PORT = Number(envConfig.PORT) || 5000;
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || "5433";
const dbName = process.env.DB_NAME || "eagle_heli";
const dbUser = process.env.DB_USER_NAME || "postgres";

console.log(
  chalk.cyan(
    `DB target -> host=${dbHost} port=${dbPort} db=${dbName} user=${dbUser}`
  )
);

AppDataSource.initialize()
  .then(async () => {
    console.log(chalk.green("Database connected"));
    if (process.env.NODE_ENV !== "test" && process.env.RUN_MIGRATIONS !== "false") {
      await AppDataSource.runMigrations();
      console.log(chalk.green("Database migrations applied"));
    }

    const server = createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(chalk.blue(`Server running on http://localhost:${PORT}`));
    });
  })
  .catch((err) => {
    console.error(chalk.red("Database connection failed"), err);
  });
