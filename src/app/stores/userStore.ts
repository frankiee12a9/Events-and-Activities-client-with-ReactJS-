import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserForm } from "../models/user";
import { store } from "./store";

// state management: step 1
export default class UserStore {
  user: User | null = null;
  isLogout: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserForm) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      //   this.user = user;
      history.push("/activities");
      store.modalStore.closeModal(); // close modal when login succeeded
      console.log(user);
    } catch (err) {
      throw err;
    }
  };

  logout = () => {
    this.isLogout = true;
    try {
      store.commonStore.setToken(null);
      window.localStorage.removeItem("jwt");
      this.user = null;
      this.isLogout = true;
      history.push("/");
    } catch (err) {
      throw err;
    }
  };

  getUser = async () => {
    try {
      const user = await agent.Account.currentUser();
      runInAction(() => (this.user = user));
      //   this.user = user;
    } catch (err) {
      throw err;
    }
  };

  register = async (creds: UserForm) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token); // set token for newly created user
      this.user = user;
      history.push("/activities");
      store.modalStore.closeModal(); // close modal when login succeeded
      console.log(user);
    } catch (err) {
      throw err;
    }
  };

  // helper set display name
  setDisplayName = (name: string) => {
    if (this.user) this.user.displayName = name;
  };

  // helper for setting image ->  profileStore
  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };
}
