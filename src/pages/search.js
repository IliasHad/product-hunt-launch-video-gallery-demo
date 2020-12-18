/* eslint-disable react/prop-types, no-useless-escape */

import React, { useState } from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Modal from "../components/modal";
import { useQueryParam, StringParam } from "use-query-params";

const IndexPage = ({ data }) => {
  const [videoModalActive, setVideomodalactive] = useState(false);
  const [video, setVideo] = useState("");
  const [query, setQuery] = useQueryParam("query", StringParam);

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  };
  const youtube_parser = (url) => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      //error
      console.log(match);
    }
  };

  const handleDivClicked = (ev) => {
    // Retrieve the passed parameter from 'div_id' dataset
    let id = youtube_parser(ev.currentTarget.dataset.videourl);

    console.log(`Div ${id} clicked`);
    setVideo(`https://www.youtube.com/embed/${id}`);
    setVideomodalactive(true);
  };

  return (
    <Layout>
      <SEO
        keywords={[
          `producthunt`,
          `video`,
          `inspiration`,
          `product hunt launch video`,
        ]}
        title="Product Hunt Video Inspiration"
      />

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
                    Note: click on the product image to watch the PH launch
                    video
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        id="video-modal"
        show={videoModalActive}
        handleClose={closeModal}
        video={video}
        videoTag="iframe"
      />
      <div className="w-full lg:px-6  xl:px-12 flex justify-center">
        <div className="relative">
          <input
            onChange={(e) => setQuery(e.target.value)}
            className="transition-colors duration-100 ease-in-out focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 py-2 pr-4 pl-10 block w-full appearance-none leading-normal ds-input"
            type="text"
          />

          <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
            <svg
              className="fill-current pointer-events-none text-gray-600 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
            </svg>
          </div>
        </div>
      </div>
      <section className="container grid-cols-1 sm:grid-cols-2 md:grid-cols-3  mx-auto md:row-gap-24 row-gap-12 px-4 py-10 grid md:gap-10 ">
        {data.allGoogleSheetSheet1Row.edges
          .filter(({ node }) => node.localFeaturedImage !== null)
          .filter(
            ({ node }) => node.localFeaturedImage.childImageSharp !== null
          )

          .filter(
            (node, i, array) =>
              array.findIndex(
                ({ node }, index) => node.productname !== index
              ) !== i
          )
          .filter(
            ({ node }) =>
              node.productname.includes(query) ||
              node.description.includes(query) ||
              node.topic.includes(query)
          )

          .sort((a, b) => b.votescount - a.votescount)
          .map(({ node }) => (
            <div
              className="md:flex flex-col"
              onClick={handleDivClicked}
              data-videourl={node.videourl}
              key={node.id}
            >
              <div className="md:flex-shrink-0 overflow-hidden	">
                <Img
                  fixed={node.localFeaturedImage.childImageSharp.fixed}
                  objectFit="cover"
                  objectPosition="50% 50%"
                />
              </div>
              <div className="mt-4 md:mt-3 ">
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">
                  {node.topic.split(",")[0]}
                </div>
                <a
                  href={node.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-lg leading-tight font-semibold text-gray-900 hover:underline"
                >
                  {node.productname}
                </a>
                <p className="mt-2 text-gray-600">{node.description}</p>
              </div>
            </div>
          ))}
      </section>
    </Layout>
  );
};

export default IndexPage;
export const query = graphql`
  query {
    allGoogleSheetSheet1Row(sort: { order: DESC, fields: votescount }) {
      edges {
        node {
          featuredimage
          productname
          topic
          url
          votescount
          videourl
          id
          description
          localFeaturedImage {
            childImageSharp {
              fixed(width: 400, height: 250) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`;
