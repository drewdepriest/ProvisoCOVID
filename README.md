# ProvisoCOVID
Used to import COVID data from Illinois Department of Public Health every 24 hours for a select group of ZIPs

AppScript tied to daily trigger. Every 24 hours upon execution of trigger, the script calls the Illinois Department of Public Health (IDPH) API (https://idph.illinois.gov/DPHPublicInformation/Help) to retrieve latest case counts and testing counts for an array of ZIP codes.

The AppScript then pushes all of this data into a Google Sheet, where a Tableau story adds a visualization layer on top. Check out the viz at https://public.tableau.com/views/ProvisoCOVID/ProvisoCOVID?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link.
