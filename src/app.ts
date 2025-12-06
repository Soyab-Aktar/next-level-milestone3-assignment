import express, { Request, Response } from "express";
import initdb from "./config/db";
const app = express();

app.use(express.json());

initdb();

app.get('/', (req: Request, res: Response) => {
  res.send("Hey its working......");
})

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})

export default app;