import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
// import * as signalR from "@microsoft/signalr";

// import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_CHAT_URL + "?activityId=" + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!,
          // handle negogiation with server
          //   skipNegotiation: true,
          //   transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection
        .start()
        .then(() => console.log("connection started."))
        .catch((err) => console.log("Errror establishing connection", err));

      this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
        runInAction(() => {
          comments.forEach((comment) => {
            // convert Datetime from server to js DateTime
            comment.timestamp = new Date(comment.timestamp);
          });
          this.comments = comments;
        });
      });

      this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
        runInAction(() => {
          comment.timestamp = new Date(comment.timestamp);
          this.comments.unshift(comment); // push most newly created comment to top
        });
      });
    }
  };

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((err) => console.log("Error stopping connection: ", err));
  };

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  };

  addComment = async (values: any) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke("SendComment", values); // SendComment must be matched exactly with the SendComment  method on ChatHub
    } catch (err) {
      console.log(err);
    }
  };
}
