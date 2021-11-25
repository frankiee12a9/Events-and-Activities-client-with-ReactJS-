import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  appLoaded: boolean = false;
  token: string | null = window.localStorage.getItem("jwt");

  constructor() {
    makeAutoObservable(this);

    // mobx reaction
    reaction(
      () => this.token, // token as dependency
      // render this when token changed
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };

  setToken = (token: string | null) => {
    // store jwt token of current logged-in user in localStorage
    if (token) window.localStorage.setItem("jwt", token);
    this.token = token;
  };

  setApploaded = () => {
    this.appLoaded = true;
  };
}
