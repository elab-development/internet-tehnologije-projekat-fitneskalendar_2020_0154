import axios from "axios";

class Api {

  getToken() {
    return window.localStorage.getItem("authToken");
  }
  
  login(email,password){
    return axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });

  }
  googleLogout() {
    return axios.get("http://127.0.0.1:8000/google/logout");
  }
  logout(){
   return axios.post('http://127.0.0.1:8000/api/logout', null, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  registracija(formData){
    return axios.post('http://127.0.0.1:8000/api/register', formData);
  }
  vratiTipoveDogadjaja(){
    return axios.get('http://127.0.0.1:8000/api/tipoviDogadjaja', {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  napraviDogadjaj(eventData){
    return axios.post('http://127.0.0.1:8000/api/dogadjaji', eventData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  googleRedirect(eventData){
    return axios.get('http://127.0.0.1:8000/google/redirect', {
      params: eventData 
    }); 
  }
  napraviTipDogadjaja(newEventType){
   return axios.post(
      "http://127.0.0.1:8000/api/tipoviDogadjaja",
      newEventType,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }
  izbrisiTipDogadjaja(id){
    return axios.delete(`http://127.0.0.1:8000/api/tipoviDogadjaja/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  vratiDogadjaj(idDogadjaja){
    return axios.get(`http://127.0.0.1:8000/api/dogadjaji/${idDogadjaja}`,
      {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
  );
  }
  izmeniDogadjaj(id,event){
   return axios.put(`http://127.0.0.1:8000/api/dogadjaji/${id}`, event, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  vratiKonkretniTipDogadjaja(id){
    return axios.get(
      `http://127.0.0.1:8000/api/dogadjaji/poTipu/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }
  vratiKorisnika(){
    return  axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    })
  }
  vratiJavneDogadjaje(){
    return axios.get(
      "http://127.0.0.1:8000/api/dogadjaji/javni"
    );
  }
  izbrisiDogadjaj(id){
    return axios.delete(
      `http://127.0.0.1:8000/api/dogadjaji/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }
  vratiDogadjaje(){
    return axios.get("http://127.0.0.1:8000/api/dogadjaji", {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  vratiKorisnike(){
    return axios.get("http://127.0.0.1:8000/api/users", {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  izbrisiKorisnika(id){
    return axios.delete(
      `http://127.0.0.1:8000/api/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }
  izmeniKorisnika(id, updatedData){
    return axios.put(`http://127.0.0.1:8000/api/users/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  korisnikoviDogadjaji(){
   return axios.get("http://127.0.0.1:8000/api/korisnikoviDogadjaji", {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
  vratiPrognozu(city){
    return axios.get(`http://127.0.0.1:8000/api/prognoza/${city}`);
  }
  
}

const api = new Api();
export default api;
