import {v2} from "cloudinary"
import { CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer"

v2.config({
    cloud_name: "dpzt5igda",
    api_key: "895788924226575",
    api_secret: "IqkJCbJY1p-PyW4mgyxV1Vq3YOU",
})

const storage = new CloudinaryStorage({
    cloudinary: v2,
    params:{
        folder: "PruebaClou_20230248",
        allowed_format: ["jpg", "png", "jpg", "webp", "svg"]
    }
})

export const upload = multer({storage})