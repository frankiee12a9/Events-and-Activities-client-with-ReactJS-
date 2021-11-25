import React from "react";
import { Segment, List, Label, Item, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
}

export default observer(function ActivitySidebar({
  activity: { attendees, host },
}: Props) {
  // handle warning attendees is posisbly null
  if (!attendees) return null;

  let attendeesText = attendees.length > 1 ? "people" : "person";
  return (
    <>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees!.length} {attendeesText} going!
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees &&
            attendees.map((attendee) => (
              <Item style={{ position: "relative" }} key={attendee.username}>
                {attendee.username === host?.username && (
                  <Label
                    style={{ position: "absolute" }}
                    color="orange"
                    ribbon="right"
                  >
                    Host
                  </Label>
                )}
                <Image size="tiny" src={attendee.image || "/assets/user.png"} />
                <Item.Content verticalAlign="middle">
                  <Item.Header as="h3">
                    <Link to={`/profiles/${attendee.username}`}>
                      {attendee.displayName}
                    </Link>
                  </Item.Header>
                  {attendee.following && (
                    <Item.Extra style={{ color: "orange" }}>
                      following
                    </Item.Extra>
                  )}
                </Item.Content>
              </Item>
            ))}
        </List>
      </Segment>
    </>
  )
})
