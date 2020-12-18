const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      query MyQuery {
        allGoogleSheetSheet1Row(sort: { fields: votescount, order: DESC }) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
  );
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const posts = result.data.allGoogleSheetSheet1Row.edges;
  const postsPerPage = 50;
  const numPages = Math.ceil(posts.length / postsPerPage);
  console.log(numPages);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/page/${i + 1}`,
      component: path.resolve("./src/templates/index.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};

const { createRemoteFileNode } = require("gatsby-source-filesystem");
exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
}) => {
  const { createNode } = actions;

  if (node.internal.type === "googleSheetSheet1Row") {
    try {
      const fileNode = await createRemoteFileNode({
        url: node.featuredimage,
        store,
        cache,
        createNode,
        parentNodeId: node.id,
        createNodeId,
      });

      if (fileNode) {
        node.localFeaturedImage___NODE = fileNode.id;
      }
    } catch (err) {
      node.localFeaturedImage = null;
    }
  }
};
