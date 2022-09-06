export const environment = {
  production: window["env"]["production"],
  kibanaUrl: window["env"]["kibanaUrl"]  || "http://localhost:5601/kibana",
  stripePkId: window["env"]["stripePkId"] || "pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp",
  stripePriceId: window["env"]["stripePriceId"] || "price_1LedZmIf2Ur5sxpSNgK9fl5d",
  stripeCancelUrl: window["env"]["stripeCancelUrl"] || "http://localhost:4200/pages/profile?payment=false",
  stripeSuccessUrl: window["env"]["stripeSuccessUrl"] || "http://localhost:4200/pages/profile?payment=true"
};
