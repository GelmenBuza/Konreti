import styles from "./style.module.css"
import settingsSVG from "../../assets/settings.svg"

export default function TaskCard({ task, onClick }) {

    return (
        <div className={styles.taskCard}>
            <h4 className={styles.taskTitle}>{task.title}</h4>
            <div className={styles.taskInfo}>
                <span className={styles.taskCreatedAt}>{task.createdAt}</span>
                <button className={styles.settingsBtn} onClick={() => onClick(task.id)}><img src={settingsSVG} alt="settings" /></button>
                <p className={styles.taskStatus} style={{ backgroundColor: task.status === 'new' ? "#DDAFAF" : task.status === 'working' ? '#D8D096' : task.status === 'testing' ? "#B6D7A5" : "#C8B6D2" }}>{task.status}</p>
            </div>
        </div>
    )
}