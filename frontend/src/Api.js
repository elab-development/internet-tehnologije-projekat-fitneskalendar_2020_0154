import axios from "axios";

class Api {
  
  login(email,password){
    return axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });
  }
  googleLogout() {
    return axios.get("http://127.0.0.1:8000/google/logout");
  }
  logout(authToken){
   return axios.post('http://127.0.0.1:8000/api/logout', null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  registracija(formData){
    return axios.post('http://127.0.0.1:8000/api/register', formData);
  }
  vratiTipoveDogadjaja(authToken){
    return axios.get('http://127.0.0.1:8000/api/tipoviDogadjaja', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  napraviDogadjaj(authToken,eventData){
    return axios.post('http://127.0.0.1:8000/api/dogadjaji', eventData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  googleRedirect(eventData){
    return axios.get('http://127.0.0.1:8000/google/redirect', {
      params: eventData 
    }); 
  }
  napraviTipDogadjaja(newEventType,authToken){
   return axios.post(
      "http://127.0.0.1:8000/api/tipoviDogadjaja",
      newEventType,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }
  izbrisiTipDogadjaja(id,authToken){
    return axios.delete(`http://127.0.0.1:8000/api/tipoviDogadjaja/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  vratiDogadjaj(idDogadjaja,authToken){
    return axios.get(`http://127.0.0.1:8000/api/dogadjaji/${idDogadjaja}`,
      {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
  );
  }
  izmeniDogadjaj(id,event,authToken){
   return axios.put(`http://127.0.0.1:8000/api/dogadjaji/${id}`, event, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  vratiKonkretniTipDogadjaja(id,authToken){
    return axios.get(
      `http://127.0.0.1:8000/api/dogadjaji/poTipu/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }
  vratiKorisnika(authToken){
    return  axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
  }
  vratiJavneDogadjaje(){
    return axios.get(
      "http://127.0.0.1:8000/api/dogadjaji/javni"
    );
  }
  izbrisiDogadjaj(id,authToken){
    return axios.delete(
      `http://127.0.0.1:8000/api/dogadjaji/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }
  vratiDogadjaje(authToken){
    return axios.get("http://127.0.0.1:8000/api/dogadjaji", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  vratiKorisnike(authToken){
    return axios.get("http://127.0.0.1:8000/api/users", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  izbrisiKorisnika(id,authToken){
    return axios.delete(
      `http://127.0.0.1:8000/api/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }
  izmeniKorisnika(id, updatedData,authToken){
    return axios.put(`http://127.0.0.1:8000/api/users/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  korisnikoviDogadjaji(authToken){
   return axios.get("http://127.0.0.1:8000/api/korisnikoviDogadjaji", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  vratiPrognozu(city){
    return axios.get(`http://127.0.0.1:8000/api/prognoza/${city}`);
  }
  
}

const api = new Api();
export default api;
