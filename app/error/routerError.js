exports.error404Router = (req, res, next) => {
  return res.status(404).json({
    success: false,
    data: "Not found",
  });
};
