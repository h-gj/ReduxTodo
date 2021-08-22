import { client } from '../../api/client'
import { createSelector, createReducer, createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'

// const initialState = {
//   status: 'idle',
//   // entities: [],
//   entities: {},
// }
const todosAdapter = createEntityAdapter()
const initialState = todosAdapter.getInitialState({
  status: 'idle'
})


// export async function fetchTodos(dispatch, getState) {
//   // dispatch(todosLoading('processing'))
//   const response = await client.get('/fakeApi/todos')
//   console.log('response', response);
//   dispatch(todosLoaded(response.todos))
// }
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await client.get('/fakeApi/todos')
    console.log(2222);
    return response.todos
  }
)


export const saveNewTodo = createAsyncThunk(
  'todos/saveNewTodo',
  async text => {
    const initialTodo = {text}
    const response = await client.post('fakeApi/todos', {todo: initialTodo})
    console.log(response);
    console.log(response.todo);
    return response.todo
  }
)


function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}


const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // todoAdded(state, action) {
    //   state.entities[action.payload.id] = action.payload
    // },
    todoAdded: todosAdapter.addOne,
    todoToggled(state, action) {
      const todo = state.entities[action.payload]
      todo.completed = !todo.completed
    },
    todoLoading(state, action) {
      state.status = action.payload
    },
    colorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color =  color
      },
      prepare(todoId, color) {
        return {
          payload: {
            todoId,
            color,
          }
        }
      }
    },
    // todoDeleted: todosAdapter.removeOne,
    allCompleted(state, action) {
      Object.values(state.entities).forEach(todo => todo.completed = true)
    },
    completedCleared(state, action) {
      const completedIds = Object.values(state.entities).filter(todo => todo.completed).map(todo => todo.id)
      todosAdapter.removeMany(state, completedIds)
    },
    todosLoaded(state, action) {
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      state.entities = newEntities
      state.status = 'idle'
    },
    todoDeleted: todosAdapter.removeOne
  },
  extraReducers: builder => {
    builder
    .addCase(fetchTodos.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      todosAdapter.setAll(state, action.payload)
      state.status = 'idle'
    })
    .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  },
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


// export function .fulfilled, todosAdapter.removeOne(todoId) {
//   return async function .fulfilled, todosAdapter.removeOneThunk(dispatch, getState) {
//     const response = await client.delete(`fakeApi/todos/${todoId}`)
//     console.log('todo id to delete', response.todo.id);
//     dispatch(todoDeleted, response.todo.id)
//   }
// }



// const selectTodoEntities = state => state.todos.entities
// export const selectTodos = createSelector(
//   selectTodoEntities,
//   entities => Object.values(entities)
// )

// export const selectTodoById = (state, todoId) => selectTodoEntities(state)[todoId]
export const {selectAll: selectTodos, selectById: selectTodoById} = todosAdapter.getSelectors(state => state.todos)


export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)
