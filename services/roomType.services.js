const { RoomType } = require("../models/roomTypes.models");

class RoomTypeService {
  async create(newRoomTypeData) {
    const newRoomType = await RoomType.create(newRoomTypeData);

    return newRoomType;
  }

  async findOne(filter) {
    const roomType = await RoomType.findOne(filter);

    return roomType;
  }

  async findById(id) {
    const roomType = await RoomType.findById(id);

    return roomType;
  }

  async findAll(filter = {}) {
    const roomTypes = await RoomType.find(filter);

    return roomTypes;
  }

  async update(id, updateData = {}) {
    const roomType = await RoomType.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
      runValidators: true,
    });

    return roomType;
  }

  async delete(id) {
    const roomType = await RoomType.findByIdAndRemove(id);
    return roomType;
  }
}

module.exports = new RoomTypeService();
