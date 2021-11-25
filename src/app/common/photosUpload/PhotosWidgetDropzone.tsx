import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone"; // photo dropzone
import { Header, Icon } from "semantic-ui-react";

interface Props {
  setFiles: (files: any) => void;
}

export default function PhotosWidgetDropzone({ setFiles }: Props) {
  // photos dropZone styles
  const dropzoneStyles = {
    border: "dashed 3px #eee",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as "center", // as "center" to handle warning claims about incompatible type
    height: 200,
  };

  const dropzoneActiveStyles = {
    borderColor: "green",
  };

  // note: set current selected image files
  // and pass down as child property to PhotosUploadWidget
  // todo: read more about useCallback()
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles);
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file), // note: preview is important, set image url to preview
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive
          ? { ...dropzoneStyles, ...dropzoneActiveStyles }
          : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  );
}
