import {useEffect, useState} from "react";
import {userStore} from "../../Stores/userStore.js";
import {useNavigate} from "react-router";
import BoardCard from "../../Components/BoardCard/index.jsx";


const ProfileSection = ({user}) => {
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
        <div>
            <h2>Профиль</h2>
            <div>
                <div>
                    {isNameChange ?
                        <>
                            <button onClick={() => confirmEdit('name')}>
                                <img src="../../assets/check.svg" alt="confirm"/>
                            </button>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}/>
                        </>
                        :
                        <>
                            <button onClick={() => setIsNameChange(true)}>
                                <img src="../../assets/edit.svg" alt="edit"/>
                            </button>
                            <p>{user.name}</p>
                        </>
                    }
                </div>
                <div>
                    {isEmailChange ?
                        <>
                            <button onClick={() => confirmEdit('email')}>
                                <img src="../../assets/check.svg" alt="confirm"/>
                            </button>
                            <input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                        </>
                        :
                        <>
                            <button onClick={() => setIsEmailChange(true)}>
                                <img src="../../assets/edit.svg" alt="edit"/>
                            </button>
                            <p>{user.email}</p>
                        </>
                    }
                </div>
                <div>
                    <p>{user.createdAt}</p>
                </div>
            </div>
            <button>Удалить аккаунт</button>
            <button>Выход</button>
        </div>
    )
}

const AboutSection = () => {
    return (
        <div>
            <h2>O <span>Kanreti</span></h2>
            <p>Тут очень много важного текста(возможно и не очень важного)</p>
        </div>
    )
}

const UserBoardsSection = ({user}) => {
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
        <div>
            <h2>Ваши доски</h2>
            <label htmlFor="search">
                <input id="search" type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                {!search && <img src="../../assets/search.svg" alt="search"/>}
            </label>
            {
                search ?
                    filteredBoards.map(board => (
                        <BoardCard board={board} key={board.id}/>
                    ))
                    :
                    boards.map((board) => (
                        <BoardCard boardData={board} key={board.id}/>
                    ))
            }
        </div>
    )
}


export default function Profile() {
    const {user} = userStore();
    const navigate = useNavigate();

    if (!user) {
        navigate('/')
    }


    return (
        <>
            <ProfileSection user={user} />
            <AboutSection/>
            <UserBoardsSection user={user} />
        </>
    )
}