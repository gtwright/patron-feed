const getFeed = require("./lib/getPatronFeed");
const makeiCal = require("./lib/iCalByInstance");
const makeOther = require("./lib/otherCalByInstance");

module.exports.ical = (event, context, callback) => {
  const url = `${process.env.feedDomain}/ticket/PatronTicket__PublicApiEventList`;
  getFeed(url)
    .then(async feed => {
      const events = feed.data;
      const message = await makeiCal(events);
      const response = {
        statusCode: 200,
        header: {
          "Content-Type": "text/calendar"
        },
        body: message
      };
      callback(null, response);
    })
    .catch(error => {
      callback(error, {
        success: false
      });
    });
};

module.exports.otherCal = (event, context, callback) => {
  const url = `${process.env.feedDomain}/ticket/PatronTicket__PublicApiEventList`;
  getFeed(url)
    .then(async feed => {
      const message = await makeOther(feed.data);
      const response = {
        // headers: {
        //   "Content-Type": "text/html"
        // },
        statusCode: 200,
        body: JSON.stringify(message)
      };
      callback(null, response);
    })
    .catch(error => {
      callback(error, {
        success: false
      });
    });
};

module.exports.redirect = async event => {
  const response = {
    statusCode: 301,
    headers: {
      Location: "https://services.opusaffair.com"
    }
  };

  return response;
};

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Connected" })
  };
};
