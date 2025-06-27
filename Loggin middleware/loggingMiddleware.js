const loggingMiddleware = (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    body: req.body,
  };
  console.log(JSON.stringify(logEntry)); // Replace with custom logging logic
  next();
};

module.exports = loggingMiddleware;
