
## Panoramica

Questo prototipo è un ambiente 3D interattivo che simula un ufficio di investigazione forense, progettato per insegnare concetti di digital forensics attraverso meccaniche di gamification. L'applicazione permette agli utenti di muoversi in prima persona all'interno di un ufficio virtuale, interagire con oggetti significativi e completare una serie di task investigativi attraverso una console Linux simulata.

## URL di Accesso

Il prototipo è accessibile online al seguente URL:
[https://edoardomaniero.github.io/office3D-forensic-demo/](https://edoardomaniero.github.io/office3D-forensic-demo/)

## Requisiti di Sistema

- **Browser**: Chrome, Firefox, Edge o Safari aggiornati all'ultima versione
- **Hardware**: Scheda grafica con supporto WebGL
- **Connessione Internet**: Necessaria per caricare le risorse 3D
- **Input**: Tastiera e mouse

## Controlli

- **Movimento**: Tasti WASD
- **Visuale**: Movimento del mouse
- **Interazione**: Tasto E quando si è vicini a un oggetto interattivo
- **Apertura console**: Tasto c
- **Chiusura console**: Tasto ESC o pulsante X nell'interfaccia

## Funzionalità Principali

### 1. Ambiente 3D Navigabile

L'ambiente 3D rappresenta un ufficio forense con:
- Scrivania con computer
- Sedia ergonomica
- Libreria con documenti forensi
- Armadietto per prove
- Finestra con illuminazione naturale

### 2. Console Linux Simulata

La console offre un'esperienza realistica con:
- Supporto per comandi base di Linux (ls, cd, cat, help, task, clear)
- Cronologia comandi navigabile con frecce Su/Giù
- Autocompletamento con Tab
- Copia/incolla (seleziona testo per copiare, Ctrl+V per incollare)
- File system simulato con struttura gerarchica

### 3. Sistema di Task Progressivi

Il prototipo include una sequenza di 6 task investigativi:
1. Identificazione dell'IP dell'attaccante in un file di log
2. Analisi di uno script di esfiltrazione dati
3. Esame del traffico di rete per identificare la porta utilizzata
4. Ricerca di servizi sospetti nel sistema
5. Identificazione del server Command & Control
6. Completamento dell'indagine e preparazione del report

### 4. Elementi di Gamification

- **Progressione a livelli**: Task sequenziali di difficoltà crescente
- **Feedback immediato**: Conferma visiva e testuale del completamento
- **Narrazione coinvolgente**: Storia investigativa coerente
- **Esplorazione**: Ambiente 3D navigabile che stimola la scoperta
- **Obiettivi chiari**: Istruzioni precise visualizzate nell'interfaccia

## Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, JavaScript
- **Grafica 3D**: Babylon.js
- **Console Simulata**: xterm.js con addon personalizzati
- **Deployment**: GitHub Pages

## Struttura del Codice

```
office3D_demo/
├── index.html          # Punto di ingresso dell'applicazione
├── style.css           # Stili dell'interfaccia utente
├── js/
│   ├── scene.js        # Definizione dell'ambiente 3D
│   ├── console.js      # Implementazione della console simulata
│   ├── interaction.js  # Gestione delle interazioni utente
│   └── main.js         # Inizializzazione e coordinamento
└── models/
    └── library.glb     # Modello 3D della libreria
```

## Limitazioni Attuali

- Ambiente 3D limitato a una singola stanza
- Set di comandi della console ridotto rispetto a un sistema Linux reale
- Nessun sistema di punteggio o classifica
- Nessuna integrazione con sistemi LMS esterni

## Sviluppi Futuri

- Aggiunta di più ambienti e scenari investigativi
- Implementazione di un sistema di punteggio e badge
- Integrazione con piattaforme didattiche tramite xAPI o SCORM
- Modalità multiplayer per investigazioni collaborative
- Espansione del set di comandi della console
- Aggiunta di strumenti forensi più avanzati

## Contatti e Supporto

Per domande, feedback o segnalazioni di problemi, contattare:
- Email: [edoardomaniero@gmail.com](mailto:edoardomaniero@gmail.com)
- GitHub: [github.com/EdoardoManiero](https://github.com/EdoardoManiero)
