import React from "react";


const EmptyDashboard = ({features=[]}) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
            {feature.description}
          </p>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default EmptyDashboard;
