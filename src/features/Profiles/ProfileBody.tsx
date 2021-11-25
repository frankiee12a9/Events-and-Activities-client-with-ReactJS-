import React from "react";
import { Tab } from "semantic-ui-react";
import { AttendeeProfile } from "../../app/models/AttendeeProfile";
import { useStore } from "../../app/stores/store";
import ListProfileActivitiesEvents from "./ListProfileActivitiesEvents";
import ProfileAbout from "./ProfileAbout";
import ProfileActivities from "./ProfileActivities";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";

// Ctrl+k+u or Ctrl+k+c to comment

interface Props {
  profile: AttendeeProfile;
}

export default function ProfileBody({ profile }: Props) {
  const {
    profileStore: { setActiveTab },
  } = useStore();
  //
  const panes = [
    { menuItem: "About", render: () => <ProfileAbout /> }, // this component getting profile directly from store!
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: "Events", render: () => <ProfileActivities /> },
    { menuItem: "Followers", render: () => <ProfileFollowings /> },
    { menuItem: "Following", render: () => <ProfileFollowings /> },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)} // todo: read more about onTabChange
    />
  );
}
