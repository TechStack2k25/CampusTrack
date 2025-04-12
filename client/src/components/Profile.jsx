import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setError, clearError, loginSuccess, setSuccess } from "../store/slices/userSlice";
import { userService } from "../api/userService";
import Input from "./Utils/Input";
import { useEffect, useState } from "react";
import { Loader } from "./Utils";

const Profile = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirmpassword: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
    },
  });

  const fetchUser = async () => {
    try {
      const res = await userService.currentUserData();
      if (res) {
        setUser(res);
        reset({
          name: res?.name || "",
          surname: res?.surname || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const changePassword=async()=>{
    dispatch(clearError());
    setPasswordChanging(true);
    try {
      const { new_password, confirmpassword, current_password } = password;

      if (showPasswordFields) {
        if (new_password.length < 6) {
          dispatch(setError("Min length is 6!"));
          return;
        }
        if (!confirmpassword || new_password !== confirmpassword) {
          dispatch(setError("Confirm your password!"));
          return;
        }
        if (!current_password) {
          dispatch(setError("Your current password!"));
          return;
        }

        const res = await userService.passwordUpdate(password);
        if (!res) {
          dispatch(setError("Try again later!"));
        } else {
          dispatch(setSuccess("Password updated!"));
          setPassword({
            current_password: "",
            new_password: "",
            confirmpassword: "",
          });
          setShowPasswordFields(false);
        }
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
    finally{
      setPasswordChanging(false);
    }
  }

  const onSubmit = async (data) => {
    dispatch(clearError());
    setUpdatingProfile(true);
    try {
      const newuser = await userService.updateUser(data);
      if (newuser) {
        dispatch(loginSuccess(newuser));
        dispatch(setSuccess("Profile updated successfully!"));
        setUser(newuser);
        reset({
          name: newuser?.name || "",
          surname: newuser?.surname || "",
        });
      } else {
        dispatch(setError("Try again later!"));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
    finally{
      setUpdatingProfile(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-md mx-auto mt-10 p-6 border dark:border-gray-800 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold text-center mb-4 dark:text-white">Profile</h2>

        {user ? (
          <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Email:
              </label>
              <input
                type="text"
                value={user?.email}
                disabled
                className="w-full dark:bg-gray-600 dark:text-white p-2 border border-gray-300 rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Name:
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Surname:
              </label>
              <input
                type="text"
                {...register("surname")}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors?.surname && (
                <p className="text-red-500 text-sm">{errors.surname.message}</p>
              )}
            </div>

            {user.role === "Student" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Semester:
                  </label>
                  <input
                    type="number"
                    value={user?.sem || 1}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Year:
                  </label>
                  <input
                    type="number"
                    value={user?.year || 1}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Degree:
                  </label>
                  <input
                    type="text"
                    value={user?.currentdegree?.name || ""}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>
              </>
            )}

            
            {/* Toggle Password Section */}
            <div className="flex items-center justify-between space-x-3">
              <label
                htmlFor="passwordToggle"
                className="text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
              >
                Change Password?
              </label>
              <input
                type="checkbox"
                id="passwordToggle"
                checked={showPasswordFields}
                onChange={() => setShowPasswordFields(!showPasswordFields)}
                className="h-5 w-5 border-gray-300 rounded bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {showPasswordFields && (
              <div className="mt-2 space-y-3 transition-all duration-300 ease-in-out">
                <Input
                  type="password"
                  value={password?.current_password}
                  label="Current Password"
                  placeholder="Current password here"
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      current_password: e.target.value.trim(),
                    }))
                  }
                />

                <Input
                  type="password"
                  value={password?.new_password}
                  label="New Password"
                  placeholder="New password here"
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      new_password: e.target.value.trim(),
                    }))
                  }
                />

                <Input
                  type="password"
                  value={password?.confirmpassword}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      confirmpassword: e.target.value.trim(),
                    }))
                  }
                />
              <button
                type="button"
                onClick={changePassword}
                disabled={passwordChanging}
                className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition duration-300"
              >
                {passwordChanging?'Updating...':'Update Password'}
              </button>
              </div>
            )}

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {updatingProfile?'Updating...':'Update Profile'}
            </button>
          </form>
          
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Profile;
