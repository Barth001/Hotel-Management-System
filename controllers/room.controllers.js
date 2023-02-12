const _ = require("lodash");

const roomService = require("../services/room.service");

class RoomController {
  async create(req, res) {
    const newRoom = await roomService.create(req.body);

    return res.status(201).send({
      success: true,
      message: "Room created successfully",
      data: newRoom,
    });
  }

  async find(req, res) {
    //When you want to make a search
    if (!_.isEmpty(req?.query)) {
      const searchedResult = await roomService.search(req.query);
      return res.status(200).send({
        success: true,
        message: "Rooms search successfully",
        data: searchedResult,
      });
    }

    const rooms = await roomService.find();

    if (_.isEmpty(rooms)) {
      return res.status(404).send({
        success: false,
        message: "Room not Found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Rooms found successfully",
      data: rooms,
    });
  }

  async findById(req, res) {
    const room = await roomService.findById(req.params.id);

    if (!room) {
      return res.status(404).send({
        success: false,
        message: "Room not Found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Room found successfully",
      data: room,
    });
  }

  async update(req, res) {
    const room = await roomService.update(req.params.id, req.body);

    return res.status(200).send({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  }

  async delete(req, res) {
    const room = await roomService.delete(req.params.id);

    return res.status(200).send({
      success: true,
      message: "updated room successfully",
      data: room,
    });
  }
}

module.exports = new RoomController();
