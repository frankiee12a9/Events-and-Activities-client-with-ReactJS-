import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ActivityHeader from "./ActivityHeader";
import ActivityInfo from "./ActivityInfo";
import ActivityChat from "./ActivityChat";
import ActivitySidebar from "./ActivitySidebar";

export default observer(function ActivityDetails({}) {
  const { activityStore } = useStore();
  const { id } = useParams<{ id: string }>(); // useParams
  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
    clearSelectedActivity,
  } = activityStore;

  useEffect(() => {
    if (id) loadActivity(id);
    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity]);

  //  !activity: handling `object possibly be undefined` from TS
  if (loadingInitial || !activity) return <Loading />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityHeader activity={activity} />
        <ActivityInfo activity={activity} />
        <ActivityChat activityId={activity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivitySidebar activity={activity} />
      </Grid.Column>
    </Grid>
  );
});
