import app from "./app";
import config from "./config";
import { startBookingScheduler } from "./utils/scheduler";

const port = config.port;
app.listen(port, () => {
  console.log("Server is running on ", port);
  startBookingScheduler();
})