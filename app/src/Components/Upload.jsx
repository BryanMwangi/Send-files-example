import { useContext } from "react";
import { useDropzone } from "react-dropzone";
import { FileContext } from "../Context/FilesContext";
import dropFile from "../assets/dropFile.svg";
import "./styles.css";

export const FileUploadScreen = () => {
  const {
    acceptedFilesArray,
    allowedFileTypes,
    setAcceptedFilesArray,
    setRejectedFilesArray,
    handleUpload,
    setFileUploading,
  } = useContext(FileContext);

  const { getRootProps, getInputProps, isDragReject, isDragAccept } =
    useDropzone({
      onDrop: async (acceptedFiles, rejectedFiles) => {
        const initialProgress = acceptedFiles.reduce((acc, file) => {
          acc[file.path] = 0;
          return acc;
        }, {});
        setFileUploading(initialProgress);
        const filesWithImageUrl = acceptedFiles.filter((file) => {
          let isAccepted = acceptedFilesArray.some((item) => {
            if (!item.Uploaded) {
              return item.name === file.name;
            }
            return item.Name === file.name;
          });
          if (!isAccepted) {
            if (file.type.startsWith("image/")) {
              // Generate a data URL for the image file
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                file.imageUrl = reader.result;
              };
            }
            return true;
          }
          return false;
        });

        // Update the state with files containing imageUrl property
        await setAcceptedFilesArray((prevFiles) => [
          ...prevFiles,
          ...filesWithImageUrl,
        ]);

        setRejectedFilesArray((prevFiles) => [...prevFiles, ...rejectedFiles]);
        await handleUpload(acceptedFiles);
      },
      accept: allowedFileTypes,
      multiple: true,
    });

  return (
    <div
      {...getRootProps({
        className: `drop-container ${
          isDragAccept
            ? "drop-container-active"
            : isDragReject
            ? "drop-container-reject"
            : ""
        }`,
      })}
    >
      <input {...getInputProps()} />
      <img src={dropFile} alt="upload-file-icon" className="drop-icon" />
      <h5>Drop your files here</h5>
      <div className="divider-container">
        <div className="divider-line-left" />
        <div className="divider-text">or</div>
        <div className="divider-line-right" />
      </div>
      <div className="browse-button">Browse files</div>
    </div>
  );
};
