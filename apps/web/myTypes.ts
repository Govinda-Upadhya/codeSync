export interface userType {
  id?: String;
  username: String;
  password?: String;
  googleId?: String;
  profile?: String;
  email: String;
}

export interface signupFormType {
  username: String;
  password: String;
  email: String;
}
export interface signinFormType {
  username: String;
  password: String;
}
