import { Link } from "gatsby";
import React from "react";

export const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto ">
        <div className="relative z-10 bg-white lg:w-full pb-8 text-center">
          <div className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 text-center">
            <div className="sm:text-center lg:text-center">
              <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                <span className="text-indigo-600">Discover </span>
                the best Product Hunt launch videos
              </h2>
              <p className="mt-3 text-center text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:my-8 md:text-xl ">
                Curated product hunt launch videos to get inspiration for your
                next PH launch
                <br />
                <span className="text-indigo-600 mt-2 block">
                  {" "}
                  Note: click on the product image to watch the PH launch video
                </span>
              </p>
              <div className=" sm:flex sm:justify-center lg:justify-center">
                <div className="rounded-md shadow">
                  <Link
                    to="/search"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    Search Videos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
