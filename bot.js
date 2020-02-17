// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');

class Bobo extends ActivityHandler {
    constructor() {
        super();

        // If the includeApiResults parameter is set to true, as shown below, the full response
        // from the LUIS api will be made available in the properties  of the RecognizerResult
        const dispatchRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: `https://${ process.env.LuisAPIHostName }.api.cognitive.microsoft.com`
        }, {
            includeAllIntents: false,
            includeInstanceData: true
        }, true);

        this.dispatchRecognizer = dispatchRecognizer;

        this.onMessage(async (context, next) => {
            console.log('Processing Message Activity.');

            // First, we use the dispatch model to determine which intent handler to use.
            const recognizerResult = await dispatchRecognizer.recognize(context);
            const intent = LuisRecognizer.topIntent(recognizerResult);

            // Next, we call the dispatcher with the top intent.
            await this.dispatchToTopIntentAsync(context, intent, recognizerResult);

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Type a greeting or a question about the weather to get started.';
            const membersAdded = context.activity.membersAdded;

            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(`${ welcomeText }`);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
//query_prayer_time_at_location
//query_prayer_times_at_location
    async dispatchToTopIntentAsync(context, intent, recognizerResult) {
        switch (intent) {
        case 'query_prayer_time_at_location':
            await this.handleQueryPrayerTimeAtLocation(context, recognizerResult.luisResult);
            break;
        case 'query_prayer_places_at_location':
            await this.handleQueryPrayerPlacesAtLocation(context, recognizerResult.luisResult);
            break;
        default:
            console.log(`Dispatch unrecognized intent: ${ intent }.`);
            await context.sendActivity(`Dispatch unrecognized intent: ${ intent }.`);
            break;
        }
    }

    async handleQueryPrayerTimeAtLocation(context, luisResult) {
		console.log('handleQueryPrayerTimeAtLocation');
		await context.sendActivity(`You're looking for prayer times within a specific location`);
		
        // // Retrieve LUIS result for Process Automation.
        // const result = luisResult.connectedServiceResult;
        // const intent = result.topScoringIntent.intent;

        // await context.sendActivity(`HomeAutomation top intent ${ intent }.`);
        // await context.sendActivity(`HomeAutomation intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);

        // if (luisResult.entities.length > 0) {
        //     await context.sendActivity(`HomeAutomation entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
        // }
    }

    async handleQueryPrayerPlacesAtLocation(context, luisResult) {
        await context.sendActivity(`You're looking for a place to pray within a specifc location`);
    }
}

module.exports.Bobo = Bobo;