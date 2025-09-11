import axios from "axios";


const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dusyr10f2/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "petbuddy"; 

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url; 
  } catch (error) {
    console.error("Greška kod upload-a na Cloudinary:", error);
    throw error;
  }
};
