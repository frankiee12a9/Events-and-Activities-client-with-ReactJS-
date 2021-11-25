import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns"; // format date time
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

export default observer(function ActivityHeader({ activity }: Props) {
  const {
    activityStore: { updateAttendance, loading, cancelActivityToggle },
  } = useStore();

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {/* filter display after activity is cancelled */}
        {activity.isCancelled && (
          <Label
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
            color="red"
            content="Cancelled"
            ribbon
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                {/* using format() */}
                <p>{format(activity.date!, "dd MMM yyyy")}</p>
                <p>
                  Hosted by
                  <strong>
                    <Link to={`/profiles/${activity.host?.displayName}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            <Button
              color={activity.isCancelled ? "green" : "red"}
              floated="left"
              basic
              content={
                activity.isCancelled
                  ? "Re-activate Activity"
                  : "Cancel activity"
              }
              onClick={cancelActivityToggle}
              loading={loading}
            />
            <Button
              color="orange"
              floated="right"
              as={Link}
              to={`/manage/${activity.id}`}
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button loading={loading} color="purple" onClick={updateAttendance}>
            Cancel activity
          </Button>
        ) : (
          <Button
            disabled={activity.isCancelled} // can not join when activity is cancelled
            loading={loading}
            color="teal"
            floated="left"
            onClick={updateAttendance}
          >
            Join activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
});
