import React from "react";
import { Button, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

// testing solution
export default function ActivitiesProfileFilter() {
  const {
    profileStore: { predicate, setPredicate },
  } = useStore();

  console.log("predicate; ", predicate);
  const panes = [
    {
      menuItem: "Future Events",
      render: () => (
        <Tab.Pane
          active={predicate.has("futureActivities")}
          attached={false}
          onClick={() => setPredicate("futureActivities", "true")}
        />
      ),
    },
    {
      menuItem: "Past Events",
      render: () => (
        <Tab.Pane
          active={predicate.has("pastActivities")}
          attached={false}
          onClick={() => setPredicate("pastActivities", "true")}
        />
      ),
    },
    {
      menuItem: "Hosting Events",
      render: () => (
        <Tab.Pane
          active={predicate.has("hostingActivities")}
          attached={false}
          onClick={() => setPredicate("hostingEvents", "true")}
        />
      ),
    },
  ];

  return (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    // <>
    //   <Button.Group>
    //     <Button
    //       content="Future Events"
    //       active={predicate.has("futureActivities")}
    //       onClick={() => setPredicate("futureActivities", "true")}
    //     />
    //     <Button
    //       content="Past Events"
    //       active={predicate.has("pastActivities")}
    //       onClick={() => setPredicate("pastActivities", "true")}
    //     />
    //     <Button
    //       content="Hosting Events"
    //       active={predicate.has("hostingActivities")}
    //       onClick={() => setPredicate("hostingActivities", "true")}
    //     />
    //   </Button.Group>
    // </>
  );
}
