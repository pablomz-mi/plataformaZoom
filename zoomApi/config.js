const env = process.env.NODE_ENV || "production";

// Este archivo contiene las claves de la API de Zoom necesarias para autenticar las solicitudes.

const commonConfig = {
  APIKey: "TwTtujp4RfehnhUhjWlzLA",
  APISecret: "oWEfXnnL2Yl2nydkcT3MgwdfC3hYLjeK",
};

const config = {
  development: commonConfig,
  production: commonConfig,
};

module.exports = config[env]; // Exportación correcta
