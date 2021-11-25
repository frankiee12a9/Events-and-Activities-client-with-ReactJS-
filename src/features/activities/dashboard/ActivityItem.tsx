import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityAttendeesList from "./ActivityAttendeesList";
import { observer } from "mobx-react-lite";

interface Props {
  activity: Activity;
}

export default observer(function ActivityItem({ activity }: Props) {
  //   const { activityStore } = useStore();
  return (
    <Segment.Group>
      {activity.isCancelled && (
        <Label
          style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
          color="red"
          content="Cancelled"
          ribbon
        />
      )}
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              style={{ marginBottom: 5 }}
              size="tiny"
              circular
              src="/assets/user.png"
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by
                <Label as={Link} to={`/profiles/${activity.host?.username}`}>
                  {activity.host?.displayName}
                </Label>
              </Item.Description>

              {/* if current logged in user is HOST */}
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You're hosting this activity
                  </Label>
                </Item.Description>
              )}

              {/* if current logged in user is GUEST */}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="grey">
                    You're going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment clearing>
        <span>
          {/* using date-fns format() to handle date error */}
          <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        {/* activityAttendeesList component */}
        <ActivityAttendeesList atttendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
});
