const loggingMiddleware = (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    body: req.body,
  };
  console.log(JSON.stringify(logEntry)); 
  next();
};

module.exports = loggingMiddleware;
