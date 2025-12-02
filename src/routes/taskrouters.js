import express from "express";
import {
  createTask,
  deleteTask,
  getAlltask,
  getFilteredTasks,
  searchTask,
  updateTask,
} from "../Controllers/tasksControllers.js";

const router = express.Router();
router.get("/filter", getFilteredTasks);
router.get("/search", searchTask);
router.post("/createtask", createTask);
router.get("/all", getAlltask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
