import actionTypes from "./actionTypes";
import datasetActionTypes from "../dataset/actionTypes";

const initialState = [];

const datasetsReducer = (state = initialState, action = undefined) => {
  switch (action.type) {
    case actionTypes.CLEAR_ALL_DATASETS:
      return [];

    case actionTypes.FETCH_DATASETS_SUCCESS:
      return [...action.datasets];

    case datasetActionTypes.CREATE_DATASET_SUCCESS: {
      const datasetWithTheSameNameFound = state.find((dataset) => {
        return dataset.name === action.payload.name;
      });

      if (datasetWithTheSameNameFound) return state;
      return [...state, { name: action.payload.name }];
    }

    default:
      return state;
  }
};

export default datasetsReducer;
