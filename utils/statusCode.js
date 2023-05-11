const http2 = require("http2");

module.exports.OK = http2.constants.HTTP_STATUS_OK;
module.exports.CREATED = http2.constants.HTTP_STATUS_CREATED;
module.exports.BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
module.exports.CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
module.exports.INTERNAL_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
module.exports.DUPLICATE_KEY_CODE = 11000;
