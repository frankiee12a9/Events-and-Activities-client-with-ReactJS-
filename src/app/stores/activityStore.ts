import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { format } from "date-fns";
import { store } from "./store";
import { AttendeeProfile } from "../models/AttendeeProfile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activityRegister = new Map<string, Activity>(); // using map to store activities instead of array
  selectedActivity: Activity | undefined = undefined;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true); // activity predicate
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);

    // ???
    // todo: read more about reaction
    reaction(
      () => this.predicate.keys(),
      // reaction makes side effects
      () => {
        this.pagingParams = new PagingParams();
        this.activityRegister.clear();
        this.loadActivities();
      }
    );
  }

  // do paging
  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  // filter activities using predicate
  setPredicate = (predicate: string, value: string | Date) => {
    // ??? helper
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== "startDate") this.predicate.delete(key);
      });
    };

    switch (predicate) {
      case "all": {
        resetPredicate();
        this.predicate.set("all", true);
        break;
      }
      case "isGoing": {
        resetPredicate();
        this.predicate.set("isGoing", true);
        break;
      }
      case "isHosting": {
        resetPredicate();
        this.predicate.set("isHosting", true);
        break;
      }
      case "startDate": {
        this.predicate.delete("startDate");
        this.predicate.set("startDate", value);
        break;
      }
      default:
        break;
    }
  };

  get axiosParams() {
    const params = new URLSearchParams(); // todo: read more about URLSearchParams
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    // ???
    // predicate of activity filters
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  // get list of activities sorted by date priority
  get activitiesByDate() {
    return Array.from(this.activityRegister.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime() // notice !
    );
  }

  // filter group of activitie based time
  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        // const date = activity.date!.toISOString().split("T")[0]
        const date = format(activity.date!, "dd MMM yyyy h:mm aa");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const result = await agent.Activities.list(this.axiosParams); // response included pagination
      result.data.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log("error:", error);
      runInAction(() => this.setLoadingInitial(false));
    }
  };

  // helper to set response of pagination from server to pagination of client
  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  // loading specific activity
  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        // for specific thing, runInAction() is needed!
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  // set activity
  private setActivity = (activity: Activity) => {
    // verify roles of current loggin user
    // host or guest

    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (x) => x.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }
    activity.date = new Date(activity.date!);
    this.activityRegister.set(activity.id, activity);
  };

  // get activity
  private getActivity = (id: string) => {
    return this.activityRegister.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new AttendeeProfile(user!);
    try {
      await agent.Activities.create(activity);
      // scaffoler new activity object from activityFormValues
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      // set as current activity
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegister.set(activity.id, updatedActivity as Activity); // as -> type assertion
          this.selectedActivity = updatedActivity as Activity; // as -> type assertion
        }
      });
    } catch (error) {
      throw error;
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegister.delete(id);
        // handle loading filter button when delete
        // if (this.selectedActivity?.id === id) this.cancelSelectedActivity()
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        // 1. user attends to activity while isGoing: true => cancel
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (x) => x.username !== user?.username
            );
        } else {
          // 2. user attends to activity while isGoing: false => attends
          const anttendee = new AttendeeProfile(user!);
          this.selectedActivity?.attendees?.push(anttendee);
          this.selectedActivity!.isGoing = true;
        }
        // set activity
        this.activityRegister.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (err) {
      throw err;
    } finally {
      //   runInAction(() => (this.loading = false));
      this.loading = false;
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity!.isCancelled;
        this.activityRegister.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (err) {
      console.log(err);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  // clear previously selected activity
  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  // update following status in activities list
  updateAttendeeFollowing = (username: string) => {
    this.activityRegister.forEach((activity) => {
      activity.attendees?.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? (attendee.followersCount -= 1)
            : (attendee.followersCount += 1);
          attendee.following = !attendee.following;
        }
      });
    });
  };
}
