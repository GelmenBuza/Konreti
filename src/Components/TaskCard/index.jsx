

export default function TaskCard ({task, onClick}) {


    return (
        <div onClick={() => onClick(task.id)}>
            <h4>{task.shortDescription}</h4>
            <div>
                <span>{task.createdAt}</span>
                <p>{task.status}</p>
            </div>
        </div>
    )
}