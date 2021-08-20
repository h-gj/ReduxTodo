import React from 'react'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { availableColors, capitalize } from '../filters/colors'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTodo, selectTodoById } from './todosSlice'

const TodoListItem = ({ todoId }) => {
  // const selectTodoById = (state, todoId) => state.todos.find(todo => todo.id === todoId)
  const dispatch = useDispatch()
  const todo = useSelector(state => selectTodoById(state, todoId))

  const { text, completed, color } = todo

  const handleCompletedChanged = (e) => {
    // onCompletedChange(e.target.checked)
    dispatch({ type: 'todos/todoToggled', payload: todo.id })
  }

  const handleColorChanged = (e) => {
    dispatch({ type: 'todos/colorSelected', payload: { color: e.target.value, todoId: todo.id } })
    // onColorChange(e.target.value)
  }

  const handleDeleteTodo = (e) => {
    // dispatch(deleteTodo(todoId))
    dispatch({ type: 'todos/todoDeleted', payload: todoId })
  }

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={handleDeleteTodo}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
