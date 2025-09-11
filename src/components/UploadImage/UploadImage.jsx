import React, { useState } from "react";
import { uploadImageToCloudinary } from "../../utills/cloudinary";

function UploadImage({ onUpload }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      console.log("Cloudinary image URL:", imageUrl);
      onUpload(imageUrl); 
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default UploadImage;
