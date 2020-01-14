module.exports = makeICal = ({ events }) => {
  async function formatICal() {
    var eventInstances = [];
    var d = new Date();
    events.forEach(event => {
      var eventInstance = `BEGIN:VEVENT\n
UID:${event.id}\n
DTSTART:${event.start}\n
DTSTAMP:${d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d\d\d/g, "")}\n
SUMMARY:${event.summary}\n
ATTACH;FMTTYPE=image/png:${event.image_link}\n
LOCATION:${event.location}\n
DESCRIPTION:${event.description}\n
ORGANIZER;CN="House of Blues Music Forward Foundation":mailto:info@hobmusi
cforward.org\n
CATEGORIES:${event.categories.map(cat => cat.name)}\n
URL;VALUE=URI:${event.url}\n
END:VEVENT\n`;
      eventInstances.push(eventInstance);
    });

    var eventFeed = `BEGIN:VCALENDAR\n
VERSION:2.0\n
PRODID:HOB MFF\n
${eventInstances.join("\n")}
END:VCALENDAR\n`;
    return eventFeed;
  }
  return formatICal();
};
