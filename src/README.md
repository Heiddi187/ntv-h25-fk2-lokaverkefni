https://github.com/Heiddi187/ntv-h25-fk2-lokaverkefni/tree/main/src

Kaflar
-Notes
-Testing
-Postman
-Niðurlag

Notes...
Ég skildi eftir mikið að gömlum kóða sem ég notaði í ferlinu (er bara neðst og kommentaður út. Myndi henda ef þetta væri ekki skólaverkefni)
Var ekki með prettier eða neitt svoleiðis svo það gæti vantað kommur hér og þar :D
Notaði hashing.ts til að búa til password á þá sem eru í gagnagrunni

SQL
tables.sql
seed-data.sql
-----------------------------------------------------------------------------------------------------------------------------------
Testing

npm run test events.test.ts
✓ src/testing/events.test.ts (22 tests) 227ms
   ✓ Route validation (4)
     ✓ GET /api/events exists 20ms
     ✓ GET invalid route returns 404 5ms
     ✓ POST /api/events exists 11ms
     ✓ POST invalid route returns 404 3ms
   ✓ GET /api/events (15)
     ✓ should return a 200 status 5ms
     ✓ should return a count 4ms
     ✓ should return an array of events 4ms
     ✓ should have a length of 15+ (seed data has 20+) 5ms
     ✓ should return empty list if no events match filters 6ms
     ✓ should reject invalid sorting value 4ms
     ✓ should reject if page is less then 1 5ms
     ✓ should pagenate results 4ms
     ✓ should return different results for different pages 8ms
     ✓ should filter events with date_from 5ms
     ✓ should filter events with date_to 4ms
     ✓ should reject invalid date format 3ms
     ✓ should work with multiple filters 4ms
     ✓ should return total count > page limit 4ms
     ✓ should return empty list when no event matches filters 4ms
   ✓ GET /api/events/:id (3)
     ✓ should return a event by id 3ms
     ✓ should return 404 for missing id 6ms
     ✓ should return 400 for bad id 3ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  18:49:28
   Duration  838ms (transform 190ms, setup 0ms, import 477ms, tests 227ms, environment 0ms)

----------------------------------------------------------------------------------------------------------
npm run test venues.test.ts
✓ src/testing/venues.test.ts (12 tests) 273ms
   ✓ GET /api/venues (4)
     ✓ should exist and return 200 status 16ms
     ✓ should return 404 if route is invalid 5ms
     ✓ should return an array of venues 4ms
     ✓ should return 5 venues 4ms
   ✓ GET /api/venues/:id (3)
     ✓ should return a single venue 6ms
     ✓ should return 404 for missing id 4ms
     ✓ should return 400 for bad id 5ms
   ✓ GET /api/venues/:id/events (5)
     ✓ should should return 200 status if route is valid 6ms
     ✓ should return 404 if route is invalid 4ms
     ✓ should return 400 status if venue id is not valid 5ms
     ✓ should return events for correct venue id 5ms
     ✓ should return an array of events 4ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  18:07:41
   Duration  889ms (transform 197ms, setup 0ms, import 480ms, tests 273ms, environment 0ms)

--------------------------------------------------------------------------------------------------------------------
npm run test users.test.ts
 ✓ src/testing/users.test.ts (16 tests) 4055ms
   ✓ POST /api/users/signup (6)
     ✓ should signup a user  335ms
     ✓ should prevent duplicate emails 263ms
     ✓ should return 404 if route is wrong 41ms
     ✓ should return 400 if signup data is wrong type 41ms
     ✓ should reject if signup data is missing 35ms
     ✓ should reject if email format is wrong 37ms
   ✓ POST /api/users/login (3)
     ✓ should login using newly created user  467ms
     ✓ should login a user from database 289ms
     ✓ should return 401 if password is wrong 252ms
   ✓ PATCH /api/users/user (5)
     ✓ should update user 277ms
     ✓ should only allow new password to login after change  900ms
     ✓ should reject if no authorization 255ms
     ✓ should reject if token is expired 40ms
     ✓ should reject if updated data is of wrong type 264ms
   ✓ DELETE /api/users/user (2)
     ✓ should delete account  309ms
     ✓ should reject if not authorized 247ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  18:07:23
   Duration  4.66s (transform 203ms, setup 0ms, import 477ms, tests 4.05s, environment 0ms)

-------------------------------------------------------------------------------------------------------------------------
npm run test tickets.test.ts
 ✓ src/testing/tickets.test.ts (19 tests) 3787ms
   ✓ GET /api/tickets/user (4)
     ✓ should exist and return 200 status  472ms
     ✓ should return an empty list 224ms
     ✓ should send 403 status and reject if token is wrong 224ms
     ✓ should send 401 status if token is missing 3ms
   ✓ POST /api/tickets/buy (7)
     ✓ should exist and return 200 status 235ms
     ✓ should send 403 status and reject if token is wrong 3ms
     ✓ should send 401 status if there is no token 3ms
     ✓ should reject if trying to buy negative amount of tickets 219ms
     ✓ should buy correct amount of tickets to the right event 226ms
     ✓ should reject unauthorized user 215ms
     ✓ should throw 404 if path is wrong 219ms
   ✓ PATCH /api/tickets/:id/return (8)
     ✓ should return and mark ticket as refunded 240ms
     ✓ should send 401 status if there is no token 4ms
     ✓ should send 403 status and reject if token is wrong 2ms
     ✓ should return tickets to event after refund 239ms
     ✓ should return tickets to event if user is deleted 266ms
     ✓ should throw 400 if you try to return ticket again  454ms
     ✓ should reject if less then 24h to event 234ms
     ✓ should reject if event has passed 219ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  18:07:06
   Duration  4.39s (transform 204ms, setup 0ms, import 470ms, tests 3.79s, environment 0ms)

----------------------------------------------------------------------------------------------------------------
POSTMAN
npm run dev

í postman er hægt að nota:
GET http://localhost:3000/api/events // til að fá öll event
GET http://localhost:3000/api/events/14 // til að fá event nr.14
GET http://localhost:3000/api/events?category=sport // til að sjá hvað er framundan í sportinu
GET http://localhost:3000/api/events?category=concert&venue=harpa // til að fá alla tónleika í Hörpu
Hægt að nota (category, event_date, date_from, date_to, city, venue) til að sía upplýsingar
Hægt að nota (price, date, tickets) til að raða eftir ASC og DESC

----------------------------------------------------------------------------------------------------------------
GET http://localhost:3000/api/venues // til að sjá alla venues
GET http://localhost:3000/api/venues/4 // til að sjá venue nr.4
GET http://localhost:3000/api/venues/4/events // til að sjá alla viðburði á venue nr.4

----------------------------------------------------------------------------------------------------------------
POST http://localhost:3000/api/users/signup // til að skrá sig inn
{
    "name": "Nafn",
    "email": "email@test.is",
    "password": "password123"
}
POST http://localhost:3000/api/users/login // til að logga sig inn og fá token
{
    "email": "email@test.is",
    "password": "password123"
}
PATCH http://localhost:3000/api/users/user // til að breyta notanda (email og/eða nafn og/eða password) (muna eftir token)
DELETE http://localhost:3000/api/users/user // til að eyða notanda

---------------------------------------------------------------------------------------------------------------------

GET http://localhost:3000/api/tickets/user // til að sjá hvaða miða notandi á
POST http://localhost:3000/api/tickets/buy // til að kaupa miða á viðburð
{
   "event_id": 1,
   "quantity": 2
}
PATCH http://localhost:3000/api/tickets/8/return // til að skila miðum nr.8

---------------------------------------------------------------------------------------------------------------------
Niðurlag

Ég á að vera búinn að gera allt sem var á verkefnalýsingunni NEMA í UC6 er:
3. 	Notandi gefur upp greiðsluupplýsingar
4a. Greiðsla mistókst: Kerfið skilar villu, engin bókun búin til

Ég er ekki með neitt veski eða svoleiðis tek bara saman hvað notandi er búinn að eyða í miða samtals.

Svo í "Hvað á að prófa" er "Prófa að sækja gögn annarra notenda (ætti að skila 403)"
En held það sé ekki hægt hjá mér þar sem það er ekkert userId í slóðinni. Er bara token-ið eftir að þú skráir þig inn 
svo það er ekkert hægt að reyna þetta held ég ef ég skil þetta rétt..

Annars er ég þokkalega sáttur við þetta.