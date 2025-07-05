function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);

    const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 1.6, 0.5), scene);
    camera.setTarget(new BABYLON.Vector3(0, 1.6, 2)); 
    camera.attachControl(canvas, true);
    camera.ellipsoid = new BABYLON.Vector3(0.4, 0.8, 0.4); 
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.12; 
    camera.angularSensibility = 6000;
    camera.keysUp.push(87);    // W
    camera.keysDown.push(83);  // S
    camera.keysLeft.push(65);  // A
    camera.keysRight.push(68); // D
    camera.minZ = 0.1;
    camera.maxZ = 1000;

    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.5; 
    hemiLight.diffuse = new BABYLON.Color3(0.8, 0.8, 1);
    hemiLight.specular = new BABYLON.Color3(0.5, 0.5, 0.7);
    hemiLight.groundColor = new BABYLON.Color3(0.3, 0.3, 0.4);

    const deskLampLight = new BABYLON.PointLight("deskLampLight", new BABYLON.Vector3(0, 2.2, 1.8), scene);
    deskLampLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7); 
    deskLampLight.specular = new BABYLON.Color3(1, 0.9, 0.7);
    deskLampLight.intensity = 0.8;
    deskLampLight.range = 5;

    const roomWidth = 5; 
    const roomDepth = 5;
    const roomHeight = 3;
    const wallThickness = 0.15;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 500, height: 500}, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.45, 0.4); 
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    const wallMaterial = new BABYLON.StandardMaterial("wallMat", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.7);

    const wallN = BABYLON.MeshBuilder.CreateBox("wallN", {width: roomWidth, height: roomHeight, depth: wallThickness}, scene);
    wallN.position = new BABYLON.Vector3(0, roomHeight / 2, roomDepth / 2 - wallThickness / 2);
    wallN.material = wallMaterial; wallN.checkCollisions = true; 

    const wallS = BABYLON.MeshBuilder.CreateBox("wallS", {width: roomWidth, height: roomHeight, depth: wallThickness}, scene);
    wallS.position = new BABYLON.Vector3(0, roomHeight / 2, -roomDepth / 2 + wallThickness / 2);
    wallS.material = wallMaterial; wallS.checkCollisions = true; 

    const wallE = BABYLON.MeshBuilder.CreateBox("wallE", {width: wallThickness, height: roomHeight, depth: roomDepth - (wallThickness*2)}, scene);
    wallE.position = new BABYLON.Vector3(roomWidth / 2 - wallThickness / 2, roomHeight / 2, 0);
    wallE.material = wallMaterial; wallE.checkCollisions = true; 

    const wallW = BABYLON.MeshBuilder.CreateBox("wallW", {width: wallThickness, height: roomHeight, depth: roomDepth - (wallThickness*2)}, scene);
    wallW.position = new BABYLON.Vector3(-roomWidth / 2 + wallThickness / 2, roomHeight / 2, 0);
    wallW.material = wallMaterial; wallW.checkCollisions = true; 
    
    const ceiling = BABYLON.MeshBuilder.CreateBox("ceiling", {width: roomWidth, height: wallThickness, depth: roomDepth}, scene);
    ceiling.position = new BABYLON.Vector3(0, roomHeight - wallThickness / 2, 0);
    ceiling.material = wallMaterial; ceiling.checkCollisions = true;

    // Definizione della scrivania - posizione assoluta
    const deskHeight = 0.75;
    const deskWidth = 1.4;
    const deskDepth = 0.65;
    const deskMaterial = new BABYLON.StandardMaterial("deskMat", scene);
    deskMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.15);

    // Posizione assoluta della scrivania
    const deskX = 0;
    const deskY = deskHeight;
    const deskZ = 1.5;

    const deskSurface = BABYLON.MeshBuilder.CreateBox("deskSurface", {width: deskWidth, height: 0.05, depth: deskDepth}, scene);
    deskSurface.position = new BABYLON.Vector3(deskX, deskY, deskZ); 
    deskSurface.material = deskMaterial; 
    deskSurface.checkCollisions = true;

    const legHeight = deskHeight - 0.05;
    const legSize = 0.05;
    const legPositions = [
        new BABYLON.Vector3(deskX - deskWidth/2 + legSize, legHeight/2, deskZ - deskDepth/2 + legSize),
        new BABYLON.Vector3(deskX + deskWidth/2 - legSize, legHeight/2, deskZ - deskDepth/2 + legSize),
        new BABYLON.Vector3(deskX - deskWidth/2 + legSize, legHeight/2, deskZ + deskDepth/2 - legSize),
        new BABYLON.Vector3(deskX + deskWidth/2 - legSize, legHeight/2, deskZ + deskDepth/2 - legSize)
    ];
    legPositions.forEach((pos, i) => {
        const leg = BABYLON.MeshBuilder.CreateBox(`leg${i}`, {width: legSize, height: legHeight, depth: legSize}, scene);
        leg.position = pos;
        leg.material = deskMaterial; 
        leg.checkCollisions = true;
    });

    // --- Laptop (posizione assoluta e allineamento corretto) ---
    const laptopBaseWidth = 0.35;
    const laptopBaseDepth = 0.25;
    const laptopBaseHeight = 0.02;
    const laptopScreenHeight = 0.22;
    const laptopScreenThickness = 0.01;

    // Posizione assoluta del laptop sulla scrivania
    const laptopX = deskX;
    const laptopY = deskY + 0.05 + laptopBaseHeight/2; // Sopra la scrivania
    const laptopZ = deskZ - deskDepth/4; // Un po' avanti sulla scrivania

    // Base del laptop
    const laptopBase = BABYLON.MeshBuilder.CreateBox("laptopBase", {width: laptopBaseWidth, depth: laptopBaseDepth, height: laptopBaseHeight}, scene);
    laptopBase.position = new BABYLON.Vector3(laptopX, laptopY, laptopZ);
    laptopBase.rotation = new BABYLON.Vector3(0, 0, 0); // Perfettamente allineato con la scrivania
    const laptopMaterial = new BABYLON.StandardMaterial("laptopMat", scene);
    laptopMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35); // Grigio scuro metallico
    laptopBase.material = laptopMaterial;
    laptopBase.checkCollisions = true;

    // Schermo del laptop - ora parte correttamente dal bordo posteriore della base
    const screenAngle = Math.PI / 9; // Circa 20 gradi
    
    // Calcolo preciso della posizione dello schermo
    // Lo schermo deve partire esattamente dal bordo posteriore della base
    const screenPosX = laptopX; // Centrato orizzontalmente con la base
    const screenPosY = laptopY + laptopBaseHeight/2 + (laptopScreenHeight/2) * Math.cos(screenAngle); // Parte dal bordo superiore della base
    const screenPosZ = laptopZ + laptopBaseDepth/2 - (laptopScreenHeight/2) * Math.sin(screenAngle); // Parte dal bordo posteriore della base
    
    const laptopScreen = BABYLON.MeshBuilder.CreateBox("laptopScreen", {width: laptopBaseWidth, height: laptopScreenHeight, depth: laptopScreenThickness}, scene);
    laptopScreen.position = new BABYLON.Vector3(screenPosX, screenPosY, screenPosZ);
    laptopScreen.rotation = new BABYLON.Vector3(-screenAngle, 0, 0); // Inclinazione di circa 20 gradi, perfettamente allineato sull'asse Y
    laptopScreen.material = laptopMaterial;
    laptopScreen.checkCollisions = true;
    
    // Superficie dello schermo (per l'interazione)
    const screenMaterial = new BABYLON.StandardMaterial("screenMat", scene);
    screenMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    screenMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.15); 
    
    const laptopDisplaySurface = BABYLON.MeshBuilder.CreatePlane("laptopDisplaySurface", {width: laptopBaseWidth * 0.9, height: laptopScreenHeight * 0.85}, scene);
    laptopDisplaySurface.parent = laptopScreen;
    laptopDisplaySurface.position.z = -laptopScreenThickness/2 - 0.001; // Leggermente davanti alla mesh dello schermo
    laptopDisplaySurface.material = screenMaterial;
    laptopDisplaySurface.isPickable = true;
    laptopDisplaySurface.name = "PC_Monitor"; // Manteniamo lo stesso nome per l'interazione
    laptopDisplaySurface.checkCollisions = true;

    // --- Smartphone sulla scrivania (posizione assoluta) ---
    const smartphoneWidth = 0.07;
    const smartphoneHeight = 0.01;
    const smartphoneDepth = 0.14;
    
    // Posizione assoluta dello smartphone sulla scrivania
    const smartphoneX = laptopX + laptopBaseWidth/2 + smartphoneWidth/2 + 0.05;
    const smartphoneY = deskY + 0.05 + smartphoneHeight/2; // Sopra la scrivania
    const smartphoneZ = laptopZ + 0.05;
    
    const smartphone = BABYLON.MeshBuilder.CreateBox("smartphone", {width: smartphoneWidth, height: smartphoneHeight, depth: smartphoneDepth}, scene);
    smartphone.position = new BABYLON.Vector3(smartphoneX, smartphoneY, smartphoneZ);
    smartphone.rotation = new BABYLON.Vector3(0, 0, 0); // Perfettamente allineato con la scrivania
    
    const smartphoneMaterial = new BABYLON.StandardMaterial("smartphoneMat", scene);
    smartphoneMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    smartphone.material = smartphoneMaterial;
    smartphone.checkCollisions = true;

    // --- Documenti sparsi sulla scrivania (posizione assoluta) ---
    const paperThickness = 0.002;
    const paperWidth = 0.21;
    const paperDepth = 0.297; // Formato A4 approssimativo
    const paperMaterial = new BABYLON.StandardMaterial("paperMat", scene);
    paperMaterial.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.9);

    // Posizioni assolute dei documenti sulla scrivania
    const doc1 = BABYLON.MeshBuilder.CreateBox("doc1", {width: paperWidth, height: paperThickness, depth: paperDepth}, scene);
    doc1.position = new BABYLON.Vector3(
        laptopX - laptopBaseWidth/2 - paperWidth/2 - 0.03, 
        deskY + 0.05 + paperThickness/2, // Sopra la scrivania
        laptopZ + 0.02
    );
    doc1.rotation.y = Math.PI / 12;
    doc1.material = paperMaterial;
    doc1.checkCollisions = true;

    const doc2 = BABYLON.MeshBuilder.CreateBox("doc2", {width: paperWidth, height: paperThickness, depth: paperDepth}, scene);
    doc2.position = new BABYLON.Vector3(
        doc1.position.x + 0.01, 
        doc1.position.y + paperThickness, // Sopra il primo documento
        doc1.position.z - 0.015
    );
    doc2.rotation.y = -Math.PI / 15;
    doc2.material = paperMaterial;
    doc2.checkCollisions = true;
    
    const doc3 = BABYLON.MeshBuilder.CreateBox("doc3", {width: paperWidth, height: paperThickness, depth: paperDepth}, scene);
    doc3.position = new BABYLON.Vector3(
        deskX + deskWidth * 0.3, 
        deskY + 0.05 + paperThickness/2, // Sopra la scrivania
        deskZ + deskDepth * 0.2
    );
    doc3.rotation.y = Math.PI / 8;
    doc3.material = paperMaterial;
    doc3.checkCollisions = true;

    // --- Sedia (posizione assoluta e allineamento corretto) ---
    // Posizione assoluta della sedia
    const chairX = deskX;
    const chairY = 0;
    const chairZ = deskZ - deskDepth - 0.3; // Dietro la scrivania

    const chairSeat = BABYLON.MeshBuilder.CreateBox("chairSeat", {width: 0.4, height: 0.1, depth: 0.4}, scene);
    chairSeat.position = new BABYLON.Vector3(chairX, chairY + 0.45, chairZ);
    chairSeat.rotation = new BABYLON.Vector3(0, 0, 0); // Perfettamente allineato con la scrivania
    const chairMaterial = new BABYLON.StandardMaterial("chairMat", scene);
    chairMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.3);
    chairSeat.material = chairMaterial; 
    chairSeat.checkCollisions = true;

    const chairBack = BABYLON.MeshBuilder.CreateBox("chairBack", {width: 0.4, height: 0.5, depth: 0.05}, scene);
    chairBack.position = new BABYLON.Vector3(chairX, chairY + 0.45 + 0.05 + 0.25, chairZ + 0.2 - 0.025);
    chairBack.rotation = new BABYLON.Vector3(0, 0, 0); // Perfettamente allineato con la scrivania
    chairBack.material = chairMaterial; 
    chairBack.checkCollisions = true;

    const chairPole = BABYLON.MeshBuilder.CreateCylinder("chairPole", {diameter: 0.05, height: 0.35}, scene);
    chairPole.position = new BABYLON.Vector3(chairX, chairY + 0.45 - 0.05 - 0.175, chairZ);
    chairPole.rotation = new BABYLON.Vector3(0, 0, 0); // Perfettamente allineato con la scrivania
    const standMaterial = new BABYLON.StandardMaterial("standMat", scene);
    standMaterial.diffuseColor = new BABYLON.Color3(0.2,0.2,0.2);
    chairPole.material = standMaterial; 
    chairPole.checkCollisions = true;

   /*  const cabinetWidth = 0.5;
    const cabinetHeight = 1.0;
    const cabinetDepth = 0.4;
    const cabinet = BABYLON.MeshBuilder.CreateBox("filingCabinet", {width: cabinetWidth, height: cabinetHeight, depth: cabinetDepth}, scene);
    cabinet.position = new BABYLON.Vector3(-roomWidth/2 + cabinetWidth/2 + 0.3, cabinetHeight/2, 0.5);
    const cabinetMaterial = new BABYLON.StandardMaterial("cabinetMat", scene);
    cabinetMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.55);
    cabinet.material = cabinetMaterial; cabinet.checkCollisions = true; */

    const windowPane = BABYLON.MeshBuilder.CreatePlane("windowPane", {width: 1.2, height: 0.8}, scene);
    windowPane.position = new BABYLON.Vector3(0, 1.5, wallS.position.z + wallThickness/2 + 0.01); 
    const windowMaterial = new BABYLON.StandardMaterial("windowMat", scene);
    windowMaterial.emissiveColor = new BABYLON.Color3(0.7, 0.8, 1); 
    windowMaterial.disableLighting = true; 
    windowPane.material = windowMaterial;

    scene.gravity = new BABYLON.Vector3(0, -0.98, 0); 
    scene.collisionsEnabled = true;
    


    // Prova diverse coordinate per posizionare il modello in un punto visibile
    const libraryPosition = new BABYLON.Vector3(
        roomWidth/2 - wallThickness/2 -0.3,            // Prova valori tra -2 e 2 per l'asse X
        0,     // Mantieni sopra la scrivania
        0     // Prova valori tra -1 e 1 per l'asse Z
    );

    // Inizia con valori molto piccoli e aumenta gradualmente
    //const libraryScaling = new BABYLON.Vector3(0.001, 0.001, 0.001);
    // Se il modello è troppo piccolo, prova a incrementare
    //const libraryScaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
    // Se ancora troppo piccolo
    const libraryScaling = new BABYLON.Vector3(1.1, 1.1, 1.1);

    // Prova diverse rotazioni se il modello appare orientato male
    const libraryRotation = new BABYLON.Vector3(
        0,           // Rotazione sull'asse X
        0,   // Rotazione sull'asse Y (90 gradi)
        0            // Rotazione sull'asse Z
    );
    loadExternalModel(scene,"models/library.glb",libraryPosition, libraryRotation, libraryScaling)



    const couchPosition = new BABYLON.Vector3(
        1,            // Prova valori tra -2 e 2 per l'asse X
        0.3,     // Mantieni sopra la scrivania
        -1.9     // Prova valori tra -1 e 1 per l'asse Z
    );
    const couchRotation = new BABYLON.Vector3(
        0,           // Rotazione sull'asse X
        -Math.PI/2,   // Rotazione sull'asse Y (90 gradi)
        0            // Rotazione sull'asse Z
    );
    const couchScaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
    loadExternalModel(scene,"models/couch.glb",couchPosition, couchRotation, couchScaling)



    
    const lockerPosition = new BABYLON.Vector3(
        -2.2,            // Prova valori tra -2 e 2 per l'asse X
        0,     // Mantieni sopra la scrivania
        1.88    // Prova valori tra -1 e 1 per l'asse Z
    );
    const lockerRotation = new BABYLON.Vector3(
        0,           // Rotazione sull'asse X
        Math.PI/2,   // Rotazione sull'asse Y (90 gradi)
        0            // Rotazione sull'asse Z
    );
    const lockerScaling = new BABYLON.Vector3(1, 1, 1);
    loadExternalModel(scene,"models/locker.glb",lockerPosition, lockerRotation, lockerScaling)

    const locker2Position = new BABYLON.Vector3(
        -2.2,            // Prova valori tra -2 e 2 per l'asse X
        0,     // Mantieni sopra la scrivania
        2.2   // Prova valori tra -1 e 1 per l'asse Z
    );
    const locker2Rotation = new BABYLON.Vector3(
        0,           // Rotazione sull'asse X
        Math.PI/2,   // Rotazione sull'asse Y (90 gradi)
        0            // Rotazione sull'asse Z
    );
    const locker2Scaling = new BABYLON.Vector3(1, 1, 1);
    loadExternalModel(scene,"models/locker2.glb",locker2Position, locker2Rotation, locker2Scaling)


    const wallpicsPosition = new BABYLON.Vector3(
        -2.33,            // Prova valori tra -2 e 2 per l'asse X
        2,     // Mantieni sopra la scrivania
        -1  // Prova valori tra -1 e 1 per l'asse Z
    );
    const wallpicsRotation = new BABYLON.Vector3(
        0,           // Rotazione sull'asse X
        0,   // Rotazione sull'asse Y (90 gradi)
        0            // Rotazione sull'asse Z
    );
    const wallpicsScaling = new BABYLON.Vector3(1, 1, 1);
    loadExternalModel(scene,"models/wallPics.glb",wallpicsPosition, wallpicsRotation, wallpicsScaling)

    

    const penHolderPosition = new BABYLON.Vector3(
        -0.6,            // Prova valori tra -2 e 2 per l'asse X
        0.85,     // Mantieni sopra la scrivania
        1.7  // Prova valori tra -1 e 1 per l'asse Z
    );
    const penHolderRotation = new BABYLON.Vector3(
        0,           // Rotazione sull'asse X
        0,   // Rotazione sull'asse Y (90 gradi)
        0            // Rotazione sull'asse Z
    );
    const penHolderScaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    loadExternalModel(scene,"models/penHolder.glb",penHolderPosition, penHolderRotation, penHolderScaling)
    


    return scene;
}


function loadExternalModel(scene, modelPath, position, rotation, scaling) {
        console.log("Tentativo di caricamento del modello:", modelPath);
        return BABYLON.SceneLoader.ImportMeshAsync("", modelPath, "")
        .then((result) => {
            console.log("Modello caricato con successo:", result);
            const rootMesh = result.meshes[0];
            
            // Imposta posizione, rotazione e scala
            rootMesh.position = position;
            rootMesh.rotation = rotation;
            rootMesh.scaling = scaling;
            
            // Disabilita le collisioni per tutte le mesh individuali del modello
            result.meshes.forEach((mesh) => {
                mesh.checkCollisions = false;
            });
            
            // Crea una bounding box semplificata per le collisioni
            // Questa sarà leggermente più piccola della libreria reale
            const boundingBox = BABYLON.MeshBuilder.CreateBox("libraryCollision", {
                width: 0.9,    // Leggermente più stretto della libreria
                height: 1.8,   // Altezza della libreria
                depth: 0.3     // Profondità ridotta per evitare blocchi
            }, scene);
            
            // Posiziona la bounding box in relazione alla libreria
            boundingBox.position = new BABYLON.Vector3(
                rootMesh.position.x,
                rootMesh.position.y,
                rootMesh.position.z
            );
            boundingBox.rotation = rootMesh.rotation.clone();
            
            // Rendi la bounding box invisibile e abilitane le collisioni
            boundingBox.visibility = 0;
            boundingBox.checkCollisions = true;
            
            // Collega la bounding box alla libreria
            boundingBox.parent = rootMesh;
            
            return rootMesh;
        })
        .catch(error => {
            console.error("Errore dettagliato nel caricamento:", error);
        });

    }