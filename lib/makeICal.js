module.exports = makeICal = ({ events }) => {
  async function formatICal() {
    var eventInstances = [];
    events.forEach(event => {
      var eventInstance = `
BEGIN:VEVENT
UID:${event.id}
DTSTART:${event.start}
SUMMARY:${event.summary}
ATTACH;FMTTYPE=image/jpg:${event.image_link}
LOCATION:${event.location}
DESCRIPTION:${event.description}
ORGANIZER;CN="House of Blues Music Forward Foundation":mailto:info@hobmusi
cforward.org
CATEGORIES:${event.categories.map(cat => cat.name)}
URL;VALUE=URI:${event.url}
END:VEVENT`;
      eventInstances.push(eventInstance);
    });

    var eventFeed = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:HOB MFF
${eventInstances}
END:VCALENDAR
        `;
    return eventFeed;
  }
  return formatICal();
};
