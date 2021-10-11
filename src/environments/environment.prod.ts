/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  kibanaUrl: "https://logsight.ai/kibana/app/kibana", // CHANGE THIS TO "https://logsight.ai/kibana/app/kibana" FOR MAIN BRANCH
  stripePkey: "pk_live_51ILUOvIf2Ur5sxpS1HjIBbBj1IO2ZYqwq0UlvnQHGGqf9GVQt2AtQKnCKyuTsmMf5sSgTZ85NZ0PWruFmIj7YML2001h6Mu82t", //change this for prod
  stripeCancelUrl: 'https://logsight.ai/pages/profile?payment=failed', // change this for prod
  stripeSuccessUrl: 'https://logsight.ai/pages/profile?payment=successful', //change this for prod
  stripePriceId: 'price_1JjMb5If2Ur5sxpSYbUhedMy'
};
