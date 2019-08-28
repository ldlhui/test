import *as types from '../constants/counterTypes';

export function decrement() {
  return {
    type: types.DECREMENT,
  }
}

export const increment = (data) => ({
  type:  types.INCREMENT,
  data: data
});
