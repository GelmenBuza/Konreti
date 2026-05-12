import {useEffect} from "react";

export default function TaskBigCard({taskId, setSelectedTaskId}) {

    const [task, setTask] = useState(null);

    const tasks = [{
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
    ]

    useEffect(() => {
        const fetchTaskData = async () => {
            setTask(tasks.find((task) => task.id === task.id));
        }

        fetchTaskData();
    }, [taskId])

    if (!task) {
        throw new Error(`No task with id ${task.id}`);
    }

    const deleteTask = async () => {
        //     Логика запроса
    }

    return (
        <div>
            <div>
                <h3>{task.shortDescription}</h3>
                <p>{task.description}</p>
                <span>Дата создания: {task.createdAt}</span>
                <span>Дата сгорания: {task.burnAt}</span>

                <button onClick={() => setSelectedTaskId(null)}><img src="../../assets/x.svg" alt="close"/></button>
                <button onClick={() => deleteTask()}>Удалить задачу</button>
            </div>
        </div>
    )
}