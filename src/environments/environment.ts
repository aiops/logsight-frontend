/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  kibanaUrl: "http://localhost:5601/kibana/app/kibana#/",
  kibanaUrlDemo: "https://demo.logsight.ai/kibana/app/kibana",
  stripePkey: "pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp",
  stripeCancelUrl: 'https://demo.logsight.ai/pages/profile?payment=failed',
  stripeSuccessUrl: 'https://demo.logsight.ai/pages/profile?payment=successful',
  stripePriceId: 'price_1J2tf6If2Ur5sxpSCxAVA2eW',
  stripePkeyDemo: "pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp",
  stripeCancelUrlDemo: 'https://demo.logsight.ai/pages/profile?payment=failed',
  stripeSuccessUrlDemo: 'https://demo.logsight.ai/pages/profile?payment=successful',
  stripePriceIdDemo: 'price_1J2tf6If2Ur5sxpSCxAVA2eW'
};
