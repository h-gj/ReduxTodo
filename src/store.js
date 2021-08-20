import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'
import thunkMiddleware from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const composedEnhancer = composeWithDevTools(
  // Add whatever middleware you actually want to use here
  applyMiddleware(thunkMiddleware)
  // other store enhancers if any
)

// const store = createStore(rootReducer, composedEnhancer)
const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer
  }
})

export default store
