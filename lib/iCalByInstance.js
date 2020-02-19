const striptags = require("striptags");
// const ical = require("ical-generator");
const parser = require("parse-address");
const makeICal = require("./makeICal");
const processImage = require("./processImage");
const cloudinary = require("cloudinary").v2;

module.exports = data => {
  return new Promise((resolve, reject) => {
    const eventInstances = [];
    async function getInstances() {
      const venues = data.venues;
      for (const [idx, event] of data.events.entries()) {
        const regex = /id=(.*)&oid/gm;
        const imgId = regex.exec(event.largeImagePath);
        if (imgId) {
          event.imgId = imgId[1];
          processImage(event);
          event.processedImageUrl = cloudinary.url(
            `House%20of%20Blues%20Music%20Forward%20Foundation/${event.imgId}.png`
          );
        } else {
          event.processedImageUrl = null;
        }

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
            const venue = venues[instance.venueId];
            if (venue) {
              venue.parsedAddress = parser.parseLocation(venue.address);
            }
            eventInstances.push({
              start: instance.formattedDates.ISO8601.replace(
                /[-:]/g,
                ""
              ).replace(".000", ""),
              summary: instance.name,
              id: instance.id,
              url:
                instance.saleStatus != "On Sale"
                  ? event.purchaseUrl
                  : instance.purchaseUrl,
              location: `${venue ? `${venue.name}` : `No Venue`}`,
              description: `${instance.soldOut ? "SOLD OUT! " : ""}${striptags(
                event.description
              )}`,
              organizer: {
                name: process.env.feedBrand,
                email: process.env.brandEmail
              },
              categories: categories,
              image_link: event.processedImageUrl
            });
          }
        }
      }
      // try {
      //   // const cal = ical({
      //   //   events: eventInstances
      //   // }).toString();
      //   // const cal = makeICal({ events: eventInstances });
      //   // resolve(cal);
      // } catch (err) {
      //   console.error(err);
      //   reject(err);
      // }
      // const resolvedEventInstances = await Promise.all(eventInstances);
      const cal = makeICal({ events: eventInstances });
      resolve(cal);
    }

    getInstances();
  });
};
