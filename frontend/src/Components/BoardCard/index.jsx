import styles from "./style.module.css"

export default function BoardCard({boardData}) {

    return (
        <div className={styles.boardCard}>
            <div className={styles.textContainer}>
                <h3 className={styles.title}>{boardData.title}</h3>
                <p className={styles.description}>{boardData.shortDescription}</p>
            </div>
            <img src={boardData.img} alt="board image" className={styles.image}/>
        </div>
    )
}