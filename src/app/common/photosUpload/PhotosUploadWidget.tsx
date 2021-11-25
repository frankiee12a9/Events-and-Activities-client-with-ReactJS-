import React, { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotosWidgetDropzone from "./PhotosWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
  uploadPhoto: (file: Blob) => void;
  loading: boolean;
}

export default function PhotosUploadWidget({ uploadPhoto, loading }: Props) {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  // todo: ???
  let onCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
    }
  };

  // todo: ???
  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
      console.log("photoUploadWidget render");
    };
  }, [files]);

  return (
    <Grid>
      {/* step 1 */}
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add photo" />
        <PhotosWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      {/* step 2 */}
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize image" />
        {/* display selected iamge into step-2 */}
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      {/* step 3 */}
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3 - Review & upload" />
        {files && files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            />
            <Button.Group widths={2} floated="right">
              <Button
                loading={loading}
                onClick={onCrop}
                positive
                icon="check"
              />
              <Button
                disabled={loading}
                onClick={() => setFiles([])}
                icon="close"
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
