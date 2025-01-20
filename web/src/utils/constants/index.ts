export enum Pages {
  SETUP = "/setup",
  HOME = "/home",
  AUTH = "/",
  CATCH_ALL = "*",
}

export const CHARACTER_MIN = 8;

export const STRAVA_URL =
  "https://www.strava.com/oauth/authorize?client_id=107682&redirect_uri=http://localhost:5173/setup&response_type=code&scope=read_all,activity:read_all";

  //  "https://www.strava.com/oauth/authorize?client_id=107682&redirect_uri=http://localhost:3000/updateProfile&response_type=code&scope=read_all,activity:read_all";
