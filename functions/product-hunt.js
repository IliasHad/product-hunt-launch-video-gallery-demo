require("dotenv").config();

const axios = require('axios');
const { GoogleSpreadsheet } = require("google-spreadsheet");
exports.handler = function (event, context, callback) {
  const date = new Date().toISOString();

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
 
  var data = JSON.stringify({
    query: ` {posts(order:RANKING,  postedBefore: "${date}") {\n            \n              edges {\n                node {\n                  name\n                  url\n                  topics {\n                    edges {\n                      node {\n                         name\n							}\n						}\n					}\n                  votesCount\n                  media {\n                    videoUrl\n                    url\n					}\n                  tagline\n                \n                  createdAt\n				}\n			}\n		}\n	}`,
    variables: {}
  });
  
  var config = {
    method: 'POST',
    url: 'https://api.producthunt.com/v2/api/graphql',
    headers: { 
      'Authorization': `Bearer ${process.env.PH_ACCESS_TOKEN}`,
      'Content-type': 'Application/JSON', 
    },
    data : data
  };
  
  axios(config)
  .then(async (res) => { 
      const filterData = res.data.data.posts.edges.filter((el) => {
        return el.node.media.map((el) => el.videoUrl)[0] !== null;
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
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Success",
          data: res.data.data.posts.length,
        }),
      });
     
 
  })
  .catch((err) =>
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      message: "err",
      err: "PH error",
    }),
  })
);
 
  
};
