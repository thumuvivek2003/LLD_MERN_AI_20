import { BaseRepository } from "../../../shared/base/BaseRepository.js";
import { RequestModel } from "../model/request.model.js";
import { REQUEST_STATUS } from "../../../shared/constants/requestType.js";

class RequestRepository extends BaseRepository {
  constructor() {
    super(RequestModel);
  }

  markCompleted(id) {
    return this.model.findByIdAndUpdate(
      id,
      { status: REQUEST_STATUS.COMPLETED, completedAt: new Date() },
      { new: true }
    );
  }

  markAssigned(id, assignedElevatorId) {
    return this.model.findByIdAndUpdate(
      id,
      { status: REQUEST_STATUS.ASSIGNED, assignedElevatorId },
      { new: true }
    );
  }

  getPendingRequests() {
    return this.model.find({ status: REQUEST_STATUS.PENDING });
  }

  findActiveRequests() {
    return this.model
      .find({ status: { $in: [REQUEST_STATUS.PENDING, REQUEST_STATUS.ASSIGNED] } })
      .sort({ createdAt: -1 });
  }
}

export const requestRepository = new RequestRepository();
