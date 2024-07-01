import express from "express";
import prisma from "../db";
import { getContactDetailsById, searchController } from "../controllers/search";

export const searchRouter = express.Router();

searchRouter.get("/", searchController);

searchRouter.get("/:id", getContactDetailsById)