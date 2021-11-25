import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import PhotosUploadWidget from "../../app/common/photosUpload/PhotosUploadWidget";
import { AttendeeProfile, Photo } from "../../app/models/AttendeeProfile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: AttendeeProfile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      updateLoading,
      loadingMainPhotoUpdate,
      updateMainPhoto,
      deletePhoto,
    },
  } = useStore();

  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    updateMainPhoto(photo);
  };

  const handleDeletePhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo).then(() => console.log("deleted photo succesfully."));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="image" content="Photos" floated="left" />
          {isCurrentUser && (
            <Button
              floated="right"
              content={addPhotoMode ? "Cancel" : "Add photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotosUploadWidget
              uploadPhoto={handlePhotoUpload}
              loading={updateLoading} // problem here
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url || `/assets/user.png`} />
                    {isCurrentUser && (
                      <Button.Group fuild widths={2}>
                        <Button
                          basic
                          hoverale
                          color="green"
                          content="main"
                          name={"main" + photo.id}
                          disabled={photo.isMain}
                          loading={
                            target === "main" + photo.id &&
                            loadingMainPhotoUpdate
                          }
                          onClick={(e) => handleSetMainPhoto(photo, e)}
                        />
                        <Button
                          basic
                          color="red"
                          icon="trash"
                          name={photo.id}
                          loading={
                            target === photo.id && loadingMainPhotoUpdate
                          }
                          onClick={(e) => handleDeletePhoto(photo, e)}
                          disabled={photo.isMain}
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
