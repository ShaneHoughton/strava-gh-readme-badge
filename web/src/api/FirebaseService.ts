import { getFirestore, Firestore } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import app, { functions } from "../firebase";
import { TUserName } from "../utils/types";

class FireBaseApiService {
  protected db: Firestore;

  constructor() {
    this.db = getFirestore(app);
  }

  asyncCall = async (asyncFn: () => Promise<any>) => {
    let result = {
      data: null,
      error: null,
      success: false,
    };
    try {
      const { data } = await asyncFn();
      result.data = data;
      result.success = true;
    } catch (error: any) {
      console.error("Error executing async function:", error);
      result.error = error;
    }
    return result;
  };

  callMyFunction = async () => {
    const myFunction = httpsCallable(functions, "helloWorld");
    try {
      const result = await myFunction();
      console.log(result);
    } catch (error) {
      console.error("Error calling function:", error);
    }
  };

  setupUser = async (code: string, user_id: string): Promise<boolean> => {
    console.log("code", code);
    console.log("user_id", user_id);
    const myFunction = httpsCallable(functions, "setupUser");
    try {
      const newUser = await myFunction({ code, user_id });
      console.log(newUser);
      return true; // we created the user
    } catch (error) {
      console.error("Error calling function:", error);
      return false; // not successful
    }
  };

  getUserName = async (user_id: string): Promise<TUserName | null> => {
    const myFunction = httpsCallable(functions, "getUserName");
    try {
      const userData = (await myFunction({ user_id })).data as TUserName | null;
      return userData;
    } catch (error) {
      console.error("Error calling function:", error);
      return null; // not successful
    }
  };

  async getUserDataById(user_id: string): Promise<TUserName | null> {
    const myFunction = httpsCallable(functions, "getUserName");
    try {
      const userData: TUserName | null = (await myFunction({ user_id }))
        .data as { firstname: string; lastname: string };
      const { firstname = "", lastname = "" } = userData || {};
      return { firstname, lastname };
    } catch (error) {
      console.error("Error calling function:", error);
      return null; // not successful
    }
  }

  async getUserActivites(user_id: string): Promise<any[]> {
    const myFunction = httpsCallable(functions, "getUserActivities");
    try {
      const activities = (await myFunction({ user_id })).data;
      console.log(activities);
      return activities as any[];
    } catch (error) {
      console.error("Error calling function:", error);
      return [];
    }
  }
}

const FireBaseApi = new FireBaseApiService();
export default FireBaseApi;
