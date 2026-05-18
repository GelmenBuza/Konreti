import { useEffect, useState } from "react";
import { userStore } from "../../Stores/userStore.js";
import { useNavigate } from "react-router";
import BoardCard from "../../Components/BoardCard/index.jsx";
import styles from "./style.module.css"
import searchSVG from "../../assets/search.svg";
import checkSVG from "../../assets/check.svg";
import editSVG from "../../assets/edit.svg";
import plusSVG from "../../assets/plus.svg"
import closeSVG from "../../assets/x.svg"
import boardApi from "../../api/boardApi.js";

const ProfileSection = ({ user }) => {
    const [isNameChange, setIsNameChange] = useState(false);
    const [isEmailChange, setIsEmailChange] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const confirmEdit = (field) => {
        switch (field) {
            case "email":
                setIsEmailChange(false);
                setNewEmail('');
                // Логику для запроса на бэк
                break;
            case "name":
                setIsNameChange(false);
                setNewName('');
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
                                <img src={checkSVG} alt="confirm" />
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
    const [search, setSearch] = useState("");
    const [boards, setBoards] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);

    const [isCreate, setIsCreate] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState("");
    const [newBoardDescription, setNewBoardDescription] = useState("Описание");
    const [modalErrors, setModalErrors] = useState({})


    useEffect(() => {
        const fetchBoards = async () => {

            const res = await boardApi.getBoardsByUser();

            setBoards(res);
        };
        fetchBoards();
    }, [user]);

    const filter = (text) => {
        if (text) {
            console.log(boards)
            return boards.filter(board => board.title.toLowerCase().includes(text.toLowerCase()));
        }
        return boards;
    }

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            setFilteredBoards(filter(search));
        }, 300);
        return () => clearTimeout(searchTimeout);
    }, [search]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();

        if (newBoardTitle && newBoardDescription) {
            const res = await boardApi.createBoard(newBoardTitle, newBoardDescription);
            if (res) {
                setBoards([...boards, res]);
                setIsCreate(false);
                setNewBoardTitle('');
                setNewBoardDescription('Описание');
                setModalErrors({});
            }
        } else {
            setModalErrors({
                global: "Введите название и описание доски",
            })
        }

    };

    const handleClose = () => {
        setIsCreate(false)

        setModalErrors({});
        setNewBoardTitle('');
        setNewBoardDescription('Описание');
    }


    return (
        <>

            <div className={styles.userBoard}>
                <h2 className={styles.sectionsTitle}>Ваши доски</h2>
                <div className={styles.searchContainer}>

                    <label htmlFor="search" className={styles.searchLabel}>
                        <input id="search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти доску" />
                        {!search && <img src={searchSVG} alt="search" />}
                    </label>

                    <button className={styles.createBtn} onClick={() => setIsCreate(true)}><img src={plusSVG} alt="Create board" /></button>
                </div>
                <div className={styles.boards}>
                    {
                        search ?
                            filteredBoards.map(board => (
                                <BoardCard boardData={board} key={board.id} />
                            ))
                            :
                            boards.map((board) => (
                                <BoardCard boardData={board} key={board.id} />
                            ))
                    }
                </div>
            </div>

            {isCreate &&
                <div className={styles.createModal}>
                    <form className={styles.modalForm} onSubmit={(e) => handleCreateBoard(e)}>

                        <button className={styles.closeBtn} onClick={() => handleClose()}>
                            <img src={closeSVG} alt="close" />
                        </button>


                        <h2 className={styles.sectionsTitle}>Создание доски</h2>
                        <div className={styles.modalInputContainer}>
                            <label className={styles.modalInput}>
                                <input type="text" placeholder="Название доски" value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} />
                            </label>

                            <label className={styles.modalInput}>
                                <textarea type="text" value={newBoardDescription} onChange={(e) => setNewBoardDescription(e.target.value)} placeholder="Описание доски" />
                            </label>
                        </div>

                        <button type="submit" className={styles.confirmButton}>Создать</button>
                    </form>
                </div>
            }
        </>
    )
}

export default function Profile() {
    const { user } = userStore();
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
        return;
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