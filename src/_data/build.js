// Changes on every build so returning visitors fetch the new stylesheet
// instead of reusing a cached copy that predates a layout change.
module.exports = {
  stamp: Date.now().toString(36),
};
