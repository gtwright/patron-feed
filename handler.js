"use strict";

const getFeed = require("./lib/getPatronFeed");
const makeiCal = require("./lib/iCalByInstance");

module.exports.ical = (event, context, callback) => {
	const url = `${process.env.feedDomain}/ticket/PatronTicket__PublicApiEventList`;
	getFeed(url)
		.then(async feed => {
			const message = await makeiCal(feed.data);
			const response = {
				statusCode: 200,
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

module.exports.redirect = async event => {
	const response = {
		statusCode: 301,
		headers: {
			Location: "https://services.opusaffair.com"
		}
	};

	return response;
};
