import React, { useEffect, useState } from "react";
import DropDown from "./dropDown";
import deleteIcon from "../assets/delete.svg";
import { FiEdit2 } from "react-icons/fi";
import Toast from "./toast";
interface ITask {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

interface IToDoListProps {
  selectedCategory: string;
}

interface IToast {
  message: string;
  type: "add" | "edit" | "delete" | null;
}

const ToDOList = ({ selectedCategory }: IToDoListProps) => {
  const [todos, setToDos] = useState<ITask[]>(() => {
    const temp = localStorage.getItem("todos");
    return temp ? JSON.parse(temp) : [];
  });

  const [todo, setToDo] = useState("");
  const [todoEditing, setToDoEditing] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showError, setShowError] = useState(false);
  const [editError, setEditError] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [dropdownValues, setDropdownValues] = useState("Pick your category");
  const [toast, setToast] = useState<IToast>({
    message: "",
    type: null,
  });
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clickedCategory = e.target.value;
    setDropdownValues(clickedCategory);
  };
  useEffect(() => {
    if (!hasSubmitted) return;

    if (todo.trim().length >= 3) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [todo, hasSubmitted]);
  useEffect(() => {
    const temp = localStorage.getItem("todos");
    if (temp) {
      const loadedTodos = JSON.parse(temp);
      setToDos(loadedTodos);
    }
  }, []);
  useEffect(() => {
    const json = JSON.stringify(todos);
    localStorage.setItem("todos", json);
  }, [todos]);

  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const newTask = {
      id: new Date().getTime(),
      text: todo,
      completed: false,
      category: dropdownValues,
    };
    setHasSubmitted(true);
    if (todo.trim().length < 3) {
      setShowError(true);
    } else {
      setShowError(false);
      setToDo("");
      setToDos([...todos.concat(newTask)]);
      setHasSubmitted(false);
      setToast({ message: "Task added!", type: "add" });
      setTimeout(() => setToast({ message: "", type: null }), 2000);
    }
  }

  function deleteTodo(id: number) {
    const updatedTodo = [...todos].filter((todo) => todo.id !== id);
    setToDos(updatedTodo);

    setToast({ message: "Task removed!", type: "delete" });
    setTimeout(() => setToast({ message: "", type: null }), 2000);
  }

  function toggleComplete(id: number) {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      setToast({
        message: todo.completed
          ? "Task marked as completed!"
          : "Task marked as incomplete",
        type: "edit",
      });
      setTimeout(() => setToast({ message: "", type: null }), 2000);
      return todo;
    });

    setToDos(updatedTodos);
  }

  function editTodo(id: number) {
    if (editingText.trim().length < 3) {
      setEditError(true);
      return;
    }

    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    const textChanged = targetTodo.text !== editingText;
    const categoryChanged = targetTodo.category !== editingCategory;
    if (!textChanged && !categoryChanged) {
      setToast({ message: "Nothing changed.", type: "edit" });
      setTimeout(() => setToast({ message: "", type: null }), 2000);
      setToDoEditing(null);
      setEditingText("");
      setEditingCategory("");
      return;
    }
    setEditError(false);
    const updatedTodo = [...todos].map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text: editingText,
          category: editingCategory || "Uncategorized",
        };
      }
      return todo;
    });
    setToDos(updatedTodo);
    setToDoEditing(null);
    setEditingText("");
    setEditingCategory("");
    setToast({ message: "Task updated!", type: "edit" });
    setTimeout(() => setToast({ message: "", type: null }), 2000);
  }

  return (
    <div>
      <form id="to-do" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setToDo(e.target.value)}
          className="bg-[#F3F3F3] mb-3 w-[95%] p-3 rounded-lg outline-0"
          type="text"
          name="addTask"
          value={todo}
          id="addTask"
          placeholder="Add a new task"
        />
        <p className={`text-red-600 mb-3 ${showError ? "" : "hidden"}`}>
          Task title should be at least 3 characters.
        </p>
        <div className="flex gap-3">
          <DropDown category={dropdownValues} onChange={handleChange} />
          <button
            type="submit"
            className="bg-[#EA5959] cursor-pointer text-white rounded-lg py-2 px-4"
          >
            submit
          </button>
        </div>
      </form>
      {todos
        .filter(
          (todo) =>
            selectedCategory === "All" || todo.category === selectedCategory
        )
        .map((todo) => (
          <div key={todo.id} className="mt-7 flex justify-between">
            <div className="flex items-center gap-5">
              <input
                type="checkbox"
                onChange={() => toggleComplete(todo.id)}
                checked={todo.completed}
                className="custom-checkbox"
              />

              {todoEditing === todo.id ? (
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      setEditingText(e.target.value);
                      if (e.target.value.trim().length >= 3) {
                        setEditError(false);
                      }
                    }}
                    value={editingText}
                    placeholder={todo.text}
                    className="bg-[#F3F3F3] p-2 rounded-lg outline-0"
                  />
                  {editError && (
                    <p className="text-red-600 mt-1 text-md">
                      Task title should be at least at 3 characters.
                    </p>
                  )}
                </div>
              ) : (
                <div className={todo.completed ? "line-through" : ""}>
                  {todo.text}
                </div>
              )}
              {todoEditing === todo.id ? (
                <DropDown
                  category={editingCategory}
                  onChange={(e) => setEditingCategory(e.target.value)}
                />
              ) : (
                <div className="text-white bg-[#EA5959] rounded-sm py-[1px] px-7">
                  {todo.category === "Pick your category"
                    ? (todo.category = "Uncategorized")
                    : todo.category}
                </div>
              )}
            </div>
            <div className="flex item-center gap-5 mr-11">
              {todoEditing === todo.id ? (
                <button
                  className="bg-[#EA5959] self-center cursor-pointer px-3 text-white rounded-lg h-10 flex items-center"
                  onClick={() => editTodo(todo.id)}
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={() => {
                    setToDoEditing(todo.id);
                    setEditingText(todo.text);
                    setEditingCategory(todo.category);
                  }}
                  className="cursor-pointer text-[#EA5959]"
                >
                  <FiEdit2 />
                </button>
              )}
              <button
                className="cursor-pointer"
                onClick={() => deleteTodo(todo.id)}
              >
                <img src={deleteIcon} alt="delete" />
              </button>
            </div>
          </div>
        ))}
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default ToDOList;
