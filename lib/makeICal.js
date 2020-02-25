module.exports = makeICal = ({ events }) => {
  async function formatICal() {
    var eventInstances = [];
    var d = new Date();
    events.forEach(event => {
      var eventInstance = `BEGIN:VEVENT\r
UID:${event.id}\r
DTSTART:${event.start}\r
DTEND:${event.start}\r
DTSTAMP:${d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d\d\d/g, "")}\r
SUMMARY:${event.summary}\r
ATTACH;FMTTYPE=image/png:${event.image_link}\r
LOCATION:${event.location}\r
DESCRIPTION:${event.description}\r
ORGANIZER;CN="House of Blues Music Forward Foundation":mailto:info@hobmusicforward.org\r
CATEGORIES:${event.categories.map(cat => cat.name)}\r
URL;VALUE=URI:${event.url}\r
END:VEVENT\r`;
      eventInstances.push(eventInstance);
    });

    var eventFeed = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:HOB MFF\r
${eventInstances.join("\n")}
END:VCALENDAR\r`;
    return eventFeed;
  }
  return formatICal();
};
