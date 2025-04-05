import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setError, setSuccess } from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmModal } from "../Utils";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { degreeService } from "../../api/degreeService";
import { v4 as uuid } from 'uuid';

const Degrees = () => {
    const dispatch = useDispatch();
    const [allDegrees, setAllDegrees] = useState([]);
    const [degree, setDegree] = useState(null);
    const [degreeTodelete, setDegreeToDelete] = useState(null);
    const college = useSelector((state) => state.user.user.college);//Id

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchData = async () => {
        try {
            const res = await degreeService.getAll({ _id: college });
            console.log(res);

            if (res) {
                setAllDegrees(res);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])


    const addDegree = async (degree) => {
        try {
            console.log(degree);
            
            const res = degree?._id ? await degreeService.updateDegree(degree) : await degreeService.addDegree({_id:college,...degree});
            if (res) {
                setAllDegrees(
                    (prev) => degree?._id ? 
                    prev.map((item)=>item?._id===degree?._id ? degree : item)
                :
                 [...prev, { _id: uuid(), ...degree }]);
                setDegree(null); // Close modal
                reset(); // Reset form fields
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = (degId) => {
        setDegreeToDelete(degId); // Store the degree ID
    };

    // Hide the delete modal without performing any action
    const handleCancelDelete = () => {
        setDegreeToDelete(null); // Clear the selected ID
    };

    // Confirm deletion and perform the delete action
    const handleConfirmDelete = async () => {
        try {
            const res = await degreeService.deleteDegree({ _id: degreeTodelete });
            if (res) {
                setAllDegrees((prev) => prev.filter((item) => item?._id !== degreeTodelete));
                setDegreeToDelete(null);
                dispatch(setSuccess('Deleted Successfully!'));
            }
        } catch (error) {
            dispatch(setError("Try again later!"));
        }
    };

    return (
        <div className="flex-1 p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="ml-8 sm:ml-0 text-2xl font-bold text-gray-700 dark:text-gray-300">Degrees</h1>
                <button
                    onClick={() => {
                        setDegree({ name: "", totalYears: 1, totalSemesters: 1 });
                        reset({ name: "", totalYears: 1, totalSemesters: 1 })
                    }}
                    className="transition duration-300 transform text-blue-600 px-3 py-1 dark:bg-gray-800 rounded shadow-md hover:bg-blue-700 hover:text-white font-black text-xl hover:rounded-full"
                >
                    +
                </button>
            </div>

            {/* degrees List */}
            {allDegrees && allDegrees?.length > 0 ?
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allDegrees?.map((deg) => (
                        <div
                        key={deg?._id}
                        className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-black p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-800"
                      >
                        {/* Degree Name */}
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{deg?.name}</h2>
                        </div>
                      
                        {/* Degree Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                            <span className="font-semibold">Years:</span> {deg?.totalYears || '-'}
                          </p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                            <span className="font-semibold">Semesters:</span> {deg?.totalSemesters || '-'}
                          </p>
                        </div>
                      
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-6">
                          <button
                            onClick={() => {
                              setDegree(deg);
                              reset(deg);
                            }}
                            className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-md"
                          >
                            <FiEdit className="text-lg" />
                            <span>Edit</span>
                          </button>
                      
                          <button
                            onClick={() => handleDelete(deg._id)}
                            className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-md"
                          >
                            <FiTrash2 className="text-lg" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      
                    ))}
                </div>

                :

                <p className="text-center text-gray-600 mt-12 text-lg">
                    No degrees to show.
                </p>
            }

            {/* confirmation to delete */}
            {
                degreeTodelete &&
                <ConfirmModal
                    text={'This action cannot be undone. Do you want to delete this degree?'}
                    done={handleConfirmDelete}
                    cancel={handleCancelDelete}
                    danger={true}
                    heading={"Are you sure?"}
                    cancelText={"Cancel"} doneText={"Confirm"}
                />
            }

            {/* Modal for Adding Degree */}
            {degree && (
                <div className="fixed z-30 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-950 dark:border dark:border-gray-700 w-96 p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => {
                                setDegree(null);
                                reset();
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                            {degree?._id ? 'Update' : 'Add'} Degree
                        </h2>
                        <form onSubmit={handleSubmit(addDegree)}>
                            {/* Degree Name */}
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 tracking-tight"
                                >
                                    Degree
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full px-4 py-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Degree total years */}
                            <div className="mb-4">
                                <label
                                    htmlFor="totalYears"
                                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 tracking-tight"
                                >
                                    Years
                                </label>
                                <input
                                    type="number"
                                    id="totalYears"
                                    {...register("totalYears", 
                                        { required: "Degree duration is required!",
                                        min: { value: 1, message: "Degree duration must be at least 1 year!" },
                                        max: { value: 5, message: "Degree duration cannot exceed 5 years!" },
                                         },
                                    )}
                                    className={`w-full px-4 py-2 border rounded ${errors.totalYears ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.totalYears && (
                                    <p className="text-sm text-red-500">{errors.totalYears.message}</p>
                                )}
                            </div>

                            {/* Degree total semesters */}
                            <div className="mb-4">
                                <label
                                    htmlFor="totalSemesters"
                                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 tracking-tight"
                                >
                                    Semesters
                                </label>
                                <input
                                    type="number"
                                    id="totalSemesters"
                                    {...register("totalSemesters", 
                                        { required: "Number of Semesters required!",
                                        min: { value: 1, message: "Number of Semesters must be at least 1 year!" },
                                        max: { value: 10, message: "Number of Semesters must not exceed 5 years!" },
                                         },
                                    )}
                                    className={`w-full px-4 py-2 border rounded ${errors.totalSemesters ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.totalSemesters && (
                                    <p className="text-sm text-red-500">{errors.totalSemesters.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="text-right">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 dark:hover:bg-indigo-800"
                                >
                                    {degree?._id ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Degrees;
