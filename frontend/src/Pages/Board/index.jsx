import { useNavigate, useParams } from "react-router";
import { userStore } from "../../Stores/userStore.js";
import { useEffect, useState, useMemo } from "react";
import TaskCard from "../../Components/TaskCard/index.jsx";
import TaskBigCard from "../../Components/TaskBigCard/index.jsx";
import cardApi from "../../api/cardApi.js";
import styles from "./style.module.css"
import settingsSVG from "../../assets/settings.svg"
import boardApi from "../../api/boardApi.js";

import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    closestCenter,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCard({ task, onTaskClick }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        </div>
    )
}

function Column({ column, tasks, onTaskClick }) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    return (
        <div ref={setNodeRef} className={`${styles.column} ${column.title === 'new' ? styles.new : column.title === 'working' ? styles.inWork : column.title === 'testing' ? styles.testing : styles.done}`}>
            <h3 className={styles.columnTitle}>{column.title}</h3>
            <div className={styles.tasksContainer}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks && tasks.map((task) => (
                        <SortableCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>
            </div>
        </div >
    )
}


export default function Board() {
    const { boardId } = useParams();
    const { user } = userStore()
    const navigate = useNavigate();
    const [board, setBoard] = useState({ columns: [] });
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);



    useEffect(() => {
        if (!user || !boardId) navigate('/profile');
    }, [user, boardId, navigate])

    useEffect(() => {
        const FetchBoardData = async () => {

            const boardData = await boardApi.getBoardById(boardId)
            const cards = await cardApi.getCardsOnBoard(boardId);
            const columnsRes = await boardApi.getColumnsByBoardId(boardId)

            const currentBoard = {
                ...boardData,
                tasks: [
                    ...cards
                ],
                columns: [...columnsRes]
            }
            setBoard(currentBoard)

            setIsLoaded(true)
            console.log('loaded', board)
        }
        FetchBoardData()

    }, [boardId])

    const handleTaskCreate = async () => {
        const newColumn = board.columns.find(column => column.title === 'new')


        const res = await cardApi.createCard(newColumn.id, 'Новая задача', 'Описание задачи')

        setBoard(prev => ({ ...prev, tasks: [...(prev.tasks || []), res] }))
    }

    const onTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
    }

    // Для D&D

    const columnsAndTasks = useMemo(() => {
        const sortedCols = [...board.columns].sort((a, b) => a.position - b.position);
        const tasksByCol = {};

        sortedCols.forEach(col => {
            tasksByCol[col.id] = board.tasks
                .filter(t => t.columnId === col.id)
                .sort((a, b) => a.position - b.position);
        });

        return { sortedCols, tasksByCol };
    }, [board]);


    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeTask = board.tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        const isOverColumn = board.columns.some(c => c.id === over.id);
        const destColumnId = isOverColumn ? over.id : board.tasks.find(t => t.id === over.id)?.columnId;
        if (!destColumnId) return;

        const newColumnId = destColumnId;

        const destTasks = board.tasks
            .filter(t => t.columnId === destColumnId && t.id !== active.id)
            .sort((a, b) => a.position - b.position);
        let newIndex = destTasks.length;
        if (!isOverColumn) {
            const overIdx = destTasks.findIndex(t => t.id === over.id);
            if (overIdx !== -1) newIndex = overIdx;
        }

        const movePayload = {
            taskId: active.id,
            newColumnId,
            newPosition: newIndex + 1,
        };

        const res = await cardApi.moveCard(active.id, newColumnId, newIndex + 1)
        if (res.error) {
            alert(`${res.error}, молись`)
        }

        setBoard(prev => {
            const tasksWithoutActive = prev.tasks.filter(t => t.id !== active.id);

            const destTasks = tasksWithoutActive
                .filter(t => t.columnId === destColumnId)
                .sort((a, b) => a.position - b.position);

            let insertIndex = destTasks.length;
            if (!isOverColumn) {
                const overIdx = destTasks.findIndex(t => t.id === over.id);
                if (overIdx !== -1) insertIndex = overIdx;
            }

            const before = destTasks.slice(0, insertIndex);
            const after = destTasks.slice(insertIndex);
            const updatedActive = { ...activeTask, columnId: destColumnId };
            const newDestTasks = [...before, updatedActive, ...after].map((t, i) => ({
                ...t,
                position: i + 1,
            }));

            let finalTasks = tasksWithoutActive.filter(t => t.columnId !== destColumnId);

            if (activeTask.columnId !== destColumnId) {
                const sourceTasks = finalTasks
                    .filter(t => t.columnId === activeTask.columnId)
                    .sort((a, b) => a.position - b.position)
                    .map((t, i) => ({ ...t, position: i + 1 }));

                finalTasks = [
                    ...finalTasks.filter(t => t.columnId !== activeTask.columnId),
                    ...sourceTasks,
                ];
            }

            return { ...prev, tasks: [...finalTasks, ...newDestTasks] };
        });
    };

    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.logo}>Kanreti</h1>

            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>{board.title}</h2>
                    <div className={styles.btnContainer}>
                        <button className={styles.createTaskBtn} onClick={handleTaskCreate}>Новая задача</button>
                        <button className={styles.settingBtn}><img src={settingsSVG} alt="settitngs button" /></button>
                    </div>
                </div>
                {
                    isLoaded &&
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className={styles.columnContainer}>
                            {
                                columnsAndTasks.sortedCols.map(col =>
                                    <Column key={col.id} column={col} tasks={columnsAndTasks.tasksByCol[col.id] || []} onTaskClick={onTaskClick} />)
                            }
                        </div>
                    </DndContext>
                }
                {selectedTaskId && (<TaskBigCard taskId={selectedTaskId} />)}
            </div>
        </div>

    )
}