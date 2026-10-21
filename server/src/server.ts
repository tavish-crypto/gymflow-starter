import "dotenv/config";
import { app } from "./app";
import { db } from "./db";

const port = Number(process.env.PORT ?? 5000);

const server = app.listen(port, () => {
  console.log(`GymFlow API running on http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await db.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
