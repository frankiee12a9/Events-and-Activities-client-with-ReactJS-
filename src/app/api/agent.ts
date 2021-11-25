import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../../index";
import { Activity, ActivityFormValues } from "../models/activity";
import {
  ActivityProfile,
  AttendeeProfile,
  Photo,
} from "../models/AttendeeProfile";
import { PaginatedResult } from "../models/pagination";
import { User, UserForm } from "../models/user";
import { store } from "../stores/store";

// state management: step 2

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

// url is choosed based on development mode or production mode
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`; // sending up token with request
  return config;
});

// using interceptor to handle api error responses
axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep(1000);

    // handle when response is pagination
    const pagination = response.headers["pagination"];

    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      console.log("response with pagination", response.data);
      return response as AxiosResponse<PaginatedResult<any>>; // using type-safety
    }
    console.log("response: ", response);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error?.response!;
    // console.log(error?.response);
    switch (status) {
      case 400: {
        // display toast only when data is string
        if (typeof data === "string") {
          toast.error(data);
        }
        // redirect to 404 page when get invalid id
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modelStateErrors: any[] = []; // or const modelStateErrors = [] as any

          for (let key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        } else {
          toast.error(data);
        }
        break;
      }
      case 401: {
        toast.error("unauthorised");
        break;
      }
      case 404: {
        history.push("/not-found");
        break;
      }
      case 500: {
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
      }
    }
    return Promise.reject(error);
  }
);

// responses
const responseBody = <T>(response: AxiosResponse<T>) => response.data; // make a generic response

// requests
const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// activities Controller
const Activities = {
  list: (
    params: URLSearchParams // included pagination
  ) =>
    axios
      .get<PaginatedResult<Activity[]>>("/activities", { params })
      .then(responseBody),

  details: (id: string) => requests.get<Activity>(`/activities/${id}`),

  create: (activity: ActivityFormValues) =>
    requests.post<void>(`/activities`, activity),

  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),

  delete: (id: string) => requests.del<void>(`/activities/${id}`),

  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

// account Controller
const Account = {
  currentUser: () => requests.get<User>("/account"),
  register: (user: UserForm) => requests.post<User>("/account/register", user),
  login: (user: UserForm) => requests.post<User>("/account/login", user),
};

const AttendeeProfiles = {
  // testing solution
  activitiesProfileList: (params: URLSearchParams) =>
    axios.get<ActivityProfile[]>("/profiles", { params }).then(responseBody),

  getActivitiesProfileList: (username: string, predicate: string) =>
    requests.get<ActivityProfile[]>(
      `/profiles/${username}/activities?predicate=${predicate}`
    ),

  get: (username: string) =>
    requests.get<AttendeeProfile>(`/profiles/${username}`),

  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo>("photos", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  },

  updateMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),

  deletePhoto: (id: string) => requests.del(`photos/${id}/`),

  updateProfile: (updateProfile: Partial<AttendeeProfile>) =>
    requests.put(`/profiles`, updateProfile),

  updateFollowing: (username: string) =>
    requests.post(`/follow/${username}`, {}),

  listFollowings: (username: string, predicate: string) =>
    requests.get(`/follow/${username}?predicate=${predicate}`),
};

// controllers go here
const agent = {
  Activities,
  Account,
  AttendeeProfiles,
};

export default agent;
