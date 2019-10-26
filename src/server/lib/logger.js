/**
 * Parvez M Robin
 * me@parvezmrobin.com
 * Date: Oct 22, 2019
 */

const winston = require('winston');
const { simple, colorize } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: simple(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write to all logs with level `warn` and below to `validation.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/validation.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: colorize({all: true}),
  }));
}

module.exports = logger;
