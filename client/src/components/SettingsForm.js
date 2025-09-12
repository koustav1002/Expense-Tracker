import React, { useState } from "react";
import useStore from "../store";
import Input from "./ui/Input";
import { Button } from "./ui/Button";
import { BiLoader } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { getAccessToken } from "../store/utils";
import { toast } from "react-toastify";
import axios from "axios";

const SettingsForm = () => {
  const { user } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [selectedCountry, setSelectedCountry] = useState(
    { country: user?.country, currency: user?.currency } || ""
  );

  const [query, setQuery] = useState("");
  const [countriesData, setCountriesData] = useState([]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      };

      const URL = "http://127.0.0.1:8000/api-v1/user/";

      const { data: res } = await axios.put(URL, values, config);

      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));

        toast.success(res?.message ?? "Updated user information successfully!");
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Input
            name="firstname"
            label="First Name"
            placeholder="John"
            className="inputStyle"
            {...register('firstname', {
              required: 'First Name is required!'
            })}
            error={errors.firstname?.message}
          />
        </div>
        <div className="w-full">
          <Input
            name="lastname"
            label="Last Name"
            placeholder="Doe"
            className="inputStyle"
            {...register('lastname', {
              required: 'Last Name is required!'
            })}
            error={errors.lastname?.message}
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
            {...register('email', {
              required: 'Email is required!'
            })}
            error={errors.email?.message}
          />
        </div>
        <div className="w-full">
          <Input
            name="contact"
            label="Phone Number"
            placeholder="0123456789"
            className="inputStyle"
            {...register('contact', {
              required: 'Contact is required!'
            })}
            error={errors.contact?.message}
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
          type="submit"
          className="px-8 bg-violet-700 text-white"
        >
          {loading ? <BiLoader className="animate-spin text-white" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
