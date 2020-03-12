class ErrorHandler {
  constructor() {

  }

  /* This error returns an array of errors
     of format 
      {
        phone: "The 'phone' field does not match the pattern.",
        firstName: "The 'firstName' field is required."
      }
  */
  getErrors(validationResponse) {
    if (!(validationResponse === true)) {

      let item;
      let errors = {}

      for(const index in validationResponse)
      {
          item = validationResponse[index];
          errors[item.field] = item.message;
      }
      
      throw {
          name: "ValidationError",
          message: errors
      };
    }
  }
}

module.exports = ErrorHandler;