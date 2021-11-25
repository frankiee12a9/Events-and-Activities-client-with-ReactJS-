import { makeAutoObservable, reaction, runInAction } from "mobx";
import ActivityListPlaceholder from "../../features/activities/dashboard/ActivityListPlaceholder";
import agent from "../api/agent";
import {
  ActivityProfile,
  AttendeeProfile,
  Photo,
} from "../models/AttendeeProfile";
import { store } from "./store";

export class ProfileStore {
  attendeeProfile: AttendeeProfile | null = null;
  followings: AttendeeProfile[] = [];
  predicate = new Map().set("all", true); // activity predicate
  ActivitiesProfile: ActivityProfile[] = [];
  loadingProfile = false;
  updateLoading = false;
  loadingMainPhotoUpdate = false;
  profileUpdateLoading = false;
  loadingFollowings = false;
  loadingActivitiesProfile = false;
  activeTab = 0;

  constructor() {
    makeAutoObservable(this);

    // todo: read more about mobx reaction
    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "followings";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
        // testing
        this.predicate.keys();
        this.loadActivitiesProfile();
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

  get isCurrentUser() {
    if (store.userStore.user && this.attendeeProfile) {
      return store.userStore.user.username === this.attendeeProfile.username;
    }
    return false;
  }

  getProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const currProfile = await agent.AttendeeProfiles.get(username);
      runInAction(() => {
        this.attendeeProfile = currProfile;
        this.loadingProfile = false;
      });
    } catch (err) {
      console.log(err);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  get axiosParams() {
    const params = new URLSearchParams(); // todo: read more about URLSearchParams

    this.predicate.forEach((value, key) => {
      params.append(key, value);
    });

    return params;
  }

  // testing solution
  setPredicate = (predicate: string, value: boolean | string) => {
    // ??? helper
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== "all") this.predicate.delete(key);
      });
    };

    switch (predicate) {
      case "all": {
        this.predicate.delete("all");
        this.predicate.set("all", true);
        break;
      }
      case "pastActivities": {
        resetPredicate();
        this.predicate.set("pastActivities", true);
        break;
      }
      case "futureActivities": {
        resetPredicate();
        this.predicate.set("futureActivities", true);
        break;
      }
      case "hostingActivities": {
        resetPredicate();
        this.predicate.set("hostingActivities", true);
        break;
      }
      default:
        break;
    }
  };

  // testing solution
  loadActivitiesProfile = async () => {
    this.loadingActivitiesProfile = true;
    try {
      const result = await agent.AttendeeProfiles.activitiesProfileList(
        this.axiosParams
      );

      runInAction(() => {
        this.ActivitiesProfile = result;
        this.loadingActivitiesProfile = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loadingActivitiesProfile = false;
      });
    }
  };

  loadActivitiesProfile2 = async (username: string, predicate?: string) => {
    this.loadingActivitiesProfile = true;
    try {
      const result = await agent.AttendeeProfiles.getActivitiesProfileList(
        username,
        predicate!
      );
      runInAction(() => {
        this.ActivitiesProfile = result;
        this.loadingActivitiesProfile = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => (this.loadingActivitiesProfile = false));
    }
  };

  getActivitiesProfile() {
    return this.ActivitiesProfile;
  }

  uploadPhoto = async (file: Blob) => {
    this.updateLoading = true;
    try {
      const response = await agent.AttendeeProfiles.uploadPhoto(file);
      const photo = response?.data;
      runInAction(() => {
        if (this.attendeeProfile) {
          this.attendeeProfile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            // use helper here
            store.userStore.setImage(photo.url);
            this.attendeeProfile.image = photo.url;
          }
        }
      });

      this.updateLoading = false;
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.updateLoading = false;
      });
    }
  };

  updateMainPhoto = async (photo: Photo) => {
    this.loadingMainPhotoUpdate = true;
    try {
      await agent.AttendeeProfiles.updateMainPhoto(photo?.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.attendeeProfile && this.attendeeProfile.photos) {
          // set current main photo to false
          this.attendeeProfile.photos.find((x) => x.isMain)!.isMain = false;
          // set updated photo to main photo
          this.attendeeProfile.photos.find((x) => x.id === photo.id)!.isMain =
            true;
          // set url for main photo
          this.attendeeProfile.image = photo.url;
          this.loadingMainPhotoUpdate = false;
        }
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loadingMainPhotoUpdate = false;
      });
    }
  };

  // note: notice Partial<...>
  updateProfile = async (updateProfile: Partial<AttendeeProfile>) => {
    this.profileUpdateLoading = true;
    try {
      await agent.AttendeeProfiles.updateProfile(updateProfile);
      runInAction(() => {
        // make sure current displayName is not similar with the newly update name
        if (
          updateProfile.displayName &&
          updateProfile.displayName !== store.userStore.user?.displayName
        ) {
          store.userStore.setDisplayName(updateProfile.displayName);
        }

        this.attendeeProfile = {
          ...this.attendeeProfile,
          ...(updateProfile as AttendeeProfile), // as ... make Typescript happy
        };
      });

      this.profileUpdateLoading = false;
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.profileUpdateLoading = false;
      });
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loadingMainPhotoUpdate = true;
    try {
      await agent.AttendeeProfiles.deletePhoto(photo?.id);
      if (this.attendeeProfile) {
        // if (photo.isMain) {
        //   this.attendeeProfile!.photos!.find((x) => x.isMain)!.isMain = false;
        //   this.attendeeProfile.image = "";
        // }
        this.attendeeProfile.photos = this.attendeeProfile!.photos!.filter(
          (x) => x.id !== photo.id
        );
        this.loadingMainPhotoUpdate = false;
      }
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loadingMainPhotoUpdate = false;
      });
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.updateLoading = true;
    try {
      await agent.AttendeeProfiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.attendeeProfile &&
          this.attendeeProfile.username !== store.userStore.user?.username &&
          this.attendeeProfile.username === username // handle anonymous user affect followers | following's count on profile
        ) {
          following
            ? this.attendeeProfile.followersCount++
            : this.attendeeProfile.followersCount--;
          //   this.attendeeProfile.following = following;
          this.attendeeProfile.following = !this.attendeeProfile.following;
        }

        // if currently in logged in user's profile
        if (this.attendeeProfile?.username === store.userStore.user?.username) {
          // followers case
          if (this.activeTab === 3) {
            following
              ? this.attendeeProfile!.followersCount++
              : this.attendeeProfile!.followersCount--;
          } else {
            following
              ? this.attendeeProfile!.followingsCount++
              : this.attendeeProfile!.followingsCount--;
          }
        }

        this.followings?.forEach((profile) => {
          if (profile.username === username) {
            profile.following
              ? profile.followersCount--
              : profile.followersCount++;
            profile.following = !profile.following;
          }
        });

        this.updateLoading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => (this.updateLoading = false));
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;
    try {
      if (this.attendeeProfile) {
        const listFollowings = await agent.AttendeeProfiles.listFollowings(
          this.attendeeProfile!.username,
          predicate
        );
        runInAction(() => {
          this.followings = listFollowings as AttendeeProfile[];
          this.loadingFollowings = false;
        });
      }
    } catch (err) {
      console.log(err);
      runInAction(() => (this.loadingFollowings = false));
    }
  };
}
