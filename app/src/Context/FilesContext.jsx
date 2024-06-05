import axios from "axios";
import { createContext, useState } from "react";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [acceptedFilesArray, setAcceptedFilesArray] = useState([]);
  const [rejectedFilesArray, setRejectedFilesArray] = useState([]);
  const [fileUploading, setFileUploading] = useState(null);
  const fileError = "Only image files are accepted";

  const allowedFileTypes = {
    "image/*": [],
    "video/*": [".mp4", ".mov", ".avi"],
  };

  const uploadFile = (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`http://localhost:5000/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  };

  const handleUpload = async (acceptedFiles) => {
    const uploadPromises = acceptedFiles.map((file) => {
      return new Promise((reject) => {
        // Send the file to the server
        uploadFile(file, (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          // Update the progress for this file
          setFileUploading((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress,
          }));
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    });
    // Execute all upload promises concurrently
    return Promise.all(uploadPromises);
  };

  return (
    <FileContext.Provider
      value={{
        files,
        setFiles,
        allowedFileTypes,
        acceptedFilesArray,
        setAcceptedFilesArray,
        rejectedFilesArray,
        setRejectedFilesArray,
        fileUploading,
        setFileUploading,
        fileError,
        handleUpload,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
