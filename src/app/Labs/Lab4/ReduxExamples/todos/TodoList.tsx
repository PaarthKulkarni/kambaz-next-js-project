import React from "react";
import TodoForm from "./ToDoForm";
import TodoItem from "./ToDoItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ListGroup } from "react-bootstrap";
export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todos);
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem key = {todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr/>
    </div>
);}
