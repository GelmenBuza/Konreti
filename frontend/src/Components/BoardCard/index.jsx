export default function BoardCard({boardData}) {

    return (
        <div className="BoardCard">
            <div>
                <h3>{boardData.title}</h3>
                <p>{boardData.shortDescription}</p>
            </div>
            <img src={boardData.img} alt="board image"/>
        </div>
    )
}