const fs = require('fs');
const { staticDatafilePath, flagKey, userId, sdkKey  } = require('../config');
const optimizelySDK = require('@optimizely/optimizely-sdk');

const datafile = JSON.parse(fs.readFileSync(staticDatafilePath, 'utf-8'));
const client = optimizelySDK.createInstance({ datafile });

client.notificationCenter.addNotificationListener(
  optimizelySDK.enums.NOTIFICATION_TYPES.DECISION,
  ({ type, userId, attributes, decisionInfo }) => {
    console.log("🧧 Got notification", type, userId, attributes, decisionInfo);
  },
)

client.onReady({ timeout: 5000 }).then(() => { 
  const user = client.createUserContext("64566", {user_logged_in: true});
  let decision = user.decide(flagKey, [optimizelySDK.OptimizelyDecideOption.DISABLE_DECISION_EVENT]);
  console.log("✅ Got decision (NO EVENT)", decision);
  decision = user.decide(flagKey);
  console.log("✅ Got decision (with event)", decision);
  decision = user.decide(flagKey);
  console.log("✅ Got decision (with event)", decision);
  return;
})
