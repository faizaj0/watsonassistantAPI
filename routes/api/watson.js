// 1. Import dependencies
const express = require("express");
const router = express.Router();
const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

//WATSON NATURAL LANGUAGE UNDERSTANDING API//

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

//creat Instance
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey:  process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
  }),
  serviceUrl: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
});


naturalLanguageUnderstanding.analyze({
  "text": "I want to find a course in natural language understanding using deep learning",
  'features': {
    'keywords': {
      'sentiment': false,
      'emotion': false,
      'limit': 10
    }
  }
})
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });



///////////////////////////////////////////
//WATSON ASSISTANT API //

// 2. Create Instance of Assistant

// 2.1 First authenticate
const authenticator = new IamAuthenticator({
  apikey: process.env.WATSON_ASSISTANT_APIKEY,
});

// 2.2 Connect to assistant
const assistant = new AssistantV2({
  version: "2020-09-24",
  authenticator: authenticator,
  url: process.env.WATSON_ASSISTANT_URL,
  serviceUrl: " https://api.eu-gb.assistant.watson.cloud.ibm.com",
});

// 3. Route to Handle Session Tokens
// GET /api/watson/session

router.get("/session", async (req, res) => {
  // If successs
  try {
    const session = await assistant.createSession({
      assistantId: process.env.WATSON_ASSISTANT_ID,
    });

    console.log(session);

    res.json(session.result);

    // If fail
  } catch (err) {
    res.send("There was an error processing your request.");
    console.log(err);
  }
});

// 4. Handle Messages


// POST /api/watson/message
router.post("/message", async (req, res) => {
  // Construct payload
  payload = {
    assistantId: process.env.WATSON_ASSISTANT_ID,
    sessionId: req.headers.session_id,
    input: {
      message_type: "text",
      text: req.body.input,
    },
  };

  // If successs
  try {
    const message = await assistant.message(payload);
    res.json(message["result"]);

    // If fail
  } catch (err) {
    res.send("There was an error processing your request.");
    console.log(err);
  }
});

// 5. Export routes
module.exports = router;
