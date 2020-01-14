module.exports = makeICal = ({ events }) => {
  async function formatICal() {
    var eventInstances = [];
    var d = new Date();
    events.forEach(event => {
      var eventInstance = `BEGIN:VEVENT\r\n
UID:${event.id}\r\n
DTSTART:${event.start}\r\n
DTSTAMP:${d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d\d\d/g, "")}\r\n
SUMMARY:${event.summary}\r\n
ATTACH;FMTTYPE=image/png:${event.image_link}\r\n
LOCATION:${event.location}\r\n
DESCRIPTION:${event.description}\r\n
ORGANIZER;CN="House of Blues Music Forward Foundation":mailto:info@hobmusi
cforward.org\r\n
CATEGORIES:${event.categories.map(cat => cat.name)}\r\n
URL;VALUE=URI:${event.url}\r\n
END:VEVENT\r\n`;
      eventInstances.push(eventInstance);
    });

    var eventFeed = `BEGIN:VCALENDAR\r\n
VERSION:2.0\r\n
PRODID:HOB MFF\r\n
${eventInstances.join("\n")}
END:VCALENDAR\r\n`;
    return eventFeed;
  }
  return formatICal();
};
