import React, { useState } from "react";
import Input from "./ui/Input";
import { Button } from "./ui/Button";
import { BiLoader } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { getAccessToken } from "../store/utils";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      };

      const URL = "http://127.0.0.1:8000/api-v1/user/change-password/";

      const { data: res } = await axios.put(URL, data, config);

      toast.success(res?.message);
    } catch (error) {
      console.error("Something went wrong: ", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <p className="text-xl font-bold text-black">Change Password</p>
          <span className="labelStyles">
            This will be used to log into your account and complete high
            severity actions.
          </span>

          <div className="mt-6">
            <Input
              disabled={loading}
              type="password"
              name="currentPassword"
              label="Current Password"
              {...register("currentPassword", {
                required: "Current Password is required!"
              })}
            />

            <Input
              disabled={loading}
              type="password"
              name="newPassword"
              label="New Password"
              {...register("newPassword", {
                required: "New Password is required!"
              })}
            />

            <Input
              disabled={loading}
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              {...register("confirmPassword", {
                required: "You need to confirm the new password"
              })}
            />
          </div>

          <div className="flex items-center gap-6 justify-end pb-10 border-b-2 border-gray-200">
            <Button
              variant="outline"
              loading={loading}
              type="reset"
              className="px-6 bg-transparent text-black border-gray-200"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              loading={loading}
              type="submit"
              className="px-8 bg-blue-700 text-white"
            >
              {loading ? (
                <BiLoader className="animate-spin text-white" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
