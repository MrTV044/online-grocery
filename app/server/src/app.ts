import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 8000;
const prisma = new PrismaClient();

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).send("<h1>Welcome!</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
