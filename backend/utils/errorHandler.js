export default class extends Error {
  constructor(message, statusCode) {
    // Calling parent constructor of Error class
    super(message);
    this.statusCode = statusCode;
  }
}
