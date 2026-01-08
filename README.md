### Preuzimanje projekta
- Otvorite terminal i pozicionirajte se u željeni direktorijum na računaru
- Unesite komandu 'git clone https://github.com/elab-development/internet-tehnologije-projekat-fitneskalendar_2020_0154.git'
kako biste klonirali projekat

### Pokretanje backend-a
1. Otvorite XAMPP i pokrenite Apache i MySQL module
2. Otvorite  projekat u code editoru, otvorite terminal i pozicionirajte se u backend folder
3. U terminal ukucajte **composer install**
4. Zatim ukucajte **cp .env.example .env**
5. Da biste generisali aplikacijski ključ ukucajte **php artisan key:generate**
6. Zatim u .env fajlu konfigurišite **DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD**
7. Da biste kreirali bazu ukucajte u terminal sleće komande
   - **php artisan migrate**
   - **php artisan db:seed**
8. I na kraju Laravel server pokrećete komandom **php artisan serve**
### Pokretanje frontend-a
1. Otvorite novi termin, odvojeno od terminala na kom je pokrenut laravel server
2. Pozicionirajte se u **frontend** folder
3. Instalirajte sve potrebne zavisnosti pomoću komande **npm install**
4. Pokrenite React server komandom **npm start**

Aplikacija omogućava korisnicima da kreiraju, pregledaju i upravljaju događajima na intuitivan i user-friendly način. 

### Funkcionalosti
1. Prijava i registracija
2. Prikaz, kreiranje, izmena i brisanje događaja (privatnih i javnih)
3. Preuzimanje .ics fajla događaja
4. Upravljanje korisnicima (od strane admina)
5. Filtriranje događaja u zavisnosti od tipa događaja
6. Kreiranje i brisanje tipova događaja
7. Slanje notifikacija (podsetnika) korisnicima u vezi događaja na email adresu
8. Prikaz vremenske prognoze za naredna pet dana za uneto mesto
9. Prikaz mape lokacije događaja
10. Mesečni, nedeljni i dnevni prikaz kalendara