import { observer } from "mobx-react-lite";
import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { AttendeeProfile } from "../../../app/models/AttendeeProfile";
import { Link } from "react-router-dom";
import ProfileCard from "../../Profiles/ProfileCard";

interface Props {
  atttendees: AttendeeProfile[];
}

export default observer(function ActivityAttendeesList({ atttendees }: Props) {
  const styles = {
    borderColor: "orange",
    borderWidth: 2,
  };

  return (
    <List horizontal>
      {atttendees &&
        atttendees.map((attendee) => (
          <Popup
            hoverable
            key={attendee.username}
            trigger={
              <List.Item
                key={attendee.username}
                as={Link}
                to={`/profiles/${attendee.username}`}
              >
                <Image
                  size="mini"
                  style={attendee.following ? styles : null}
                  circular
                  bordered
                  src={attendee.image || `/assets/user.png`}
                />
              </List.Item>
            }
          >
            <Popup.Content>
              <ProfileCard profile={attendee} />
            </Popup.Content>
          </Popup>
        ))}
    </List>
  );
});
