import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { ActivityProfile } from "../../app/models/AttendeeProfile";
import { format } from "date-fns";

interface Props {
  profileActivity: ActivityProfile;
}

export default function ProfileActivityItem({ profileActivity }: Props) {
  return (
    <Card as={Link} to={`/activities/${profileActivity.id}`}>
      <Image
        src={`/assets/categoryImages/${profileActivity.category}.jpg`}
        style={{ minheight: 100, objectFit: "cover" }}
      />
      <Card.Content>
        <Card.Header>{profileActivity.title}</Card.Header>
        {/* <Card.Description>{profileActivity.title}</Card.Description> */}
      </Card.Content>
      <Card.Content extra>
        <Card.Meta>
          {format(new Date(profileActivity.date!), "do LLL")}
        </Card.Meta>
        <Icon name="clock" />
      </Card.Content>
    </Card>
  );
}
