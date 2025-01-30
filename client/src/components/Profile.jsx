import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setError, clearError, loginSuccess, setSuccess } from "../store/slices/userSlice";
import { userService } from "../api/userService";

const Profile = () => {
  const user = useSelector((state)=>state.user?.user);
  const dispatch=useDispatch();

  const {
    register,
    handleSubmit,
    formState:{ errors }
  } = useForm({
    defaultValues: user, // Pre-fill form with user data
  });


  // updating user data
  const onSubmit = async(data) => {
    console.log("Updated Profile Data:", data);
    dispatch(clearError());
    try {
        const newuser=await userService.updateUser(data);
        if(newuser){
            dispatch(loginSuccess(newuser));
            dispatch(setSuccess("Profile updated successfully!"));
        }
        else{
            dispatch(setError("Try again later!"));
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message));
    }
  };

  return (
    <div className="flex-1 p-6">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">User Profile</h2>
            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                type="text"
                value={user?.email}
                disabled={true}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600"><strong>Name:</strong></label>
                <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600"><strong>Surname:</strong></label>
                <input
                type="text"
                {...register("surname")}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                {errors?.surname && <p className="text-red-500 text-sm">{errors.surname.message}</p>}
            </div>

            {user?.currentdegree && <div>
                <label className="block text-sm font-medium text-gray-600">Degree:</label>
                <input
                type="text"
                value={user?.currentdegree}
                disabled={true}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>}

            {user?.role && !["User","Admin"].includes(user.role) && user?.department && <div>
                <label className="block text-sm font-medium text-gray-600">Department:</label>
                <input
                type="text"
                value={user?.department}
                disabled={true}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>}

            {user?.role!=="User" && user?.college && <div>
                <label className="block text-sm font-medium text-gray-600">College:</label>
                <input
                type="text"
                value={user?.college}
                disabled={true}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>}

            {user?.year && <div>
                <label className="block text-sm font-medium text-gray-600">Batch:</label>
                <input
                type="number"
                value={user?.year}
                disabled={true}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>}

            {user?.sem && <div>
                <label className="block text-sm font-medium text-gray-600">Semester:</label>
                <input
                type="number"
                value={user?.sem}
                disabled={true}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>}

            {/* qualifications later on */}

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Update Profile
            </button>
            </form>
        </div>
    </div>
  );
};

export default Profile;
