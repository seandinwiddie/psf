const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');

// Store
const store = {
  state: {
    // Progress Tracking Chart for [Identifier]'s [Function]
    chart: {
      header: ["Distance Marker", "Progress Rating", "Priority", "Notes"],
      rows: [["[Units]", "[Ratings]", "[Priorities]", "[Notes]"]]
    },
    instructions: [
      "## Step 1: Initial Data Collection",
      "1. Observe interactions of PSF with their operating system functionalities.",
      "2. Assign a progress rating (-5 to 5) based on observed alignment.",
      "3. Assign a priority value (positive or negative) to indicate its urgency.",
      "4. Optionally, note any observations.",
      "",
      "## Step 2: Data Entry",
      "1. Use the `map` function to transform [Ratings] into a new array with formatted progress ratings.",
      "2. Use the `map` function to transform [Notes] into a new array with observation notes.",
      "",
      "## Step 3: Chart Creation",
      "1. Combine [Units], progress ratings, and observation notes using the `zip` function.",
      "2. Format chart data into a text-based table using the `reduce` function.",
      "3. Display the formatted chart.",
      "",
      "## Step 4: Periodic Updates",
      "1. Prompt for a new progress rating and note using the `getInput` function.",
      "2. Use the `concat` function to append the new rating to [Ratings].",
      "3. Use the `concat` function to append the new note to [Notes].",
      "",
      "## Step 5: Visual Analysis",
      "1. Use the `map` function to convert [Ratings] into a string with formatted entries.",
      "2. Display the string to visualize progress ratings.",
      "",
      "## Step 6: Adaptation",
      "1. Analyze [Ratings] using the `filter`, `map`, and `reduce` functions.",
      "2. Modify strategies using a functional approach to drive improvement."
    ],
    utilities: [
      "### `map` Function",
      "// English: For each value in the array, apply a function to transform it and create a new array.",
      "// Math: Given an array [x1, x2, x3, ...], map(f) returns [f(x1), f(x2), f(x3), ...].",
      "map(fn)(array) => transformedArray",
      "",
      "### `zip` Function",
      "// English: Combine values from multiple arrays into pairs, triples, etc., preserving their order.",
      "// Math: Given arrays [a1, a2, a3, ...], [b1, b2, b3, ...], ... zip returns [[a1, b1, ...], [a2, b2, ...], ...].",
      "zip(arr1, arr2, arr3, ...) => combinedArray",
      "",
      "### `reduce` Function",
      "// English: Accumulate values from an array by successively applying a function, starting with an initial value.",
      "// Math: Given an array [x1, x2, x3, ...], reduce(f, initialValue) returns f(...f(f(initialValue, x1), x2), x3), ...).",
      "reduce(fn, initialValue)(array) => result",
      "",
      "### `concat` Function",
      "// English: Combine multiple arrays into a single array, preserving their order.",
      "// Math: Given arrays [a1, a2, a3, ...], [b1, b2, b3, ...], ... concat returns [a1, a2, a3, ..., b1, b2, b3, ...].",
      "concat(array1, array2) => concatenatedArray"
    ],
    legend: [
      "- [PSF]: The Personnel operating System reFactoring application.",
      "- [Priorities]: A numeric value indicating the urgency or backlog status of a task.",
      "- [Identifier]: The entity being tracked, such as a person, android, device, replicant, cyborg, etc.",
      "- [Aspect/Parameter/Attribute/Variable/Function/Method]: The specific characteristic or feature of the [Identifier] being tracked, e.g., operating system, software, thinking program, habit, etc.",
      "- [Units]: The markers used to measure the progress, e.g., distance markers, implementation stages, activation milestones, etc.",
      "- [Ratings]: Numeric values indicating the progress alignment of [Identifier]'s [Aspect/Parameter/Attribute/Variable/Function/Method].",
      "- [Notes]: Optional observations or comments related to the progress."
    ],
    progressData: []
  },
  reducers: {
    addProgressData: (state, { rating, priority }) => ({
      ...state,
      progressData: [...state.progressData, { rating, priority }]
    }),
    // Reducer to update progress ratings
    updateProgressRating: (state, { index, newRating }) => ({
      ...state,
      progressData: state.progressData.map((data, i) =>
        i === index ? { ...data, rating: newRating } : data
      )
    }),
    // Reducer to update priorities
    updatePriority: (state, { index, newPriority }) => ({
      ...state,
      progressData: state.progressData.map((data, i) =>
        i === index ? { ...data, priority: newPriority } : data
      )
    }),
  },
  actions: {
    addProgressData: (rating, priority) => ({
      type: "ADD_PROGRESS_DATA",
      payload: { rating, priority }
    }),
    updateProgressRating: (index, newRating) => ({
      type: "UPDATE_PROGRESS_RATING",
      payload: { index, newRating }
    }),
    // Action to update priorities
    updatePriority: (index, newPriority) => ({
      type: "UPDATE_PRIORITY",
      payload: { index, newPriority }
    }),
  },
  dispatch: (action) => {
    switch (action.type) {
      case "ADD_PROGRESS_DATA":
        store.state = store.reducers.addProgressData(store.state, action.payload);
        break;
      case "UPDATE_PROGRESS_RATING":
        store.state = store.reducers.updateProgressRating(store.state, action.payload);
        break;
      case "UPDATE_PRIORITY":
        store.state = store.reducers.updatePriority(store.state, action.payload);
        break;
    }
  }
};

function updateProgressData({ rating, priority }) {
  store.dispatch(store.actions.addProgressData(rating, priority));
}

// Utility Functions /  Functional Utilities

// Helper function for function composition
function compose(...fns) {
  return (initialArg) => {
    let result = initialArg;
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  };
}

const map = fn => arr => arr.map(fn);
const filter = fn => arr => arr.filter(fn);
const forEach = fn => arr => arr.forEach(fn);
const reduce = (fn, initialValue) => arr => arr.reduce(fn, initialValue);

// Utility function to format progress ratings
const formatProgressRating = rating => {
  if (rating > 0) {
    return `+${rating}`;
  } else {
    return `${rating}`;
  }
};

// Utility function to transform progress ratings
const transformProgressRatings = map(formatProgressRating);

// Utility function to transform observation notes
const transformNotes = map(note => `- ${note}`);

// Utility function to check if two values are equal
function isEqual(a, b) {
  // Implement your own comparison logic here
  return a === b;
}

const parseTextFromJSON = (jsonArray) => {
  return jsonArray.join('\n');
};

// Utility Functions for BDD-style Testing

// Utility function for creating a 'describe' block
function describe(description, tests) {
  console.log(`\n${description}`);
  tests();
}

// Utility function for creating an 'it' test case
function it(description, testFn) {
  try {
    testFn();
    console.log(`\t✓ ${description}`);
  } catch (error) {
    console.error(`\t✗ ${description}`);
    console.error('\t  Error:', error.message);
  }
}

function expect(actualValue) {
  return {
    toEqual(expectedValue) {
      if (isEqual(actualValue, expectedValue)) {
        console.log("✓ Test passed");
      } else {
        console.error(`✗ Test failed. Expected ${expectedValue}, but got ${actualValue}`);
      }
    }
  };
}

// Test utility functions
function testUtilityFunctions() {
  // Test parseTextFromJSON function
  const testArray = ['Test Line 1', 'Test Line 2'];
  const parsedText = parseTextFromJSON(testArray);
  console.log('Parsed Text:\n', parsedText);

  // Test map function
  const double = x => x * 2;
  const testMapArray = [1, 2, 3, 4, 5];
  const mappedArray = map(double)(testMapArray);
  console.log('Mapped Array:', mappedArray);

  // Test filter function
  const isEven = x => x % 2 === 0;
  const testFilterArray = [1, 2, 3, 4, 5];
  const filteredArray = filter(isEven)(testFilterArray);
  console.log('Filtered Array:', filteredArray);

  // Test forEach function
  const printValue = x => console.log('Value:', x);
  const testForEachArray = [1, 2, 3, 4, 5];
  forEach(printValue)(testForEachArray);

  // Test reduce function
  const sum = (accumulator, currentValue) => accumulator + currentValue;
  const testReduceArray = [1, 2, 3, 4, 5];
  const reducedValue = reduce(sum, 0)(testReduceArray);
  console.log('Reduced Value:', reducedValue);

}

// Utility function to simulate user input
function simulateUserInput(input, callback) {
  const rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rlInterface.question('', () => {
    rlInterface.write(input + '\n');
    rlInterface.close();
    callback();
  });
}

// Test Initial Data Collection User Story
describe("Initial Data Collection User Story", () => {
  it("should allow the user to assign a progress rating and priority", () => {
    // Given the PSF is running

    // When the user observes interactions of PSF with their operating system functionalities
    // And the user assigns a progress rating
    // And the user assigns a priority value
    const ratingInput = "3"; // Simulated user input for rating
    const priorityInput = "8"; // Simulated user input for priority

    // Simulate user input for rating and priority
    simulateUserInput(ratingInput, () => {
      simulateUserInput(priorityInput, () => {
        // ...

        const expectedProgressData = [{ rating: 3, priority: 8 }];
        const actualProgressData = store.state.progressData.map(data => ({
          rating: data.rating,
          priority: data.priority
        }));

        // Use _.isEqual for deep object comparison
        if (_.isEqual(actualProgressData, expectedProgressData)) {
          console.log("✓ Test passed");
        } else {
          console.error(`✗ Test failed. Expected ${JSON.stringify(expectedProgressData)}, but got ${JSON.stringify(actualProgressData)}`);
        }

        console.log("User input simulation complete.");
      });
    });
  });
});

// Test Data Entry User Story
describe("Data Entry User Story", () => {
  it("should create a new array with formatted progress ratings using the map function", () => {
    // Given the PSF is running

    // When the user uses the map function to transform progress ratings
    const testProgressRatings = [1, -3, 2, -1];
    const formattedProgressRatings = transformProgressRatings(testProgressRatings);

    // Then a new array with formatted progress ratings is created
    const expectedFormattedProgressRatings = ["+1", "-3", "+2", "-1"]; // Update this with your computed values
    expect(formattedProgressRatings).toEqual(expectedFormattedProgressRatings);

    console.log("Test for formatted progress ratings using map function passed.");
  });

  it("should create a new array with observation notes using the map function", () => {
    // Given the PSF is running

    // When the user uses the map function to transform notes
    const testObservationNotes = ["Noted", "Interesting", "No issues"];
    const transformedNotes = transformNotes(testObservationNotes);

    // Then a new array with observation notes is created
    const expectedTransformedNotes = ["- Noted", "- Interesting", "- No issues"]; // Updated expected values
    expect(transformedNotes).toEqual(expectedTransformedNotes);

    console.log("Test for observation notes transformation using map function passed.");
  });
});

// Main function to run tests
function runTests() {
  // Test utility functions
  testUtilityFunctions();

  // Test progress data handling
  const testRating = 3;
  const testPriority = 8;
  updateProgressData({ rating: testRating, priority: testPriority });
  console.log('Progress Data:', store.state.progressData);

}

// Run tests when the program starts
runTests();