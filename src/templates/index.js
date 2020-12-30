/* eslint-disable react/prop-types, no-useless-escape */

import React, { useState } from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql } from "gatsby";
import { Hero } from "../components/hero";
import Img from "gatsby-image";
import Modal from "../components/modal";
import { Link } from "gatsby";
import { FiExternalLink } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

const IndexPage = ({ data, pageContext }) => {
  const [videoModalActive, setVideomodalactive] = useState(false);
  const [video, setVideo] = useState("");
  const { currentPage, numPages } = pageContext;
  console.log(numPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  const prevPage =
    currentPage - 1 === 1 ? "/page" : "/page/" + (currentPage - 1).toString();
  const nextPage = "/page/" + (currentPage + 1).toString();
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

      <Hero />

      <Modal
        id="video-modal"
        show={videoModalActive}
        handleClose={closeModal}
        video={video}
        videoTag="iframe"
      />

      <section className="container grid-cols-1 sm:grid-cols-2 md:grid-cols-3  mx-auto md:row-gap-24 row-gap-12 px-4 py-10 grid md:gap-10 ">
        {data.allGoogleSheetSheet1Row.edges
          .filter(({ node }) => node.localFeaturedImage !== null)
          .filter(
            ({ node }) => node.localFeaturedImage.childImageSharp !== null
          )

          .filter(
            (el, i, array) =>
              array.findIndex(
                ({ node }, index) => node.productname !== index
              ) !== i
          )

          .sort((a, b) => b.votescount - a.votescount)
          .map(({ node }) => (
            <div
              className="md:flex flex-col"
              onClick={handleDivClicked}
              data-videourl={node.videourl}
              key={node.id}
            >
              <div className="md:flex-shrink-0 overflow-hidden relative	">
                <div
                  className="w-full h-full   absolute opacity-0 hover:opacity-100 "
                  style={{
                    zIndex: "99",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                  }}
                >
                  <FaPlay
                    size="3rem"
                    className="absolute "
                    color="#000"
                    style={{
                      zIndex: "2",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      transitionDelay: "50ms",
                    }}
                  />
                </div>

                <Img
                  fixed={node.localFeaturedImage.childImageSharp.fixed}
                  objectFit="cover"
                  objectPosition="50% 50%"
                  className="cursor-pointer"
                  imgStyle={{
                    display: "block",
                  }}
                />
              </div>
              <div className="mt-4 md:mt-3 ">
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">
                  {node.topic && node.topic.split(",")[0]}
                </div>
                <a
                  href={node.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-lg leading-tight font-semibold text-gray-900 hover:underline"
                >
                  {node.productname}

                  <span className="inline-block ml-4">
                    <FiExternalLink />
                  </span>
                </a>
                <p className="mt-2 text-gray-600">{node.description}</p>
              </div>
            </div>
          ))}
      </section>

      <div className="bg-white px-4 py-3 flex items-center justify-center w-full border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between ">
          {!isFirst && (
            <Link
              to={prevPage}
              rel="prev"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </Link>
          )}
          {!isLast && (
            <Link
              to={nextPage}
              rel="next"
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            >
              Next
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
export const query = graphql`
  query ProductListQuery($skip: Int!, $limit: Int!) {
    allGoogleSheetSheet1Row(
      sort: { fields: votescount, order: DESC }
      limit: $limit
      skip: $skip
    ) {
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
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
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
