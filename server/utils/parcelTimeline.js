const addTimelineEvent = (parcel, status, note, actorRole) => {
  parcel.timeline.push({
    status,
    note,
    actorRole,
    occurredAt: new Date(),
  });
};

module.exports = {
  addTimelineEvent,
};
