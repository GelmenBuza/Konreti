import { useEffect, useState } from "react";
import { userStore } from "../../Stores/userStore.js";
import { useNavigate } from "react-router";
import BoardCard from "../../Components/BoardCard/index.jsx";
import styles from "./style.module.css"
import searchSVG from "../../assets/search.svg";
import checkSVG from "../../assets/check.svg";
import editSVG from "../../assets/edit.svg";

const ProfileSection = ({ user }) => {
    const [isNameChange, setIsNameChange] = useState(false);
    const [isEmailChange, setIsEmailChange] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");


    const confirmEdit = (field) => {
        switch (field) {
            case "email":
                setIsEmailChange(false);
                setNewEmail('')
                // Логику для запроса на бэк
                break;
            case "name":
                setIsNameChange(false);
                setNewName('')
                // Логику для запроса на бэк
                break;
        }
    }


    return (
        <div className={styles.profileSection}>
            <h2 className={styles.sectionsTitle}>Профиль</h2>
            <div className={styles.userData}>
                <div className={styles.userDataItem}>
                    {isNameChange ?
                        <>
                            <button onClick={() => confirmEdit('name')} className={styles.confirmButton}>
                                <img src={checkSVG}  alt="confirm" />
                            </button>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={styles.inputField} />
                        </>
                        :
                        <>
                            <button onClick={() => setIsNameChange(true)} className={styles.editButton}>
                                <img src={editSVG} alt="edit" />
                            </button>
                            <p className={styles.dataField}>{user.fullName}</p>
                        </>
                    }
                </div>
                <div className={styles.userDataItem}>
                    {isEmailChange ?
                        <>
                            <button onClick={() => confirmEdit('email')} className={styles.confirmButton}>
                                <img src={checkSVG} alt="confirm" />
                            </button>
                            <input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={styles.inputField} />
                        </>
                        :
                        <>
                            <button onClick={() => setIsEmailChange(true)} className={styles.editButton}>
                                <img src={editSVG} alt="edit" />
                            </button>
                            <p className={styles.dataField}>{user.email}</p>
                        </>
                    }
                </div>
                <div className={styles.userDataItem}>
                    <p className={styles.dataField}>{user.createdAt}</p>
                </div>
            </div>
            <button className={styles.buttonDelete}>Удалить аккаунт</button>
            <button className={styles.buttonLogout}>Выход</button>
        </div>
    )
}

const AboutSection = () => {
    return (
        <div className={styles.aboutSection}>
            <h2 className={styles.sectionsTitle}>O <span className={styles.inlineLogo}>Kanreti</span></h2>
            <p className={styles.aboutData}>Тут очень много важного текста(возможно и не очень важного)</p>
        </div>
    )
}

const UserBoardsSection = ({ user }) => {
    const [search, setSearch] = useState("")
    const [boards, setBoards] = useState([])
    const navigate = useNavigate();
    let filteredBoards = ''

    useEffect(() => {
        const fetchBoards = async () => {
            // Логика запроса
            setBoards([{
                id: 1,
                title: "Test",
                shortDescription: "Test test test",
                img: '',
                createdAt: '2026-05-01 14:14:56.472'
            }])
        }
        fetchBoards()
    }, [user])

    useEffect(() => {
        filteredBoards = boards.filter(board => board.name.includes(title));
    }, [search])

    return (
        <div className={styles.userBoard}>
            <h2 className={styles.sectionsTitle}>Ваши доски</h2>
            <label htmlFor="search" className={styles.searchLabel}>
                <input id="search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти доску" />
                {!search && <img src={searchSVG} alt="search" />}
            </label>
            <div className={styles.boards}>
                {
                    search ?
                        filteredBoards.map(board => (
                            <BoardCard board={board} key={board.id} />
                        ))
                        :
                        boards.map((board) => (
                            <BoardCard boardData={board} key={board.id} />
                        ))
                }
            </div>
        </div>
    )
}


export default function Profile() {
    const { user } = userStore()
    const navigate = useNavigate();

    if (!user) {
        navigate('/')
    }


    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.logo}>Kanreti</h1>
            <ProfileSection user={user} />
            <AboutSection />
            <UserBoardsSection user={user} />
        </div>
    )
}