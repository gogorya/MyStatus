const host = "http://localhost:8080";

// monitors
const monitors = `${host}/api/monitors`;

// get
const getMonitors = `${monitors}/get`;
// post
const createMonitor = `${monitors}/create`;
const updateMonitor = `${monitors}/update`;
const deleteMonitor = `${monitors}/delete`;

module.exports = { getMonitors, createMonitor, updateMonitor, deleteMonitor };
