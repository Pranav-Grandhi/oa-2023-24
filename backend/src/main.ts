import { type AddressInfo } from "net";

import express from "express";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import cors from "cors";

import indexHandler from "./routes/index";

const app = express();
app.disable("x-powered-by");

// ----------------------------------- Middleware -----------------------------------
// JSON body parsing
app.use(express.json());
// request logger
if (process.env.NODE_ENV === "development") {
  const morgan = (await import("morgan")).default;
  app.use(morgan("tiny"));
}
// CORS
app.use(cors({ origin: "http://localhost:5500" }));

// ------------------------------------- Routes -------------------------------------
app.get("/", indexHandler);

// health check
app.get("/healthz", (_, res) => {
  return res.status(200).json({ status: "available" });
});

// not found
app.use((_, res) => {
  return res.status(404).json({
    error: {
      message: "This API endpoint does not exist.",
      type: "invalid_request_error",
    },
  });
});

// ------------------------------------- Server -------------------------------------
const server = app.listen(process.env.PORT ?? 8080, () => {
  console.log(
    `Listening: http://localhost:${(<AddressInfo>server.address()).port}/`
  );
  console.log(`▶️ Environment: ${process.env.NODE_ENV}`);
});

const shutdownManager = new GracefulShutdownManager(server);

// listen for syscall signals to shut down
process.on("SIGINT", async () => {
  console.log("SIGINT signal received: gracefully shutting down...");
  // stop the server and all connected clients
  shutdownManager.terminate(() => {
    console.log("HTTP server closed");
  });
});
