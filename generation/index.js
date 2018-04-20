#!/usr/bin/env node
const prettier = require("prettier");
const fs = require("fs");

const generateIOSAdapters = require("./adapters/ios");
const iosFiles = {
	"../detox/ios/EarlGrey/EarlGrey/Action/GREYActions.h":
		"../detox/src/ios/earlgreyapi/GREYActions.js",
	"../detox/ios/Detox/GREYMatchers+Detox.h":
		"../detox/src/ios/earlgreyapi/GREYMatchers+Detox.js",
	"../detox/ios/EarlGrey/EarlGrey/Matcher/GREYMatchers.h":
		"../detox/src/ios/earlgreyapi/GREYMatchers.js",
	"../detox/ios/EarlGrey/EarlGrey/Core/GREYInteraction.h":
		"../detox/src/ios/earlgreyapi/GREYInteraction.js",
	"../detox/ios/Detox/GREYCondition+Detox.h":
		"../detox/src/ios/earlgreyapi/GREYConditionDetox.js",
	"../detox/ios/EarlGrey/EarlGrey/Synchronization/GREYCondition.h":
		"../detox/src/ios/earlgreyapi/GREYCondition.js"
};

generateIOSAdapters(iosFiles);
const externalFilesToDownload = {
	"android.support.test.espresso.action.ViewActions":
		"../detox/src/android/espressoapi/ViewActions.js"
};

const generateAndroidAdapters = require("./adapters/android");
const downloadEspressoFileByClass = require("./utils/downloadEspresso");
const downloadedAndroidFilesMap = Object.entries(
	externalFilesToDownload
).reduce(
	(obj, [fullyQualifiedClass, dest]) => ({
		...obj,
		[downloadEspressoFileByClass(fullyQualifiedClass)]: dest
	}),
	{}
);
const androidFiles = {
	...downloadedAndroidFilesMap,
	"../detox/android/detox/src/main/java/com/wix/detox/espresso/DetoxAction.java":
		"../detox/src/android/espressoapi/DetoxAction.js",
	"../detox/android/detox/src/main/java/com/wix/detox/espresso/DetoxMatcher.java":
		"../detox/src/android/espressoapi/DetoxMatcher.js"
};
generateAndroidAdapters(androidFiles);


// Run prettier over the generated files
const allFiles = [...Object.values(iosFiles), ...Object.values(androidFiles)];

allFiles.forEach(file => {
    const text = fs.readFileSync(file, "utf8");
    const formatted = prettier.format(text);
    fs.writeFileSync(file, formatted);
});

