'use strict';

const { LIKE } = require('../constants');
const initState = {
  likeNumber: 0,
  liked: false,
};

function like(state = initState, action) {
  console.log(action);
  switch (action.type) {
    case LIKE:
      return Object.assign({}, state, {
        likeNumber: state.likeNumber + 1,
        liked: true,
      });
    default:
      return state;
  }
}

module.exports = like;
