class Api {
  constructor({ url }) {
    this._url = url;
  }

  //Ответ от сервера
  _getResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Возникла ошибка: ${res.status}`);
  }
  
  //Получить начальный карточки
  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(this._getResponse);
  }

  //Получение текущей информации в профиле
  getUserData() {
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(this._getResponse);
  }

  //Патч новой информации в профиль
  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        name: data.name, 
        about: data.about,
      }),
    }).then(this._getResponse);
  }

  //Пост новой карточки
  postCard(data) {
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(this._getResponse)
  }

  //Удаление карточки
  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: 'DELETE',
    })
      .then(this._getResponse);
  }

  //Поставить лайк
  setLike(id) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: 'PUT',
    })
      .then(this._getResponse);
  }

  //Удалить лайк
  deleteLike(id) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: 'DELETE',
    })
      .then(this._getResponse);
  }

  //Изменить аватар
  patchAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar
      })
    }).then(this._getResponse);
  }
}

const apiConfig = {
  url: 'https://api.mesto-altapov.nomoredomainsmonster.ru',
  // headers: {
  //   authorization: '1d76cac4-bc77-42fa-bf15-5d8cd3682348',
  //   "Content-Type": "application/json",
  // }
};

export const api = new Api(apiConfig);