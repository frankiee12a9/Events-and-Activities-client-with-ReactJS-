import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, Loader } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilter";
import ActivityList from "./ActivityList";
import ActivityListPlaceholder from "./ActivityListPlaceholder";

function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegister, pagination, setPagingParams } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  // handle pagination
  const handleGetNextPage = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    // setting this === 0 with caused page render just one activity when cancel submit or edit
    if (activityRegister.size <= 1) loadActivities();
  }, [activityRegister.size, loadActivities]);

  console.log(pagination?.totalpages, pagination?.currentPage);

  // filter loading for app
  //   if (activityStore.loadingInitial && !loadingNext)
  // return <Loading content="Loading acitivites..." />;

  return (
    <Grid>
      <Grid.Column width="10">
        {activityStore.loadingInitial && !loadingNext ? (
          <>
            <ActivityListPlaceholder />
          </>
        ) : (
          <>
            <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNextPage}
              hasMore={
                !loadingNext &&
                !!pagination &&
                pagination.currentPage < pagination.totalpages
              }
              initialLoad={false}
            >
              <ActivityList />
            </InfiniteScroll>
          </>
        )}
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
        {/* component */}
        {/* {editMode && <ActivityForm />} */}
      </Grid.Column>
      {/* todo: take a look at Loader  */}
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDashboard); // need mobx's observer() to consumed data from context
