# YouTrack workflow for Microsoft Teams notifications

This workflow sends notifications to a given Microsoft Teams channel whenever a YouTrack issue is changed.

## Installation

To install the workflow into your YouTrack instance,

1. download the source code zip file from the [releases pages](https://github.com/fuglede/youtrack-teams-notifications/releases),
2. on the "Workflows" page on your YouTrack instance (https://{youtrack-url}/admin/workflows), click "Import workflow" and select the zip file,
3. for the newly added workflow, click the "teams-notification" rule and follow the instructions to add the URL of an Incoming workhook for your Teams channel,
4. add the newly added workflow to one or more YouTrack projects.
