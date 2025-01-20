import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import FireBaseApi from "../../api/FirebaseService";
import { Pages } from "../../utils/constants";
import Loading from "../../components/common/Loading"; // Adjust the import path as necessary

export default function SetUpPage() {
  const isSettingUp = useRef(false)
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isSettingUp.current) return;
    const handleSetup = async () => {
      isSettingUp.current = true;
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get("code");
      if (!code || !user?.uid) return;
      console.log("code", code);
      const wasSuccessful = await FireBaseApi.setupUser(code, user.uid);
      if (wasSuccessful) {
        navigate(Pages.HOME);
        return;
      }
      navigate(Pages.AUTH);
    };
    handleSetup();
  }, [location.search, user, navigate]);

  return (
    <div>
      <Loading />
    </div>
  );
}
