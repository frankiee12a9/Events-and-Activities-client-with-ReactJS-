import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import Loading from "../../app/layout/Loading";
import ProfileBody from "./ProfileBody";

export default observer(function ProfilePage() {
  const { username } = useParams<{ username: string }>(); // note: defined type of {username: string} is needed for useParams to understands
  const { profileStore } = useStore();
  const { getProfile, loadingProfile, attendeeProfile, setActiveTab } =
    profileStore;

  useEffect(() => {
    if (username) getProfile(username);
    // return () => {
    //   setActiveTab(0);
    // };
    return () => setActiveTab(0);
  }, [getProfile, username]);

  if (loadingProfile) return <Loading content="Profile is loading..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {attendeeProfile && (
          <>
            <ProfileHeader profile={attendeeProfile} />
            <ProfileBody profile={attendeeProfile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
