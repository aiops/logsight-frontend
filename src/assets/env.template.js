(function(window) {
  window.env = window.env || {};
  // Environment variables
  window["env"]["production"] = ("${LOGSIGHT_DEPLOYMENT}" === "true");
  window["env"]["kibanaUrl"] = "${LOGSIGHT_FRONTEND_KIBANA_URL}";
})(this);
