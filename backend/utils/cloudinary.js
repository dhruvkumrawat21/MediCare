import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//configuring the cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// to upload the files to cloudinary
export async function uploadToCloudinary(filePath, folder = "Doctor") {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "image"
        });
        //remove the local file aftre upload to the cloudinary 
        fs.unlinkSync(filePath);
        return result;
    }
    catch (err) {
        console.log("Cloudinary upload error", err);
        throw err;
    }
}


//to delete a image that is present in the cloudinary if user removes the ui 
export async function deleteFromCloudinary(publicId) {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    }
    catch (err) {
        console.log("Cloudinary delete error", err)
        throw err;
    }
}

export default cloudinary;