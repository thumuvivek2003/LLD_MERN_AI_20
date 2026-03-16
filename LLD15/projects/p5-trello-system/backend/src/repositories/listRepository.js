import List from "../models/List.js";

export const createList = (data) => {
    return List.create(data);
};

export const getListsByBoard = (boardId) => {
    return List.find({ boardId }).sort({ position: 1 });
};

export const updateList = (id, data) => {
    return List.findByIdAndUpdate(id, data, { new: true });
};

export const deleteList = (id) => {
    return List.findByIdAndDelete(id);
};

export const updatePosition = async (id, position) => {
    return await List.findByIdAndUpdate(
        id,
        { position },
        { new: true }
    );
};