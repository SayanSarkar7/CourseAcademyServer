class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}
export default ErrorHandler;



/* 

The connection between middleware/Error.js and utils/ErrorHandler.js is designed by your application but works naturally within the framework of Express because:

1. Express routes all errors passed to next() to the error-handling middleware.

2. A custom error class like ErrorHandler helps standardize the error objects that ErrorMiddleware processes.

3. The ErrorMiddleware doesn’t "know" about ErrorHandler explicitly—it just processes the structured error object it receives, making it reusable and modular.

*/