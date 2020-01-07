const striptags = require("striptags");
const ical = require("ical-generator");
const parser = require("parse-address");
const makeICal = require("./makeICal");

module.exports = data => {
  return new Promise((resolve, reject) => {
    const eventInstances = [];
    async function getInstances() {
      const venues = data.venues;
      for (const [idx, event] of data.events.entries()) {
        for (const [idxx, instance] of event.instances.entries()) {
          if (event.type == "Tickets" || !process.env.ticketableOnly) {
            let cats = [];
            if (event.category) {
              cats = cats.concat(event.category);
            }
            if (event.custom.Type_of_Tickets_Available__c) {
              cats = cats.concat(
                event.custom.Type_of_Tickets_Available__c.split(";")
              );
            }
            const categories = cats.map(val => ({ name: val }));
            // console.log(categories);
            const venue = venues[instance.venueId];
            if (venue) {
              venue.parsedAddress = parser.parseLocation(venue.address);
              // console.log(venue);
            }
            eventInstances.push({
              start: instance.formattedDates.ISO8601,
              summary: instance.name,
              id: instance.id,
              url: instance.purchaseUrl,
              location: `${venue ? `${venue.name} ${venue.address}` : ``}`,
              description: striptags(event.description),
              organizer: {
                name: process.env.feedBrand,
                email: process.env.brandEmail
              },
              categories: categories,
              image_link: `${process.env.feedDomain}/ticket${event.smallImagePath}`
            });
          }
        }
      }
      try {
        // const cal = ical({
        //   events: eventInstances
        // }).toString();
        const cal = makeICal({ events: eventInstances });
        resolve(cal);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    }
    getInstances();
  });
};
