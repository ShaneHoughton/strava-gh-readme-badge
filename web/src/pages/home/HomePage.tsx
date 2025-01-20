import { useEffect, useState } from "react";
import HomeHeader from "./components/HomeHeader"; // Adjust the import path as necessary
import { useAuth } from "../../providers/AuthProvider";

import FireBaseApi from "../../api/FirebaseService";
import { STRAVA_URL } from "../../utils/constants";
import { TUserName } from "../../utils/types";

const HomePage = () => {
  const { user } = useAuth();
  const [athleteName, setAtheleteName] = useState<TUserName | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    const getAthleteInfo = async () => {
      if (!user) return;
      const response = await FireBaseApi.getUserName(user.uid);
      if (!response) {
        window.location.href = STRAVA_URL;
        return;
      }
      setAtheleteName(response);
      const activitiesResponse = await FireBaseApi.getUserActivites(user.uid);
      setActivities(activitiesResponse);
    };

    getAthleteInfo();
  }, []);

  return (
    <div>
      <HomeHeader />
      <div>{`Hello there ${athleteName?.firstname}...`}</div>
    </div>
  );
};

export default HomePage;
