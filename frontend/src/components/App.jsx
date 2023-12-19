import React, { useEffect } from 'react';
import Header from './Header';
import Main from './Main.jsx';
import Footer from './Footer.jsx';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import {api} from '../utils/Api.js';
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import InfoToolTip from './InfoTooltip';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from "./ProtectedRoute";
import * as auth from "../utils/auth.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      Promise.all([ api.getUserData(), api.getInitialCards() ])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((error) => {
          console.log(error);
        })
      }
  }, [isLoggedIn]);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true);
          setUserEmail(res.data.email);
          navigate("/", {replace: true}); 
        })
        .catch((error) => {
          console.log(error);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRegister(email, password) {
    auth.register(email, password)
      .then((res) => {
        if (res) {
          setIsSuccess(true);
          setIsLoginPopupOpen(true);
          navigate("/sign-in", {replace: true});   
        } else {
          setIsSuccess(false);
          setIsLoginPopupOpen(true);    
        }
      })
      .catch((error) => {
        console.log(error);
        setIsSuccess(false);
        setIsLoginPopupOpen(true);
      })
      //.finally(() => setIsLoginPopupOpen(true));
  }

  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setIsLoggedIn(true);        
      })
      .then(() => {
        setUserEmail(email);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false);
        setIsSuccess(false);
        setIsLoginPopupOpen(true);
      })
  }

  function signOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
  }

  function handleAddPlaceSubmit(data) {
    api.postCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleUpdateUser = (newUserInfo) => {
    api.patchUserInfo(newUserInfo)
      .then((newData) => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleUpdateAvatar = (newUserAvatar) => {
    api.patchAvatar(newUserAvatar)
      .then((newData) => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if (!isLiked) {
      api.setLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api.deleteLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter(item => item._id !== card._id))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleDeleteCardClick = () => {
    setIsDeleteCardPopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsLoginPopupOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={userEmail} isLoggedIn={isLoggedIn} signOut={signOut} />
        <Routes>
          <Route path="/sign-up" 
            element={isLoggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleRegister} />}>
          </Route>
          <Route path="/sign-in" 
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}>
          </Route>
          <Route path="/" element={
            <ProtectedRouteElement
              isLoggedIn={isLoggedIn}
              element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onDeleteCard={handleDeleteCardClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards} />}>
          </Route>
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/sign-in"} replace />} />
        </Routes>
        {isLoggedIn && <Footer />}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />
        <EditAvatarPopup 
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups} 
          onUpdateAvatar={handleUpdateAvatar} />
        <PopupWithForm
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          name="delete"
          buttonText="Да"
          title="Вы уверены?">
        </PopupWithForm>
        <ImagePopup
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          selectedCard={selectedCard} />
        <InfoToolTip 
          isOpen={isLoginPopupOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccess} />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App;
