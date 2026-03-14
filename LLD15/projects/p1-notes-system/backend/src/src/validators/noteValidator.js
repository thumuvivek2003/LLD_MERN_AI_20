const validateNote = (req, res, next) => {

  const { title, content } = req.body;

  if (!title || title.length > 100) {
    return res.status(400).json({
      error: "Title is required and must be <= 100 characters"
    });
  }

  if (!content) {
    return res.status(400).json({
      error: "Content is required"
    });
  }

  next();
};

export default validateNote;