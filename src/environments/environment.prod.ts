/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  kibanaUrl: "https://demo.logsight.ai/kibana/app/kibana", // CHANGE THIS TO "https://logsight.ai/kibana/app/kibana" FOR MAIN BRANCH
  stripePkey: "pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp", //change this for prod
  stripeCancelUrl: 'https://demo.logsight.ai/pages/profile?payment=failed', // change this for prod
  stripeSuccessUrl: 'https://demo.logsight.ai/pages/profile?payment=successful' //change this for prod
};
