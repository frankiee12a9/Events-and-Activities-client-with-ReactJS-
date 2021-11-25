import { observer } from "mobx-react-lite";
import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { AttendeeProfile } from "../../app/models/AttendeeProfile";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface Profile {
  profile: AttendeeProfile;
}

export default observer(function ProfileCard({ profile }: Profile) {
  // handle bio is too long
  const truncate = (str: string | undefined) => {
    if (str) {
      return str.length > 40 ? str.substr(0, 37) + "..." : str;
    }
  };

  const followerText = profile.followersCount > 1 ? "followers" : "follower";

  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || `assets/user.png`} />
      <Card.Content>
        <Card.Header>{profile?.displayName}</Card.Header>
        <Card.Description>{truncate(profile?.bio)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {profile.followersCount} {followerText}
      </Card.Content>
      <FollowButton profile={profile} />
    </Card>
  );
});
