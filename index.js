import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define a slice with initial state and reducer logic
const inputSlice = createSlice({
  name: 'input',
  initialState: '',
  reducers: {
    setInput: (state, action) => {
      return action.payload;
    },
  },
});

// Extract the action creator
export const { setInput } = inputSlice.actions;

// Create the Redux store
const store = configureStore({
  reducer: {
    input: inputSlice.reducer,
  },
});

// Console log a question
console.log("What's your input?");

// Listen for user input
process.stdin.on('data', (input) => {
  // Dispatch the input to the store
  store.dispatch(setInput(input.toString().trim()));
});