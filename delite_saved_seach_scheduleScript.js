/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */

// This script deletes up to 500 records fetched from a saved search.

define(["N/search", "N/record", "N/log"], function(search, record, log) {

    function execute(context) {

        try {
            // Load the saved search by its internal ID
            var mySearch = search.load({
                id: "customsearch_record"
            });

            // Get the first 500 results from the saved search
            var results = mySearch.run().getRange({
                start: 0,
                end: 500
            });

            // Loop through each result from the search
            for (var i = 0; i < results.length; i++) {
                var result = results[i]; // Current record in the loop

                try {
                    // Retrieve the internal ID and record type to delete the record
                    var recordId = result.id;
                    var recordType = result.recordType;

                    // Delete the record using its type and ID
                    record.delete({
                        type: recordType,
                        id: recordId
                    });

                    // Log that the record was successfully deleted
                    log.debug({
                        title: "Deleted Record",
                        details: "Type: " + recordType + ", ID: " + recordId
                    });

                } catch (e) {
                    // We use a try-catch block inside the loop so that:
                    // If one record out of 500 fails, the other ones will continue to delete.
                    log.error({
                        title: "Error Deleting Record ID: " + (result ? result.id : "unknown"),
                        details: e.toString()
                        // We use a ternary operator to check:
                        // If result exists, log its ID. If not, show "unknown".
                        // This helps track exactly which record failed and why.
                    });
                }
            }

        } catch (e) {
            // If the saved search fails to load or getRange fails, catch it here
            log.error({
                title: "Script Execution Error",
                details: e.toString()
            });
        }

    }

    return {
        execute: execute
    };

});
