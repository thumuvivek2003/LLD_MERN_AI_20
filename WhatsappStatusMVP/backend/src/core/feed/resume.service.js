// core/feed/resume.service.js — findResumeStatus()
// Given a user's ordered statuses (oldest→newest) with seen flags, returns the
// index of the first UNSEEN one so the viewer resumes where they left off.
// If everything is seen, resume at the start (re-watch from the beginning).
class ResumeService {
  findResumeIndex(statuses) {
    const idx = statuses.findIndex((s) => !s.seen);
    return idx === -1 ? 0 : idx;
  }
}

export const resumeService = new ResumeService();
