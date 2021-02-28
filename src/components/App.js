import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import * as auth from '../utils/auth.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import DeleteCardPopup from './DeleteCardPopup';
import PopupClose from './PopupClose.js';
import ProtectedRoute from './ProtectedRoute.js';
import Register from './Register.js';
import Login from './Login.js';
import InfoTooltip from './InfoTooltip.js';
import checkLogo from '../images/check.svg';
import errorLogo from '../images/error.svg';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false);
  const [cardDelete, setCardDelete] = React.useState({});
  const history = useHistory();
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [loggedId, setLoggedId] = React.useState(false);
  const [userData, setUserData] = React.useState("");
  const [dataInfoTool, setDataInfoTool] = React.useState({
    title: "",
    icon: ""
  });

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleInfoTooltipClick() {
    setInfoTooltipOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard({ 
      isOpen: true, 
      link: card.link, 
      title: card.name, 
    });
  }
  
  function handleDeleteCardClick(card) {
    setDeleteCardPopupOpen(true);
    setCardDelete(card);
  }

  function handleRegister(email, password) {
    auth.register(email, password)
      .then((data) => {
        history.push("/sign-in");
        console.log(data);
        setDataInfoTool({ title: "Вы успешно зарегистрировались!", icon: checkLogo });
        handleInfoTooltipClick();
      })
      .catch((error) => {
        console.error(error);
        setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: errorLogo });
        handleInfoTooltipClick();
      })
  }

  function handleLogin(email, password) {
    console.log(email, password);
    auth.login(email, password)
      .then((data) => {
        auth.checkToken(data.token)
          .then((res) => {
            setUserData(res.data.email);
          })
          .catch((error) => {
            console.error(error);
            setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: errorLogo });
            handleInfoTooltipClick();
          })
          localStorage.setItem("token", data.token);
          setLoggedId(true);
          history.push("/");
      })
      .catch((error) => {
        console.error(error);
        setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: errorLogo });
        handleInfoTooltipClick();
      })
  }

  function handleCheckToken() {
    const token = localStorage.getItem("token");
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedId(true);
            setUserData(res.data.email);
            history.push("/");
          } else {
            setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: errorLogo });
            handleInfoTooltipClick();
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  React.useEffect(() => {
    handleCheckToken();
  }, []);

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard({ isOpen: false });
    setLoading(false);
    setDeleteCardPopupOpen(false);
    setInfoTooltipOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    setLoading(true);
    api.editProfile({ name, about })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleAddPlaceSubmit({ name, link }) {
    setLoading(true);
    api.addNewCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleUpdateAvatar({ avatar }) {
    setLoading(true);
    api.editAvatar({ avatar })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleCardDelete(card) {
    setLoading(true);
    api.deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.deleteLike(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function signOut() {
    setLoggedId(false);
    setUserData("");
    localStorage.removeItem("token");
    history.push("/sign-in");
  }

  React.useEffect(() => {
    const promises = [api.getUserInfo(), api.getInitialCards()];

    Promise.all(promises)
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">

        <Header 
          headerMail={userData} 
          signOut={signOut} 
        />

        <Switch>
          <ProtectedRoute
            exact 
            path="/"
            loggedId={loggedId}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteCardClick}
          />

          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>

          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>

          <Route exact path="/">
            {loggedId ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <EditProfilePopup 
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />

        <EditAvatarPopup 
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <DeleteCardPopup 
          card={cardDelete}
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          isLoading={isLoading}
        />

        <InfoTooltip 
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={dataInfoTool.title}
          icon={dataInfoTool.icon}
        />

        <PopupClose>
          <ImagePopup 
            card={selectedCard}
            isOpen={selectedCard.isOpen}
            onClose={closeAllPopups} 
          />
        </PopupClose>

        <Footer />
      
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
