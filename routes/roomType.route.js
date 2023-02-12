const express = require("express");
const roomTypeController = require("../controllers/roomType.controllers");

const roomTypeRouter = express.Router();

roomTypeRouter.post("/", roomTypeController.create);
roomTypeRouter.get("/:id", roomTypeController.findById);

roomTypeRouter.get("/", roomTypeController.findAll);

roomTypeRouter.put("/:id", roomTypeController.update);

roomTypeRouter.delete("/:id", roomTypeController.delete);

module.exports = roomTypeRouter;
