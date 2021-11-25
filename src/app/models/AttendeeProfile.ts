import { Activity } from "./activity";
import { User } from "./user";

export interface AttendeeProfile {
  username: string;
  displayName: string;
  image?: string;
  followersCount: number;
  followingsCount: number;
  following: boolean;
  bio?: string;
  photos?: Photo[];
}

export class AttendeeProfile implements AttendeeProfile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface ActivityProfile {
  id: string;
  category: string;
  title: string;
  date: Date | null;
}
// export class ActivityProfile {
//   id: string = "";
//   category: string = "";
//   title: string = "";
//   date: Date | null = null;
//   constructor(activityProfile: ActivityProfile) {
//     this.id = activityProfile.id;
//     this.category = activityProfile.category;
//     this.title = activityProfile.title;
//     this.date = activityProfile.date;
//   }
// }

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
