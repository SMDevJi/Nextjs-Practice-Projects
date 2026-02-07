import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (file: Blob): Promise<string | undefined | null> => {
    if (!file) return

    try {
        const arrrayBuff = await file.arrayBuffer()
        const buffer = Buffer.from(arrrayBuff)

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: 'Accountly'
                },
                (error, result) => {
                    if (error) reject(error)
                    else { resolve(result?.secure_url) }
                }
            )
            uploadStream.end(buffer)
        })
    } catch (error) {
        console.log(error)
        return null
    }



}

export const deleteFile = async (url:string) => {
    if (!url.includes("cloudinary")) return;

    const afterUpload = url.split('/upload/')[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const id = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));

    
    const resourceType = url.includes('/video/') ? 'video' : 'image';

    //console.log(id, url, resourceType);

    try {
        const result = await cloudinary.uploader.destroy(id, {
            invalidate: true,
            resource_type: resourceType,
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(' Cloudinary Delete Error:', error);
        throw error;
    }
};

export default uploadOnCloudinary