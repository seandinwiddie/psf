const fs = require('fs');
const readline = require('readline');

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
      "- [Priorities]: A numeric value indicating the urgency or backlog status of a task."
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

// Provider
const provideStore = (component) => {
  component.store = store;
  return component;
};

// Create a functional pipeline
const processInput = compose(
  getInput,
  parseInput,
  updateProgressData,
  saveProgressData,
  renderChart,
  promptNextAction
);

// Start the program
processInput();

// Functions (utility functions...)

// Replace placeholders and use the store to display instructions and utilities
const displayInstructions = () => {
  console.log(parseTextFromJSON(store.state.instructions));
};

const displayUtilities = () => {
  console.log(parseTextFromJSON(store.state.utilities));
};

const parseTextFromJSON = (jsonArray) => {
  return jsonArray.join('\n');
};

function getInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Prompt the user for input
  rl.question("Enter progress rating (between -5 and 5): ", (ratingInput) => {
    const rating = parseFloat(ratingInput);

    // Prompt the user for priority input
    rl.question("Enter priority (-10 to 10): ", (priorityInput) => {
      const priority = parseInt(priorityInput);

      rl.close();

      // Call the next function in the pipeline with the obtained input
      parseInput({ rating, priority });
    });
  });
}

function parseInput({ rating, priority }) {
  // Validate the input values
  if (isNaN(rating) || rating < -5 || rating > 5) {
    console.log("Invalid progress rating. Please enter a number between -5 and 5.");
    return;
  }

  if (isNaN(priority) || priority < -10 || priority > 10) {
    console.log("Invalid priority value. Please enter a number between -10 and 10.");
    return;
  }

  // Call the next function in the pipeline with the validated and parsed input
  updateProgressData({ rating, priority });
}


function updateProgressData({ rating, priority }) {
  store.dispatch(store.actions.addProgressData(rating, priority));
}

function saveProgressData() {
  // Convert the progress data to JSON
  const progressDataJSON = JSON.stringify(store.state.progressData, null, 2);

  // Write the JSON to a file
  fs.writeFile('progress_data.json', progressDataJSON, (err) => {
    if (err) {
      console.error('Error saving progress data:', err);
    } else {
      console.log('Progress data saved successfully.');
    }
  });
}


function renderChart() {
  console.log("\nProgress Chart:");
  console.table(store.state.chart.header, store.state.chart.rows);

  // Call the next function in the pipeline
  promptNextAction();
}


function promptNextAction() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("What would you like to do next? (Type 'exit' to quit): ", (answer) => {
    rl.close();

    if (answer.toLowerCase() === "exit") {
      console.log("Exiting the PSF application. Goodbye!");
    } else {
      console.log("Invalid command. Please enter a valid command or type 'exit' to quit.");
      promptNextAction();
    }
  });
}


// Utility Functions (compose function, etc.)...

// Provider Example
class Component {
  constructor() {
    this.store = null;
  }
}

const ProvidedComponent = provideStore(new Component());

// Helper function for function composition
function compose(...fns) {
  return (arg) => fns.reduce((composed, fn) => fn(composed), arg);
}
