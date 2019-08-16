var myJsRoutines = (function () {
  var multiplier = 2;

  return {
    processLevel: function (level, callback) {
      console.log('processLevel:', level); // CLI or /logs/express_output.log

      // validation
      if (!level) {
        // error is usually first param in node callback; null for success
        callback('level is missing or 0');
        return; // bail out
      }

      // processing
      var result = level * multiplier;

      // could return result, but need callback if code reads from file/db
      callback(null, result);
    }
  };
}()); // function executed so myJsRoutines is an object

module.exports = myJsRoutines;
