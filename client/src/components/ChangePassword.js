import React, { useState } from "react";
import Input from "./ui/Input";
import { Button } from "./ui/Button";
import { BiLoader } from "react-icons/bi";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {};

  return (
    <div className="py-20">
      <form onSubmit={handleSubmit}>
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
            />

            <Input
              disabled={loading}
              type="password"
              name="newPassword"
              label="New Password"
            />

            <Input
              disabled={loading}
              type="password"
              name="confirmPassword"
              label="Confirm Password"
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
              type="reset"
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
