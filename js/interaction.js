const interactionHint = document.getElementById("interactionHint");
let highlightedMesh = null;

function setupInteractions(scene, camera) {
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERMOVE:
                const pickResultMove = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh.isPickable && mesh.name === "PC_Monitor");
                if (pickResultMove.hit) {
                    if (highlightedMesh !== pickResultMove.pickedMesh) {
                        if (highlightedMesh) {
                            // Optional: Remove highlight from previously highlighted mesh
                            // highlightedMesh.material.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.1); // Reset to original
                        }
                        highlightedMesh = pickResultMove.pickedMesh;
                        // Optional: Add highlight to current mesh
                        // highlightedMesh.material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.8); // Highlight color
                        interactionHint.style.display = "block";
                    }
                } else {
                    if (highlightedMesh) {
                        // Optional: Remove highlight
                        // highlightedMesh.material.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.1);
                        interactionHint.style.display = "none";
                        highlightedMesh = null;
                    }
                }
                break;

            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (highlightedMesh && highlightedMesh.name === "PC_Monitor") {
                    // Check if the console is already visible to prevent re-triggering if not desired
                    if (document.getElementById("consoleContainer").style.display === "none") {
                        toggleConsoleVisibility();
                    }
                }
                break;
        }
    });

    // Keyboard interaction for 'E' key
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                if (kbInfo.event.key === "e" || kbInfo.event.key === "E") {
                    // Perform a pick to see if we are looking at the monitor
                    const pickResultKey = scene.pick(scene.getEngine().getRenderWidth() / 2, scene.getEngine().getRenderHeight() / 2, (mesh) => mesh.isPickable && mesh.name === "PC_Monitor");
                    if (pickResultKey.hit && pickResultKey.pickedMesh.name === "PC_Monitor") {
                         if (document.getElementById("consoleContainer").style.display === "none") {
                            toggleConsoleVisibility();
                        }
                    }
                }
                // Allow Esc to close console if it's open
                if (kbInfo.event.key === "Escape") {
                    if (document.getElementById("consoleContainer").style.display === "flex") {
                        toggleConsoleVisibility();
                    }
                }
                break;
        }
    });

    // Initial check for hint if camera starts pointing at monitor
    // This might be better handled by a small delay or first move
    setTimeout(() => {
        const pickResultInitial = scene.pick(scene.getEngine().getRenderWidth() / 2, scene.getEngine().getRenderHeight() / 2, (mesh) => mesh.isPickable && mesh.name === "PC_Monitor");
        if (pickResultInitial.hit && pickResultInitial.pickedMesh.name === "PC_Monitor") {
            interactionHint.style.display = "block";
            highlightedMesh = pickResultInitial.pickedMesh;
        }
    }, 500);
}

