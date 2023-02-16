export const environment = {
  production: window["env"]["production"],
  kibanaUrl: window["env"]["kibanaUrl"]  || "http://localhost:5601/kibana",
};
