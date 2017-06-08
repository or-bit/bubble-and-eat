#Order Gateway

##Installazione
Sul branch `master` lanciare il comando `npm install` per installare tutte le dipendenze.
* `express` per la gestione del server
 * `socket.io` per la connessione tcp tra le bolle e il gateway
 * `redux` per lo stato 
 
 Una volta installate le dipendente
  * per lanciare il server basta scrivere sul terminale `node index.js`
 * per il cuoco `node chefActions.js`
  * per il client `node client.js`
  
  ##FUNZIONAMENTO
  ###index.js
  All' avvio viene caricato lo stato dell' applicazione se disponibile altrimenti viene inizializzato con valori di default.
  In caso positivo l' elenco di ordinazioni caricate e' limitato a quelle attive, quelle complete sono infatti in un altra collection
  `orders` al fine di non appesantire la comunicazione.
  Il server, si mette in ascolto sulla porta 3333 (modificabile a piacimento nel file config.json) per connessioni tcp, le accetta automaticamente smistandole su
  flussi di controlli paralleli. All' arrivo di una nuova connessione il server risponde solo all' evento `auth` in cui
  chi si connette a lui specifica chi e' (e in futuro potremmo mettere anche un po di sicurezza).
  ```
  il cuoco si autentica mandando nell' evento auth alla connessione
  { type: 'chef' }
  il cliente 
  { type: 'client'}
  ```
  Una volta identificato il tipo di chi si e' connesso la connessione e' gestita da apposite funzioni (che andranno poi su
  flie diversi)
  `chefHandler(socket)` e `clientHandler(socket)`
  Queste conservano al loro interno il riferimento al socket aperto in maniera tale da poter interagire con la loro controparte
  bolla connessa a loro.
  `socket` all' interno di client rappresenta il socket di quella connessione (con connessioni multiple vengono istanziate piu istanze della 
  stessa funzione, ciascuna col proprio riferimento al proprio client, la gestione e' parallela).
  
  Ad ogni cambiamento dello stato viene aggiornato il corrispondente stato nel database collegato (se collegato) 
  
  ###AVVIO DEL SERVER E INTERAZIONE CON IL DATABASE
  Avviare mongodb e controllare che l' indirizzo del database sia sotto la voce `mongoUrl` di config.json 
  (per lanciare mongo per development con docker si puo semplicemente scrivere su una shell `docker run -it --rm -p 27017:27017 mongo`)
  
  all' avvio dell' applicazione viene fatto un tentativo di connettersi  al database presente all' inidirizzo `mongoUrl`
  presente nel file di configurazione `config.json` che avra' un contenuto simile a 
  `{"mongoUrl" : "mongodb://localhost:27017/test"}`
  se la conenssione non va a buon fine lo store viene inizializzato con i valori di default e l' applicazione lavora lo stesso  ma 
  tenendo i dati in cache.
  Se la connessione va a buon fine invece si presentano 2 possibili scenari:
  * lo stato risalente all' ultimo avvio dell' applicazione e' presente: in questo caso lo store viene inizializzato da quello stato,
  fatta eccezione per gli ordini gia marcati come completati che restano nella collection `orders` per non appesantire la comunicazione.
  Inizializzato lo stato viene inserito un subscriber allo store con il compito di riflettere le modifiche allo stato dell' applicazione sul database.
  (in maniera tale che se cade il server e viene rimesso su possano essere riprese le attivita' come se nulla fosse).
  
  * lo stato non e' trovato (primo avvio del db), viene creato lo store dai valori di default e aggiunto il subscriber per 
  salvare, appena presnti, le modifiche sul database
  
  Interazioni dell' applicazione con il database durante l' utilizzo: 
  * al completamento di un ordinazione essa viene salvata nella collection `orders` ma verra' comunque tenuta una copia in cache fino alla
  chiusura dell' app per velocizzare il recupero in caso di report giornalieri
  
  * al cambiamento dello stato esso viene salvato nel database.
                                                                                    
  
  ##GESTORI DELLE CONNESSIONI ENTRANTI
  ####/handlers/chefHandler.js
  
  Alla connessione del cuoco la sua corrsipondente bolla inviera' un evanto `ready` marcando di essere in ascolto di oridni se ci sono ordini nello stato del server marcato com `active` questi vengono notificati al cuoco
 . Appena connesso si aggiorna lo stato dell' applicazione indicando che il cuoco e' connesso.
 Fatto questo l' handler si mette in ascolto di eventi.
 * in caso di disconnessione questo viene rilevato e lo stato dell' app cambia rilevandolo.
 * in caso di aggiornamento dello stato degli ordini se ce ne sono di attivi questi vengono mandati alla controparte bolla cuoco 
 connessa dall' altra parte del socket
 * in caso che la bolla cuoco notifichi il completamento di un piatto questo evento viene rimpallato al corrispettivo client
 in attesa del completamento del proprio piatto tramite un emettitore di eventi di node `orders`.
 
 ####/handlers/clientHandler.js
 
 Come col cuoco viene rilevata la connessione del client, e l' handler si mette in attesa di eventi 
 * richiesta del menu: `menuRequest` viene mandato alla controparte un evento `menu` recante con se il json del menu;
 * ordinazione: `order` viene richiesto al server un id univoco da associare a quell' ordine, una volta ricevuto viene
 modificato lo stato dell' applicazione con l' apposito reducer e l' ordine viene marcato come attivo. 
 Il client viene notificato tramite l' evento `orderId` dell' id della sua ordinazione per fargli sapere che e' stata presa in carico
 e permettergli di tracciarla in caso di disconnessione.
 In risposta a questo l' elenco degli ordini attivi viene inviato al cuoco. Il cliente si mette poi in attesa dell'
 evento del handler del cuoco che gli notifichi che il suo piatto e' pronto, a quel punto viene modificato lo stato dell' ordine in completato 
 e notificato alla bolla del client che e' pronto. (questo funziona in parallelo per piu client).
 Se la connessione del client cade con un ordinazione pendente:
 In caso di riconnessione del client questo emettera' un evento `orderStatus` con in allegato l' id dell' ordinazione pendente in modo da ripristinare
 il flusso di controllo: a quel punto se l' ordinazione
 e' stata preparata nel frattempo viene notificato al client, altrimenti se e' ancora attiva viene attivato un observer su quell' ordinazione.
 
 ####/handlers/adminHandler.js
 rilevata la connessione si mette in ascolto di queste richieste da parte dellla bolla admin, gli eventi a cui risponde sono questi:
 * `'menu'` manda allla bolla tramite evento `'menu'` il menu corrente
 * `'addDish'` inserisce il piatto nel menu assegnandogli un id univoco, ritorna con `'addedDish'` l' oggetto appena inserito
 coome oggetto da allegare all' evento mettere oggetti del tipo ` {name: 'pasta al ragu', price: 8, description:'pasta al ragu'}`
 * `'removeDish'` preso un intero come parametro elimina l' elemento del menu con corrispondente id esempio `socket.emit('removeDish', 1);`
 viene ritornato alla bolla l' id dell' oggetto cancellato tramite l' evento `removeDish`
 * `'editDish'` preso come payload un id e l' oggetto da sostituire modifica l' oggetto e ritorna tramite `'editDish'` l' oggetto modificato o un oggetto 
 vuoto se non presente esempio `socket.emit('editDish', {id : 0, dish : {name: 'pasta al pomodoro', price: 4, description:'elemento cambiato'}`
 * `'allOrders'` ritorna tramite l' evento `'allOrders'` alla bolla l' elenco di tutti gli ordini
 * `'activeOrders'` tramite `'activeOrders'` ritorna tutti gli ordini attivi
 * `'completedOrders'` tramite `'completedOrders'` ritorna gli ordini che sono stati completati
 * `'deleteOrder'` preso come parametro l' id dell' ordine da cancellare lo elimina e ritorna l' id in caso di successo con l' evento `'deleteOrder'`
 
 ##STATI DI REDUX
 ###Stato iniziale : 
 ```json
 {
    chef :{
        present: false
    },
    order:{
        nextID : 0,
        orders:[]
    },
    menu:{
        dishes: [],
        date : new Date(),
        nextID : 0
    }
 }

```
###Reducers
#### `chefReducer`
Gestisce lo stato del cuoco tramite i seguenti eventi:
* `'CHEF_PRESENT'` aggiorna `state.chef.present` a `true`, viene attivato quando si connette il cuoco
* `'CHEF_ABSENT'` aggiorna `state.chef.present` a `false`, viene attivato quando si disconnette il cuoco

#### `orderReducer`
* `'PROCESS_ORDER'` aggiorna il campo `state.order.orders` inserendo l' elemento passato come `payload` 
assegnandogli un id univoco nel campo `id` e marcandolo come attivo in modo da poter essere segnalato al cuoco
```json
payload : {dishes :[]}
```
* `'ORDER_COMPLETED'` aggiorna il campo `state.order.orders` marcando l' elemento avente id uguale a `payload` come completato in modo da
non essere piu considerato attivo e non essere spedito al cuoco

* `'DELETE_ORDER'` passato come payload l' id dell' ordine da eliminare questo viene cancellato

#### `menuReducers`
* `'ADD_ELEMENT'` aggiorna il campo `state.menu.nextID` con un id univoco e `state.menu.dishes` aggiungendo l' oggetto passato come `payload`
l' oggetto in questione sara' strutturato in questo modo, essendo che l' id e' assegnato automaticamente in modo univoco.
```json
payload: {name: string, price: double, descriiption: string}
```
 * `'REMOVE_ELEMENT'` aggiorna il campo `state.menu.dishes` rimuovendo la voce del menu corrispondente all' id passato come `payload`
 
 * `'MODIFY_ELEMENT'` aggiorna il campo `state.menu.dishes` modificando la voce del menu corrispondente all' id passato come `payload.id`
 e settandolo a `payload.dish`
 ```json
payload : {id: 0, dish:{name:'pasta', price:5.5, description:'pasta'}}
```
 
 ## FILE ESTERNI DI APPOGGIO
  ###client.js
  Mock della bolla client.
  Ogni volta che viene lanciato il client viene in automatico fatto il login al server specificando di trattarsi 
  del client. Una volta autenticati viene fatta una richieta di visualizzazione del menu che viene mandato come oggetto js
  (e dovrebbe vedersi sul client).
  Dopo aver visualizzato il menu il client fa un ordinazione,
   riceve l' id  della stessa e si mette in attesa del suo completamento.
  
  ### chefActions.js
  Mock della bolla cuoco. Visualizza le ordinazioni attive e da la possibilita' di marcarle completate inserendo 
  con la tastiera il numero corrispondente all' id dell' ordinazione
  
  ### admin.js
  Mock della bolla admin, si autentica poi inserisce 2 piatti nel menu, ne modifica uno e poi ne cancella un altro.
  Fatto questo accede alla lista delle ordinazioni e prova a cancellare quella con id 0 se va a buon fine (era presente) viene ritornato 0 se no oggetto vuoto.