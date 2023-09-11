# Gym APP

### Frameworki:

Django + React

Aby uruchomić aplikację należy:

1. Pobrać repozytorium.
2. Uruchomić aplikację <a id="raw-url" href="https://www.docker.com/products/docker-desktop/">Docker Desktop</a>.
3. Będąc poziomie pliku docker-copomse.yaml wywołać:

```
docker-compose up --build
```

4. Po uruchomieniu kontenera wejść na stronę: <a id="raw-url" href="http://localhost:80">localhost:80</a>.

---

### Technologie:

- Django, Django Rest Framework
- React
- Pusher
- AlgoliaSearcg
- Google OAuth
- Swagger
- SQLite
- Docker
- Docker Compose
- JWT Authentication
- Pillow
- Faker
- Gunicorn
- Nginx
- Axios
- Bootstrap

---

## DOCKER IMAGE

## Link do repozytorium w serwisie DockerHub: [Docker Repo](https://hub.docker.com/repository/docker/skwdebski/gym-app/general).

## Funkcjonalności:

### Zarządzanie Użytkownikiem

1. System rejestracji i logowania użytkowika na stronie aplikacji

- Podczas rejestracji link aktywacyjny jest wysyłany na adres email

3. System rejestracji i logowania użytkownika z wykorzystaniem konta Google

- automatyczne tworzenie konta użytkownika przy logowaniu wykorzystującym konto Google
- kontu jest automatycznie nadawany status aktywny oraz następuje przypisanie dostawcy jako 'google'

4. System odzyskiwania zapomnianego hasła do konta

- Mail z możliwościa zmiany hasła jest wysyłany na podany adres email powiązany z kontem
- Możliwość nadania nowego hasła po kliknięciu w link na mailu

5. Możliwość dodawania zdjęcia profilowego, modyfikowania 'opisu' użytkownika
6. Możliwość zmiany hasła po zalogowaniu
7. Widok na aktualne dane powiązane z kontem oraz profilem

---

### Ćwiczenia

1. System tworzenia, modyfikowania oraz usuwania Ćwiczeń (tylko dla konta 'Trenera')
2. System przeglądania Ćwiczeń z wykorzystaniem wyszukiwania za pomocą silnika wyszukiwań AlgoliaSearch
3. Przechodzenie do widoku szczegółowego konretnego Ćwiczenia
4. Możliwość komentowania Ćwiczenia oraz możliwość modyfikowania oraz usuwania własnych komentarzy
5. Możliwość 'polubienia/odpolubienia' Ćwiczenia

---

### Wydatki

1.  Dodawanie, usuwanie, modyfikowanie Wydatków
2.  Wgląd we wszystkie Wydatki z podziałem na wyświetlane strony, możliwość przemieszania się po kolejnych "porcjach" Wydatków - _paginacja_
3.  Wgląd w Wydatki zsumowane według kategorii
    - z możliwością wyszukowania okresu "Wydatki z ostatniego roku/ostatniego dnia"

---

### Chat

1. System przeglądania Trenerów z wykorzystaniem wyszukiwania za pomocą silnika wyszukiwań AlgoliaSearch
2. Możliwość rozpoczęcia Chatu z Trenerem z wykorzystaniem WebSockets za pomocą biblioteki Pusher

---

## Wykorzystane elementy po stronie Serwera (Django Rest Framework)

1. Testowanie Modeli, Widoków za pomocą DjangoTestCase, DRF APITestCase
   - tworzenie modeli, modyfikowanie modeli, usuwanie modeli,
   - testowanie endpointów logowania, rejestracji, wyciągania danych z bazy oraz umieszczania ich w bazie
   - tworzenia Ćwiczeń, Wydatków, Komentarzy, dodawania 'Polubień' za pomocą endpointów
   - testowanie przypadków złych formatów danych,
   - testowanie braku dostępu do danych
2. Third party api services

- swagger (testowanie)
- możliwość wygenerowania ze swaggera pliku z dostępnymi endpointami do zaimportowania ich np. w Postmanie (testowanie)
- algoliasearch engine - silnik zapytań służący do odnajdywania szukanych fraz w zestawach danych

3. Django-signals - do automatycznego tworzenia profilu połączonego z kontem użytkownika podczas rejestracji
4. Wykorzystanie JWT tokens do autentykacji użytkownika

- blacklistowanie wykorzystanych tokenów

5. Tworzenie użytkowników jak i super-użytkowników za pomocą własnego UserManagera

- zapisywanie zdjęć profilowych użytkowników na serwerze

6. Użycie własnych Rerendererów służących do ujednolicenia formatu zwracanych danych jako "poprawne i niepoprawne"
7. Użycie własnych Exception Handlerów dla np. błędów braku autentykacji
8. Stworznie własnych handlerów widoków dla:

- handler404
- handler500

9. Stworznie własnych rodzajów wymaganych Uprawnień (do sprawdzania, czy użytkownik jest Trenerem, Czy Właściciel lub czy wartość tylko do odczytu)
10. Dodanie własnego sposobu przeglądania modeli Użytkowników oraz połączonych z nimi Profili w panelu Admina
11. Używanie generycznych widoków jak i ModelViewSetów
12. Użycie wątków do przyspieszenia wysyłania maili aktywacyjnych oraz zmiany zapomnianego hasła

---
