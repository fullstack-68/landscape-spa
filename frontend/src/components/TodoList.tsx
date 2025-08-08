import { type FC } from "react";
import axios from "axios";
import useStore from "../utils/store";
import { type TodoType } from "../utils/types";
import styles from "./spinner.module.css";
import { useShallow } from "zustand/shallow";

interface Props {
  fetchData: () => void;
  todos: TodoType[];
}
export const TodoList: FC<Props> = ({ fetchData, todos }) => {
  const [curId] = useStore(useShallow((state) => [state.curId]));

  return (
    <div data-cy="todo-item-wrapper">
      {todos.map((todo, idx) => {
        const fontStyle = todo.id === curId ? "700" : "400";
        const fontClass = todo.id === curId ? "pico-color-blue-400" : "";
        return (
          <article
            key={todo.id}
            className="grid"
            style={{
              alignItems: "center",
              gridTemplateColumns: "0.5fr 4fr 1fr 1fr",
            }}
          >
            <span>({idx + 1})</span>
            <span style={{ fontWeight: fontStyle }} className={fontClass}>
              ✍️ {todo.todoText}
            </span>
            <ButtonGroup fetchData={fetchData} todo={todo} />
          </article>
        );
      })}
    </div>
  );
};

interface PropsButtonGroup {
  fetchData: () => void;
  todo: TodoType;
}
const ButtonGroup: FC<PropsButtonGroup> = ({ todo, fetchData }) => {
  const [setPending] = useStore(useShallow((state) => [state.setPending]));
  function handleDelete(id: string) {
    setPending(true);
    axios
      .delete("/api/todo", { data: { curId: id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
      })
      .catch((err) => alert(err))
      .finally(() => setPending(false));
  }

  const [mode, setMode, setInputText, setCurId] = useStore(
    useShallow((state) => [
      state.mode,
      state.setMode,
      state.setInputText,
      state.setCurId,
    ])
  );

  if (mode === "EDIT") return <></>;

  return (
    <>
      <div
        className={styles["custom-btn"]}
        onClick={() => {
          setMode("EDIT");
          setCurId(todo.id);
          setInputText(todo.todoText);
        }}
      >
        🖊️
      </div>
      <div
        className={styles["custom-btn"]}
        style={{ cursor: "pointer" }}
        onClick={() => handleDelete(todo.id)}
      >
        🗑️
      </div>
    </>
  );
};
