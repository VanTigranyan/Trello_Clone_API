module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if (typeof (err) === "string") {
    return res.status(400).json({ message: err });
  }

  if(err.message === 'Format is Authorization: Bearer [token]') {
    return res.status(401).json({
      message: "Invalid Token"
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "Unauthorized User") {
    return res.status(401).json({
      message: "Invalid Token"
    });
  }

  return res.status(500).json({
    message: err.message
  });
}
