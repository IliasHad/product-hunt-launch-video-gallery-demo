require("dotenv").config();

const fetch = require("node-fetch");
const { GoogleSpreadsheet } = require("google-spreadsheet");
exports.handler = function (event, context, callback) {
  const date = new Date().toISOString();

  console.log(date);
  const accessSpreadSheet = async ({
    productName,
    topic,
    votesCount,
    videoUrl,
    featuredImage,
    url,
    created_at,
    description,
  }) => {
    const doc = new GoogleSpreadsheet(
      "1SDjahxizO3n200fuXhnUIpuEdyJhUb0Ewdl-CyL5_HQ"
    );

    // use service account creds
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
        new RegExp("\\\\n", "g"),
        "\n"
      ),
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

    const row = {
      productName,
      topic,
      votesCount,
      videoUrl,
      featuredImage,
      url,
      created_at,
      description,
    };

    await sheet.addRow(row);
  };
  const requestBody = {
    query: `
        {
            posts(order:RANKING,  postedBefore: ${date}) {
            
              edges {
                node {
                  name
                  url
                  topics {
                    edges {
                      node {
                         name
                      }
                    }
                  }
                  votesCount
                  media {
                    videoUrl
                    url
                  }
                  tagline
                
                  createdAt
                
                  
                }
              }
              
            }
          }
            `,
  };

  fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.PH_ACCESS_TOKEN}`,
      "Content-type": "Application/JSON",
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => {
      if (res.statusCode !== 200) {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: "Product Hunt sever error :(",
            err: res.data,
          }),
        });
      } else res.json();
    })
    .then(async ({ data, status }) => {
      if (data) {
        const filterData = data.posts.edges.filter((el) => {
          return el.node.media.map((el) => el.videoUrl)[0] !== null;
        });

        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: "Success",
            data: filterData.length,
          }),
        });
        for (let index = 0; index < filterData.length; index++) {
          const product = filterData[index];
          await accessSpreadSheet({
            productName: product.node.name,
            topic: product.node.topics.edges
              .map(({ node }) => node.name)
              .toString(),
            votesCount: product.node.votesCount,
            videoUrl: product.node.media[0].videoUrl,
            featuredImage: product.node.media[1].url,
            url: product.node.url,
            created_at: product.node.createdAt,
            description: product.node.tagline,
          });
        }
      }
    })
    .catch((err) =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "err",
          err,
        }),
      })
    );
};
