window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('renderCanvas');
    if (!canvas) {
        console.error("Render canvas not found!");
        return;
    }

    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    if (!engine) {
        console.error("Babylon.js engine could not be created!");
        return;
    }
    window.engine = engine; // Make engine globally available if needed by other scripts, though it's better to pass it

    // Create Scene
    const scene = createScene(engine, canvas); // createScene is defined in scene.js
    if (!scene) {
        console.error("Scene could not be created!");
        return;
    }
    window.scene = scene; // Make scene globally available

    // Initialize Console (defined in console.js)
    // Ensure console.js is loaded and initConsole is available
    if (typeof initConsole === "function") {
        initConsole(); 
    } else {
        console.error("initConsole function not found. Ensure console.js is loaded correctly.");
        return;
    }

    // Setup Interactions (defined in interaction.js)
    // Ensure interaction.js is loaded and setupInteractions is available
    if (typeof setupInteractions === "function") {
        setupInteractions(scene, scene.activeCamera);
    } else {
        console.error("setupInteractions function not found. Ensure interaction.js is loaded correctly.");
        return;
    }

    // Render loop
    engine.runRenderLoop(() => {
        if (scene && scene.activeCamera) {
            scene.render();
        }
    });

    // Resize event
    window.addEventListener('resize', () => {
        engine.resize();
        if (window.fitAddon) { // fitAddon is from console.js, for xterm.js
            window.fitAddon.fit();
        }
    });

    // Pointer lock for FPS controls (optional, but good for immersion)
    canvas.addEventListener("click", () => {
        if (!engine.isPointerLock) {
            // Check if console is visible. If so, don't lock pointer.
            const consoleContainer = document.getElementById("consoleContainer");
            if (consoleContainer && consoleContainer.style.display === "none") {
                 engine.enterPointerlock();
            }
        }
    });

    document.addEventListener("pointerlockchange", () => {
        if (document.pointerLockElement !== canvas) {
            // console.log("Pointer unlocked");
        } else {
            // console.log("Pointer locked");
        }
    });

});

