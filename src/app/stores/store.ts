import { useContext, createContext } from "react";
import CommonStore from "../stores/commonStore";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import { ProfileStore } from "./profileStore";
import CommentStore from "./commentStore";

// state managegement:  step 3
interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
  commentStore: CommentStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(), // attendeeProfile
  commentStore: new CommentStore(),
};

// app context
export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
