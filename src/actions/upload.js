"use server";

import { v2 as cloudinary } from "cloudinary";

// The cloudinary URL is already picked up by the SDK if it's set in process.env.CLOUDINARY_URL
// But explicitly configuring ensures safety if env vars map differently
cloudinary.config({
  secure: true
});

export async function uploadImage(formData) {
  try {
    const file = formData.get("file");
    
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "zynzyr" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            resolve({ success: false, error: error.message });
          } else {
            resolve({ success: true, url: result.secure_url });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error("Upload Action Error:", error);
    return { success: false, error: "Server upload failed" };
  }
}
