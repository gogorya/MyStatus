const host = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8080";

// public
const getStatusPageData = `${host}/public/get-status-page-data`;

// private
// monitors
const monitors = `${host}/api/monitors`;
// get
const getMonitors = `${monitors}/get`;
// post
const createMonitor = `${monitors}/create`;
const updateMonitor = `${monitors}/update`;
const deleteMonitor = `${monitors}/delete`;

// status-pages
const statusPages = `${host}/api/status-pages`;
// get
const getStatusPages = `${statusPages}/get`;
// post
const createStatusPage = `${statusPages}/create`;
const updateStatusPage = `${statusPages}/update`;
const deleteStatusPage = `${statusPages}/delete`;

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
};
