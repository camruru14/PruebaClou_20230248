import {v2} from "cloudinary"
import { CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer"

v2.config({
    cloud_name: "djtj1pex1",
    api_key: "893775775762777",
    api_secret: "WBDZ6YeNSS1hQXirVpi4qu1nudw",
})

const storage = new CloudinaryStorage({
    cloudinary: v2,
    params:{
        folder: "hospitalRosales",
        allowed_format: ["jpg", "png", "jpg", "webp", "svg"]
    }
})

export const upload = multer({storage})