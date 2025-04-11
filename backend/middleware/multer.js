import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url'
let storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        let _filename = fileURLToPath(import.meta.url);
        let _dirname = path.dirname(_filename);


        const uploadDir = path.join(_dirname, '../Controllers/accountant/images')
        
        cb(null, uploadDir)
    },
    filename:(req, file, cb) =>{
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage: storage});

export default upload;