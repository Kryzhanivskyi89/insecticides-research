
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


import API from "../../redux/api/axios";
import ActCard from "../../components/ActCard/ActCard";
import styles from "./styles.module.css";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statuses = ["todo", "inProgress", "done"];

const statusTitles = {
  todo: "Заплановано",
  inProgress: "В процесі",
  done: "Завершено",
};

const Dashboard = () => {
  const [actsByStatus, setActsByStatus] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchActs = async () => {
      try {
        const res = await API.get("/api/acts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        const grouped = {
          todo: [],
          inProgress: [],
          done: [],
        };

        data.forEach((act) => {
          const st = act.status || "todo";
          if (!grouped[st]) grouped[st] = [];
          grouped[st].push(act);
        });

        setActsByStatus(grouped);
      } catch (err) {
        console.error("Помилка при отриманні актів:", err);
      }
    };

    fetchActs();
  }, [token]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return; 

    const startStatus = source.droppableId;
    const endStatus = destination.droppableId;

    const startList = Array.from(actsByStatus[startStatus]);
    const endList = Array.from(actsByStatus[endStatus]);

    const movedActIndex = startList.findIndex((a) => a._id === draggableId);
    const [movedAct] = startList.splice(movedActIndex, 1);

    if (startStatus === endStatus) {
      startList.splice(destination.index, 0, movedAct);
      setActsByStatus((prev) => ({
        ...prev,
        [startStatus]: startList,
      }));
    } else {
      movedAct.status = endStatus;
      endList.splice(destination.index, 0, movedAct);

      setActsByStatus((prev) => ({
        ...prev,
        [startStatus]: startList,
        [endStatus]: endList,
      }));

      try {
        await API.put(
          `/api/acts/${draggableId}`,
          { status: endStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Помилка оновлення статусу:", error);
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.dashboardTitle}>Канбан-дошка актів</h2>
       <div className={styles.header}>
         <h2>📋 Список актів</h2>
        <Link to="/new-act" className={styles.addButton}>
          ➕ Новий акт
        </Link>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.board}>
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  className={styles.column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>{statusTitles[status]}</h3>
                  {actsByStatus[status].map((act, index) => (
                    <Draggable
                      draggableId={act._id}
                      index={index}
                      key={act._id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ActCard act={act} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;