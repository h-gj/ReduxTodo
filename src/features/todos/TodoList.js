import React from 'react'
import TodoListItem from './TodoListItem'
import { useSelector, shallowEqual } from 'react-redux'
import { selectTodoIds, selectFilteredTodoIds } from './todosSlice'

const TodoList = () => {
  // const selectTodoIds = state => state.todos.map(todo => todo.id)
  // const todoIds = useSelector(selectTodoIds, shallowEqual)
  // const todoIds = useSelector(selectTodoIds)
  const todoIds = useSelector(selectFilteredTodoIds)
  const loadingStatus = useSelector(state => state.todos.status)
  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  console.log('todoIdstodoIdstodoIds', todoIds);

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} todoId={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
