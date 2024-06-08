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
        // initialise parameters for calculating speed
        let lastNow = Date.now() / 1000; //start time in seconds
        let lastSpeedTest = 0;
        let speedTest = 0;
        let lastLoadedBytes = 0;
        let estimatedTime = 0;
        const MBConvert = 1024 * 1024;
        // Send the file to the server
        uploadFile(file, (progressEvent) => {
          let now = Date.now() / 1000; //current time in seconds
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );

          lastLoadedBytes = progressEvent.loaded - lastLoadedBytes; // Loaded bytes

          // Calculate the elapsed time
          const elapsedTime = now - lastNow;
          lastNow = now;

          // Calculate the speed in MB/s
          if (elapsedTime > 0) {
            speedTest = Math.round(lastLoadedBytes / elapsedTime / MBConvert); // Convert bytes/sec to MB/sec
            speedTest = Math.round((speedTest + lastSpeedTest) / 2); // Average speed
            estimatedTime = Math.round(
              (progressEvent.total / MBConvert -
                progressEvent.loaded / MBConvert) /
                speedTest // Estimated time in seconds
            );
          }

          // reset the last speed test and loaded bytes
          lastLoadedBytes = progressEvent.loaded;
          lastSpeedTest = speedTest;

          // Update the progress for this file
          setFileUploading((prevProgress) => ({
            ...prevProgress,
            [file.name]: {
              progress: progress,
              speed: speedTest,
              estimatedTime: estimatedTime,
            },
          }));
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            reject(error);
            throw new Error(error);
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
