/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  kibanaUrl: "http://localhost:5601/", // CHANGE THIS TO "https://logsight.ai/kibana/app/kibana" FOR MAIN BRANCH
  kibanaUrlDemo: "https://demo.logsight.ai/kibana/app/kibana",
  stripePkey: "pk_live_51ILUOvIf2Ur5sxpS1HjIBbBj1IO2ZYqwq0UlvnQHGGqf9GVQt2AtQKnCKyuTsmMf5sSgTZ85NZ0PWruFmIj7YML2001h6Mu82t", //change this for prod
  stripeCancelUrl: 'https://logsight.ai/pages/profile?payment=failed', // change this for prod
  stripeSuccessUrl: 'https://logsight.ai/pages/profile?payment=successful', //change this for prod
  stripePriceId: 'price_1JjMb5If2Ur5sxpSYbUhedMy',
  stripePkeyDemo: "pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp",
  stripeCancelUrlDemo: 'https://demo.logsight.ai/pages/profile?payment=failed',
  stripeSuccessUrlDemo: 'https://demo.logsight.ai/pages/profile?payment=successful',
  stripePriceIdDemo: 'price_1J2tf6If2Ur5sxpSCxAVA2eW'
};
