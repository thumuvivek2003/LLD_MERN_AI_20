import { BaseRepository } from "../../../shared/base/BaseRepository.js";
import { ElevatorModel } from "../model/elevator.model.js";

class ElevatorRepository extends BaseRepository {
  constructor() {
    super(ElevatorModel);
  }

  updateState(elevatorId, state) {
    return this.model.findOneAndUpdate({ elevatorId }, { state }, { new: true });
  }

  updateCurrentFloor(elevatorId, currentFloor) {
    return this.model.findOneAndUpdate({ elevatorId }, { currentFloor }, { new: true });
  }

  upsert(data) {
    return this.model.findOneAndUpdate(
      { elevatorId: data.elevatorId },
      data,
      { new: true, upsert: true }
    );
  }

  findByElevatorId(elevatorId) {
    return this.model.findOne({ elevatorId });
  }
}

export const elevatorRepository = new ElevatorRepository();
