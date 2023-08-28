const readline = require('readline');

const store = {
  state: {
    progressData: []
  },
  reducers: {
    addProgressData: (state, { rating }) => ({
      ...state,
      progressData: [...state.progressData, { rating }]
    }),
  },
  actions: {
    addProgressData: (rating) => ({
      type: "ADD_PROGRESS_DATA",
      payload: { rating }
    }),
  },
  dispatch: (action) => {
    switch (action.type) {
      case "ADD_PROGRESS_DATA":
        store.state = store.reducers.addProgressData(store.state, action.payload);
        break;
    }
  }
};

function getInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter progress rating: ", (ratingInput) => {
    const rating = parseFloat(ratingInput);
    rl.close();
    store.dispatch(store.actions.addProgressData(rating));
    parseInput({ rating });
  });
}

function parseInput({ rating }) {
  console.log("Parsed rating:", rating);
}

getInput();
