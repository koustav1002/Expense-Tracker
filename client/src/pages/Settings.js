import React from "react";
import useStore from "../store/index";
import ChangePassword from "../components/ChangePassword";
import SettingsForm from "../components/SettingsForm";

const Settings = () => {
  const { user } = useStore((state) => state);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4 py-4 my-6 shadow-lg bg-gray-50 md:px-10 md:py-10">
        <div className="mt-6 border-b-2 border-gray-200">
          <p className="text-2xl 2xl:text-3xl font-semibold text-gray-600 mb-5">
            General Settings
          </p>
        </div>

        <div className="py-10">
          <p className="text-lg font-bold text-black">Profile Information</p>

          <div className="flex items-center gap-4 my-8">
            <div className="flex items-center justify-center font-bold w-12 h-12 text-white rounded-full cursor-pointer bg-violet-600 ">
              <p>{user?.firstName?.charAt(0)}</p>
            </div>
            <p className="text-2xl font-semibold text-black">
              {user?.firstName}
            </p>
          </div>
          <SettingsForm />

          {!user?.provided && <ChangePassword />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
