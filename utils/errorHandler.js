import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the file path
// const currentFilePath = fileURLToPath(import.meta.url);
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        // Capture the stack trace and extract the location
        // const stackTrace = new Error().stack;
        // this.fileLocation = this.extractLocation(stackTrace);
        // Get the file path
        this.fileLocation = fileURLToPath(import.meta.url);
    }
    // extractLocation(stack) {
    //     const lines = stack.split("\n");
    //     // Extract the second line of the stack trace (where the error was thrown)
    //     // It usually contains the file name, line number, and column number
    //     if (lines.length > 1) {
    //         return lines[1].trim(); // Clean the string to remove unnecessary whitespace
    //     }
    //     return "Unknown location";
    // }
}
export default ErrorHandler;



/* 

The connection between middleware/Error.js and utils/ErrorHandler.js is designed by your application but works naturally within the framework of Express because:

1. Express routes all errors passed to next() to the error-handling middleware.

2. A custom error class like ErrorHandler helps standardize the error objects that ErrorMiddleware processes.

3. The ErrorMiddleware doesn’t "know" about ErrorHandler explicitly—it just processes the structured error object it receives, making it reusable and modular.

*/