import React from "react";
import BasicTabs from "../components/Tab";

const HomePage = () => {

  return (
    <div className='flex min-h-screen'>
      <div className='w-1/3 border-r border-gray-300'>
        {/* Left container with tabs */}
        <BasicTabs />
      </div>
      <div className='w-2/3 p-4'>
        {/* Right container */}
        {/* Temporary placeholder content */}
        <div className='bg-gray-100 p-8 rounded shadow'>
          Content associated with the selected tab will be displayed here.
        </div>
        {/* End of placeholder content */}
      </div>
    </div>
  );
};

export default HomePage;
