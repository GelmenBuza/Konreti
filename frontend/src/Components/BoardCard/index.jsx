import styles from "./style.module.css"
import {useNavigate} from "react-router"



export default function BoardCard({ boardData }) {
    const navigate = useNavigate()

    const boardClick = () => {
        console.log('da')
        navigate(`/boards/${boardData.id}`)
    }

    return (
        <button className={styles.boardCard} onClick={() => boardClick()}>
            <div className={styles.textContainer}>
                <h3 className={styles.title}>{boardData.title}</h3>
                <p className={styles.description}>{boardData.shortDescription}</p>
            </div>
            <img src={boardData.img} alt="board image" className={styles.image} />
        </button>
    )
}