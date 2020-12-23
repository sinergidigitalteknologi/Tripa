import {combineReducers} from 'redux';
import visibilityFilter from './visibilityFilter';
import todos from './todos';
import todonotifications from './todonotifications';

export default combineReducers({todos, visibilityFilter, todonotifications});
