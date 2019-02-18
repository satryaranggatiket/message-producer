'use strict';

var methods = require('../configs/httpMethods');

/**
 * Express middleware for enhance response with stuff of response formatter.
 * @returns {Function} An express middleware for enhance an express response object.
 * @public
 */
var responseEnhancer = function responseEnhancer() {
  return function (req, res, next) {
    res.formatter = _generateFormatters(res);
    next();
  };
};

/**
 * Function to generate formatter object.
 * @param {Object} res An express response object.
 * @returns {Object} Formatter object that contain response formatter functions.
 * @private
 */
var _generateFormatters = function _generateFormatters(res) {
  var formatter = {};
  var responseBody = {};

  methods.map(function (method) {
    if (method.isSuccess) {
      formatter[method.name] = function (data, meta) {
        responseBody = _generateSuccessResponse({ data: data, meta: meta, method, virtuals:true });
        res.status(method.code).json(responseBody).end();
      };
    } else {
      formatter[method.name] = function (errors) {
        responseBody = _generateErrorResponse({ errors: errors, method });
        res.status(method.code).json(responseBody).end();
      };
    }
  });

  return formatter;
};

/**
 * Function to generate a success response format.
 * @param {Object} response Response input.
 * @param {*} response.data Meta field.
 * @param {Object=} response.meta Data field.
 * @returns {Object} Formatted response.
 * @private
 */
var _generateSuccessResponse = function _generateSuccessResponse(_ref) {
  var data = _ref.data,
  	  meta = _ref.meta,
  	  method = _ref.method;
  return {
  	code:method.code,
  	message:method.message,
    meta: meta,
    data: data
  };
};

/**
 * Function to generate an errors response format.
 * @param {Object} response Response input.
 * @param {Array} response.errors Errors field.
 * @returns {Object} Formatted response.
 * @private
 */
var _generateErrorResponse = function _generateErrorResponse(_ref2) {
  var errors = _ref2.errors,
  	  method = _ref2.method;
  return {
  	code:method.code,
  	message:method.message,
    errors: errors
  };
};

module.exports = responseEnhancer;