import { useNavigate, useParams } from "react-router";
import { userStore } from "../../Stores/userStore.js";
import { useEffect, useState } from "react";
import TaskCard from "../../Components/TaskCard/index.jsx";
import TaskBigCard from "../../Components/TaskBigCard/index.jsx";
import cardApi from "../../api/cardApi.js";
import styles from "./style.module.css"
import settingsSVG from "../../assets/settings.svg"


export default function Board() {
    const { boardId } = useParams();
    const { user } = userStore()
    const navigate = useNavigate();
    const [board, setBoard] = useState({});
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    if (!user || !boardId) navigate('/profile');

    useEffect(() => {
        const FetchBoardData = async () => {

            const res = await cardApi.getCardsOnBoard(boardId);
            console.log(res);


            setBoard({
                id: 1,
                title: "Test",
                tasks: [{
                    id: 1,
                    status: 'new',
                    shortDescription: "Test TEst test",
                    description: "Test description",
                    createdAt: '2026-05-01 14:14:56.472',
                    burnAt: '2026-09-01 14:14:56.472'
                }, {
                    id: 2,
                    status: 'working',
                    shortDescription: "Test TEst test test",
                    description: "Test description",
                    createdAt: '2026-05-01 14:14:56.472',
                    burnAt: '2026-09-01 14:14:56.472'
                }, {
                    id: 3,
                    status: 'testing',
                    shortDescription: "test",
                    description: "Test description",
                    createdAt: '2026-05-01 14:14:56.472',
                    burnAt: '2026-09-01 14:14:56.472'
                }, {
                    id: 4,
                    status: 'done',
                    shortDescription: "DONE",
                    description: "Test description",
                    createdAt: '2026-05-01 14:14:56.472',
                    burnAt: '2026-09-01 14:14:56.472'
                }
                ],
                usersId: [1, 2, 3, 4, 5]
            }
            )
        }
        FetchBoardData()
    }, [])

    const onTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
    }



    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.logo}>Kanreti</h1>

            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>{board.title}</h2>
                    <div className={styles.btnContainer}>

                        <button className={styles.createTaskBtn}>Новая задача</button>
                        <button className={styles.settingBtn}><img src={settingsSVG} alt="settitngs button" /></button>
                    </div>
                </div>
                <div className={styles.columnContainer}>
                    <div className={`${styles.column} ${styles.new}`}>
                        <h3 className={styles.columnTitle}>Новые задачи</h3>
                        {board.tasks && board.tasks.filter((task) => task.status === 'new').map((task) => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />))}
                    </div>
                    <div className={`${styles.column} ${styles.inWork}`}>
                        <h3 className={styles.columnTitle}>В работе</h3>
                        {board.tasks && board.tasks.filter((task) => task.status === 'working').map((task) => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />))}
                    </div>
                    <div className={`${styles.column} ${styles.testing}`}>
                        <h3 className={styles.columnTitle}>Тестирование</h3>
                        {board.tasks && board.tasks.filter((task) => task.status === 'testing').map((task) => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />))}
                    </div>
                    <div className={`${styles.column} ${styles.done}`}>
                        <h3 className={styles.columnTitle}>Готовы</h3>
                        {board.tasks && board.tasks.filter((task) => task.status === 'done').map((task) => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />))}
                    </div>
                </div>
                {selectedTaskId && (<TaskBigCard taskId={selectedTaskId} />)}
            </div>
        </div>

    )
}