// Thanks to Michael Rush for the original version of this rule (https://software-development.dfstudio.com/youtracks-new-javascript-workflows-make-slack-integration-a-breeze-d3275605d565)

// To use this, first configure an incoming webhook for the Microsoft Teams channel
// that should receive the notifications. To do so, right click the channel, select
// "Connectors" and add an "Incoming webhook". Take note of the URL for the webhook
// and include that below.
var TEAMS_WEBHOOK_URL = 'YOUR_INCOMING_WEBHOOK_URL_HERE';

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var http = require('@jetbrains/youtrack-scripting-api/http');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: workflow.i18n('Send notification to slack when an issue is reported, resolved, or reopened'),
  guard: function(ctx) {
    return ctx.issue.becomesReported || ctx.issue.becomesResolved || ctx.issue.becomesUnresolved;
  },
  action: function(ctx) {
    var issue = ctx.issue;

    var issueLink = '<' + issue.url + '>';
    var message, isNew;

    if (issue.becomesReported) {
      message = "Created: ";
      isNew = true;
    } else if (issue.becomesResolved) {
      message = "Resolved: ";
      isNew = false;
    } else if (issue.becomesUnresolved) {
      message = "Reopened: ";
      isNew = false;
    }
    message += issue.summary;

    var changedByTitle = '',
      changedByName = '';

    if (isNew) {
      changedByTitle = "Created By";
      changedByName = issue.reporter.fullName;
    } else {
      changedByTitle = "Updated By";
      changedByName = issue.updatedBy.fullName;
    }
    var payload = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": issue.fields.Priority.backgroundColor || "#edb431",
      "summary": message + " (" + issueLink + ")",
      "sections":
      [
        {
          "activityTitle": message + " (" + issueLink + ")",
          "activitySubtitle": changedByTitle + " " + changedByName
        }
      ]
    };

    var connection = new http.Connection(TEAMS_WEBHOOK_URL, null, 2000);
    var response = connection.postSync('', null, JSON.stringify(payload));
    if (!response.isSuccess) {
      console.warn('Failed to post notification to Teams. Details: ' + response.toString());
    }
  },
  requirements: {
    Priority: {
      type: entities.EnumField.fieldType
    },
    State: {
      type: entities.State.fieldType
    },
    Assignee: {
      type: entities.User.fieldType
    }
  }
});