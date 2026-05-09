const dashboardRepository = require('./dashboard.repository');

class DashboardService {
  async getSummary() {
    const [stats, booksByGenre] = await Promise.all([
      dashboardRepository.getSummaryStats(),
      dashboardRepository.getBooksByGenre(),
    ]);
    return { ...stats, booksByGenre };
  }
}

module.exports = new DashboardService();
