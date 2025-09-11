import React, { useState } from "react";
import useStore from "../store";
import Input from "./ui/Input";
import { Button } from "./ui/Button";
import { BiLoader } from "react-icons/bi";

const SettingsForm = () => {
  const { user } = useStore((state) => state);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {};
  return (
    <form className="space-y-5 w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Input
            name="firstname"
            label="First Name"
            placeholder="John"
            className="inputStyle"
            /*register={register('firstname',{
                required:'First Name is required!'
            })}
            error={errors.firstname ?? ""}*/
          />
        </div>
        <div className="w-full">
          <Input
            name="lastname"
            label="Last Name"
            placeholder="Doe"
            className="inputStyle"
            /*register={register('lastname',{
                required:'Last Name is required!'
            })}
            error={errors.firstname ?? ""}*/
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Input
            name="email"
            label="Email"
            placeholder="john@doe.com"
            className="inputStyle"
            /*register={register('firstname',{
                required:'First Name is required!'
            })}
            error={errors.firstname ?? ""}*/
          />
        </div>
        <div className="w-full">
          <Input
            name="phone"
            label="Phone Number"
            placeholder="0123456789"
            className="inputStyle"
            /*register={register('lastname',{
                required:'Last Name is required!'
            })}
            error={errors.firstname ?? ""}*/
          />
        </div>
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
          className="px-8 bg-violet-700 text-white"
        >
          {loading ? <BiLoader className="animate-spin text-white" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
