const _ = require("lodash");
const { Room } = require("../models/room.models");
const roomTypeService = require("./roomType.services");

class RoomService {
  async create(newRoomData) {
    // find room type if exist
    const roomType = await roomTypeService.findById(newRoomData.roomType);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    const newRoom = new Room(newRoomData);

    await newRoom.save();

    return newRoom;
  }

  async find(filter = {}) {
    const rooms = await Room.find(filter).populate({
      path: "roomType", // this is the room type field on Room collection
      model: "RoomType", // the model name that room.roomType is associated with or reference to
      select: "id codeName", // when populating select only the id and name of the parent
    });

    return rooms;
  }

  async search(filter = {}) {
    const priceQuery = {};

    if (filter?.minPrice) {
      priceQuery.price = { $gte: Number(filter?.minPrice) };
    }
    if (filter?.maxPrice) {
      priceQuery.price = { $lte: Number(filter?.max) };
    }
    if (!filter?.minPrice && filter?.maxPrice) {
      priceQuery.price = { $gte: 0 };
      priceQuery.price = { $lte: Number(filter?.maxPrice) };
    }

    const roomTypeFilter = {};
    let roomTypesIds;
    // if someone is filtering by room type

    if (filter?.roomType) {
      // find the room type, b/c we need its id

      const searchRoomTypeTerm = {
        // we are using the or operator to search the two fields below
        codeName: {
          $regex: filter?.roomType,
          $options: "i",
        },
      };

      const foundRoomTypes = await roomTypeService.findAll(searchRoomTypeTerm);

      // if something was found
      if (!_.isEmpty(foundRoomTypes)) {
        // store the filter.roomType, this because that is the fields name in Room model
        // this makes it to be part of the filter query

        roomTypesIds = foundRoomTypes.map((_rooType) => {
          return _rooType._id;
        });
      }
    }

    const searchTerm = {
      // we are using the or operator to search the two fields below
      $or: [],
    };

    if (filter?.search) {
      searchTerm["$or"].push({
        name: {
          $regex: filter?.search,
          $options: "i",
        },
      });
    }

    if (!_.isEmpty(priceQuery)) {
      searchTerm["$or"].push(priceQuery);
    }

    if (filter?.size) {
      searchTerm["$or"].push({
        size: { $regex: filter?.size, $options: "i" },
      });
    }

    if (!_.isEmpty(roomTypesIds)) {
      searchTerm["$or"].push({
        roomType: { $in: roomTypesIds },
      });
    }

    const result = await Room.find(searchTerm).populate({
      path: "roomType",
      model: "RoomType",
    });

    return result;
  }

  async findById(id) {
    const room = await Room.findById(id);

    return room;
  }

  async update(id, updatedData) {
    const room = await Room.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidator: true,
    });

    return room;
  }

  async delete(id) {
    const room = await Room.findByIdAndRemove(id);

    return room;
  }
}

module.exports = new RoomService();
