import multer from "multer";


const storage=multer.memoryStorage();

const singleUpload=multer({storage}).single("file");
// console.log("-----SU",singleUpload);


export default singleUpload;





