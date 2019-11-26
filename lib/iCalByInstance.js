const striptags = require("striptags");
const ical = require("ical-generator");

module.exports = data => {
  return new Promise((resolve, reject) => {
    const eventInstances = [];
    async function getInstances() {
      const venues = data.venues;
      for (const [idx, event] of data.events.entries()) {
        for (const [idxx, instance] of event.instances.entries()) {
          if (event.type == "Tickets" || !process.env.ticketableOnly) {
            const venue = venues[instance.venueId];
            eventInstances.push({
              start: instance.formattedDates.ISO8601,
              summary: event.name,
              id: instance.id,
              url: instance.purchaseUrl,
              location: `${venue ? `${venue.name} ${venue.address}` : ``}`,
              description: striptags(event.description),
              organizer: {
                name: process.env.feedBrand,
                email: process.env.brandEmail
              },
              categories: [
                { name: event.category },
                { name: event.custom.Type_of_Tickets_Available__c }
              ],
              image_link: `${process.env.feedDomain}/ticket${event.smallImagePath}`,
              custom_label_0: instance.name,
              custom_label_1: event.type,
              custom_label_2: event.purchaseUrl
            });
          }
        }
      }
      try {
        const cal = ical({
          events: eventInstances
        }).toString();
        resolve(cal);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    }
    getInstances();
  });
};
