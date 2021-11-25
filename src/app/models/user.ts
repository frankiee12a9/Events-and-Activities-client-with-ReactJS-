export interface User {
  username: string;
  displayName: string;
  token: string;
  bio?: string;
  image?: string;
}

// userForm model for register
export interface UserForm {
  email: string;
  password: string;
  userName?: string;
  displayName?: string;
}
