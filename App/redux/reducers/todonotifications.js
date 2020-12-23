import {ADD_TODO_NOTIF, TOGGLE_TODO_NOTIF} from '../actionTypes';

const initialState = {
  allIds: [],
  byIds: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO_NOTIF: {
      const {id, content} = action.payload;
      console.log('addTodo', id + ' ' + content);

      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            content,
            completed: false,
          },
        },
      };
    }
    case TOGGLE_TODO_NOTIF: {
      const {id} = action.payload;
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [id]: {
            ...state.byIds[id],
            completed: !state.byIds[id].completed,
          },
        },
      };
    }
    default:
      return state;
  }
}
