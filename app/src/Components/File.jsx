import React, { useContext } from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FileContext } from "../Context/FilesContext";
import rejectFile from "../assets/rejectFile.svg";
import "./styles.css";

const FileComponent = () => {
  const { fileUploading, acceptedFilesArray, rejectedFilesArray, fileError } =
    useContext(FileContext);

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };
  const AnimatedProgress = ({ uploadingProgress }) => {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgressWithLabel value={uploadingProgress} />
      </div>
    );
  };
  const UploadedFile = ({ file }) => {
    const fileName = file.Name || file.name;
    const uploadingProgress = fileUploading?.[fileName];

    return (
      <div
        className={
          file.error ? "file-item-container-reject" : "file-item-container"
        }
        key={fileName}
      >
        <div className="file-item-main">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={file.ImageUrl || file.imageUrl || rejectFile}
              className="file-preview"
              alt="file-preview"
            />
            <div className="file-details">
              <p
                className={
                  file.error
                    ? "file-name file-name-reject"
                    : "file-name file-name-accept"
                }
              >
                {file.Name || file.name}
              </p>
              <p className="file-error">{file.error}</p>
            </div>
          </div>

          <div
            className={`progress-container 
        ${
          uploadingProgress != null && uploadingProgress < 99
            ? "progress-container-show"
            : "progress-container-hide"
        }
        `}
          >
            <AnimatedProgress
              uploadingProgress={
                uploadingProgress != null ? uploadingProgress : 0
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const RejectedFiles = rejectedFilesArray.map(({ file }) => (
    <div className="file-item-container-reject" key={file.path}>
      <div className="file-item">
        <img
          src={rejectFile}
          alt="file-preview"
          className="file-preview rejectedFile"
        />
        <div className="file-details">
          <p className="file-name file-name-reject">{file.path}</p>
          <p className="file-error">{fileError}</p>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      {(acceptedFilesArray.length > 0 || rejectedFilesArray.length > 0) && (
        <div className="files-selected">
          {acceptedFilesArray.map((file) => (
            <UploadedFile file={file} key={file.Name || file.name} />
          ))}
          {RejectedFiles}
        </div>
      )}
    </>
  );
};
export default FileComponent;
