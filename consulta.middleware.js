const consultaReporte = async (req, res, next) => {
  console.log(`Se realizo una consulta a la ruta ${req.route.path}`);
  next();
};

module.exports = { consultaReporte };
