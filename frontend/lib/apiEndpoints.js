// Public
const getStatusPageData = "/public/get-status-page-data";

// Private
// Monitors
const monitors = "/api/monitors";
// Get
const getMonitors = `${monitors}/get`;
// Post
const createMonitor = `${monitors}/create`;
const updateMonitor = `${monitors}/update`;
const deleteMonitor = `${monitors}/delete`;

// Status-pages
const statusPages = "/api/status-pages";
// Get
const getStatusPages = `${statusPages}/get`;
// Post
const createStatusPage = `${statusPages}/create`;
const updateStatusPage = `${statusPages}/update`;
const deleteStatusPage = `${statusPages}/delete`;

// Incidents
const incidents = "/api/incidents";
// Get
const getIncidents = `${incidents}/get`;
// Post
const createIncident = `${incidents}/create`;
const updateIncident = `${incidents}/update`;
const deleteIncident = `${incidents}/delete`;

module.exports = {
  getStatusPageData,
  getMonitors,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  getStatusPages,
  createStatusPage,
  updateStatusPage,
  deleteStatusPage,
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
