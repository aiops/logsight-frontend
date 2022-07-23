export const environment = {
  production: window["env"]["production"] || true,
  kibanaUrl: window["env"]["kibanaUrl"]  || "http://localhost:5601/kibana",
};
