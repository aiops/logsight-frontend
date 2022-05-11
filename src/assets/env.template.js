(function(window) {
  window.env = window.env || {};
  // Environment variables
  window["env"]["production"] = ("${LOGSIGHT_DEPLOYMENT}" === "web-service");
  window["env"]["kibanaUrl"] = "${LOGSIGHT_FRONTEND_KIBANA_URL}";
})(this);
