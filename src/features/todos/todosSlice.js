import { client } from '../../api/client'
import { createSelector, createReducer, createSlice } from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  // entities: [],
  entities: {},
}


function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

// export default function todosReducer(state = initialState, action) {
//   switch (action.type) {
//     case 'todos/todosLoading': {
//       return {
//         ...state,
//         status: 'loading'
//       }
//     }

//     case 'todos/todoAdded': {
//       // Can return just the new todos array - no extra object around it
//       // return [
//       //   ...state,
//       //   action.payload,
//       // ]
//       return {
//         ...state,
//         entities: { ...state.entities, [action.payload.id]: action.payload }
//       }
//     }
//     case 'todos/todoToggled': {
//       const todoId = action.payload
//       const todo = state.entities[todoId]
//       return {
//         ...state,
//         entities: {
//           ...state.entities,
//           [todoId]: {
//             ...todo,
//             completed: !todo.completed
//           }
//         }
//       }
//     }
//     case 'todos/colorSelected': {
//       const { color, todoId } = action.payload
//       const todo = state.entities[todoId]
//       return {
//         ...state,
//         entities: {
//           ...state.entities,
//           [todoId]: {
//             ...todo,
//             color
//           }
//         }
//       }
//     }
//     case 'todos/todoDeleted': {
//       const newEntities = { ...state.entities }
//       delete newEntities[action.payload]
//       return {
//         ...state,
//         entities: newEntities
//       }
//     }
//     case 'todos/allCompleted': {
//       const newEntities = { ...state.entities }
//       Object.values(newEntities).forEach(todo => {
//         newEntities[todo.id] = {
//           ...todo,
//           completed: true
//         }
//       })

//       return {
//         ...state,
//         entities: newEntities
//       }

//     }
//     case 'todos/completedCleared': {
//       const newEntities = { ...state.entities }
//       Object.values(newEntities).forEach(todo => {
//         if (todo.completed) {
//           delete newEntities[todo.id]
//         }
//       })

//       return {
//         ...state,
//         entities: newEntities
//       }

//     }
//     case 'todos/todosLoaded': {
//       const newEntities = {}
//       action.payload.forEach(todo => {
//         newEntities[todo.id] = todo
//       })

//       return {
//         ...state,
//         entities: newEntities,
//         status: 'idle'
//       }
//     }
//     default:
//       return state
//   }
// }

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      state.entities[action.payload.id] = action.payload
    },
    todoToggled(state, action) {
      const todo = state.entities[action.payload]
      todo.completed = !todo.completed
    },
    todoLoading(state, action) {
      state.status = action.payload
    },
    colorSelected(state, action) {
      const todo = state.entities[action.payload.todoId]
      todo.color = action.payload.color
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload.todoId]
    },
    allCompleted(state, action) {
      Object.values(state.entities).forEach(todo => todo.completed = true)
    },
    completedCleared(state, action) {
      Object.values(state.entities).filter(todo => todo.completed)
    },
    todosLoaded(state, action) {
      action.payload.forEach(todo => {
        state.entities[todo.id] = todo
      })
    }
  }
})



// function todosLoaded(todos) {
//   return { type: 'todos/todosLoaded', payload: todos }
// }


// function todosLoading() {
//   return { type: 'todos/todosLoading' }
// }
export const { todoAdded, todoToggled, todosLoading,
  colorSelected, todoDeleted, allCompleted,
  completedCleared, todosLoaded } = todoSlice.actions

export default todoSlice.reducer


export async function fetchTodos(dispatch, getState) {
  // dispatch(todosLoading('processing'))
  const response = await client.get('/fakeApi/todos')
  console.log('response', response);
  dispatch(todosLoaded(response.todos))
}


export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const response = await client.post('fakeApi/todos', { todo: { text } })
    console.log('response.todo', response.todo);
    dispatch({ type: 'todos/todoAdded', payload: response.todo })
  }
}

export function deleteTodo(todoId) {
  return async function deleteTodoThunk(dispatch, getState) {
    const response = await client.delete(`fakeApi/todos/${todoId}`)
    console.log('todo id to delete', response.todo.id);
    dispatch({ type: 'todos/todoDeleted', payload: response.todo.id })
  }
}


export const selectTodoIds = createSelector(
  state => state.todos,
  todos => todos.map(todo => todo.id)
)


export const selectFilteredTodosByStatus = createSelector(
  state => Object.values(state.todos.entities),
  state => state.filters.status,
  (todos, status) => {
    if (status === StatusFilters.All) {
      return todos
    }

    const completed = status === StatusFilters.Completed
    return todos.filter(todo => todo.completed === completed)

  }
)

export const selectFilteredTodosByStatusAndColor = createSelector(
  selectFilteredTodosByStatus,
  state => state.filters.colors,
  (todos, colors) => todos.filter(todo => {
    if (colors.length === 0) {
      console.log('1111111111111111', colors, !colors);
      return true
    }
    return colors.indexOf(todo.color) > -1
  })
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodosByStatusAndColor,
  todos => todos.map(todo => todo.id)
)


const selectTodoEntities = state => state.todos.entities
export const selectTodos = createSelector(
  selectTodoEntities,
  entities => Object.values(entities)
)

export const selectTodoById = (state, todoId) => selectTodoEntities(state)[todoId]