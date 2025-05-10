document.addEventListener('DOMContentLoaded', () => {
    const sketchListContainer = document.getElementById('sketch-list-container'); 
    const sketchContainer = document.getElementById('sketch-container');
    let currentP5Instance = null;
    let currentActiveListItem = null; // To keep track of the active list item

    // --- Define sketch-specific control container IDs ---
    // const sketchControlContainerIds = {
    //     // 'neuralAnt': 'neuralAntControlsContainer' // This will be handled dynamically by the sketch itself
    // };

    // --- Define your sketches here ---
    // 'id' should be unique and can be used for file naming (convention)
    // 'name' is for display in the dropdown
    // 'sketchFunction': The name of the function defined in the sketch's JS file
    // 'file': Path to the sketch's JS file
    const sketches = [
        {
            id: 'neuralNetworksFolder',
            name: 'Neural Networks',
            description: 'A collection of neural network sketches.',
            children: [
                {
                    id: 'neuralAnt',
                    name: 'Neural Ant',
                    description: '',
                    sketchFunction: 'neuralAntSketch',
                    file: 'sketches/neural_networks/neural_ant.js',
                }
            ]
        },
        {
            id: 'tentacle',
            name: 'Tentacle',
            description:'',
            sketchFunction: 'tentacleSketch',
            file: 'sketches/tentacle.js',
        },
        {
            id: 'spinningShapes',
            name: 'Spinning Shapes',
            description:'',
            sketchFunction: 'spinningShapesSketch',
            file: 'sketches/spinning_shapes.js',
        },
        {
            id: 'spinningCircles',
            name: 'Spinning Circles',
            description:'',
            sketchFunction: 'spinningCirclesSketch',
            file: 'sketches/spinningCircles.js',

        },
        {
            id:'sineWaves',
            name:'Sine Waves',
            description:'',
            sketchFunction: 'sineWavesSketch',
            file: 'sketches/sineWaves.js'
        },
        {
            id:'sineWaves2',
            name:'Sine Waves 2',
            description:'',
            sketchFunction: 'sineWavesSketch2',
            file: 'sketches/sineWaves2.js'
        },
        {
            id:'sineWaves3',
            name:'Sine Waves 3',
            description:'',
            sketchFunction: 'sineWavesSketch3',
            file: 'sketches/sineWaves3.js'
        },
        {
            id:'rotatingWaves',
            name:'Rotating Waves',
            description:'',
            sketchFunction: 'rotatingWavesSketch',
            file: 'sketches/rotatingWaves.js'
        },
        {
            id: 'particlesFolder', // Changed ID to reflect it's a folder/category
            name: 'Particles', // This will be the parent list item
            description: 'A collection of particle sketches.',
            children: [ // Add a children array for nested sketches
                {
                    id: 'particlePusher',
                    name: 'Particle Pusher',
                    description: 'Click and drag to move particles around.',
                    sketchFunction: 'particlePusherSketch',
                    file: 'sketches/particles/particlePusher.js',
                },
                {
                    id: 'floatyParticles',
                    name: 'Floaty Particles',
                    description: 'Floaty particles.',
                    sketchFunction: 'floatyParticlesSketch',
                    file: 'sketches/particles/floatyParticles.js',
                },
                {
                    id: 'particleTypography',
                    name: 'Particle Typography',
                    description: 'Interactive particle text that changes over time. Move mouse to interact.',
                    sketchFunction: 'particleTypographySketch',
                    file: 'sketches/particles/particleTypography.js',
                },
            ]
        },
        {
            id: 'asciiArtFolder',
            name: 'Ascii Art',
            description: 'Sketches featuring ASCII character art.',
            children: [
                {
                    id: 'asciiPatterns',
                    name: 'Ascii Patterns',
                    description: 'Generative patterns using ASCII characters.',
                    sketchFunction: 'asciiPatternsSketch',
                    file: 'sketches/ascii/ascii_patterns.js',
                },
                {
                    id: 'asciiGifs',
                    name: 'Ascii Gifs',
                    description: 'Gifs made from ascii art. click to change gifs',
                    sketchFunction: 'asciiGifsSketch',
                    file: 'sketches/ascii/ascii_gifs.js',
                },
                {
                    id: 'asciiGifs2',
                    name: 'Ascii Gifs 2 (Single)',
                    description: 'A single, hardcoded GIF rendered with brightness-mapped ASCII characters.',
                    sketchFunction: 'asciiGifs2Sketch',
                    file: 'sketches/ascii/ascii_gifs2.js',
                },
                {
                    id: 'asciiGifInteractive',
                    name: 'Ascii Gif Interactive',
                    description: 'Interactive Sobel edge detection ASCII art from GIFs with dynamic loading.',
                    sketchFunction: 'asciiGifInteractiveSketch',
                    file: 'sketches/ascii/ascii_gif_interactive.js',
                }
            ]
        },
        {
            id: 'fromLife',
            name: 'From Life',
            title: 'From Life', // Specific title for this sketch
            date: '9/19/2024', // Date for this sketch
            art_description: 'Coming And Going <br> Waitng And Watching <br> Never Different In The Same Way <br> Always The Same In A Different Way <br>', // HTML description
            sketchFunction: 'fromLifeSketch',
            file: 'sketches/from_life.js',
        }
    ];

    // Function to sort sketches alphabetically by name, including nested children
    function sortSketchesAlphabetically(sketchArray) {
        sketchArray.sort((a, b) => a.name.localeCompare(b.name));
        sketchArray.forEach(sketch => {
            if (sketch.children && sketch.children.length > 0) {
                sortSketchesAlphabetically(sketch.children);
            }
        });
    }

    // Sort the sketches before populating the list
    sortSketchesAlphabetically(sketches);

    // Populate the sketch list in the sidebar
    function createSketchListItem(sketch, container) {
        const listItem = document.createElement('li');
        listItem.textContent = sketch.name;

        if (sketch.children && sketch.children.length > 0) {
            // If it has children, it's a folder/category
            listItem.classList.add('folder'); // Optional: for styling
            const subList = document.createElement('ul');
            sketch.children.forEach(childSketch => {
                createSketchListItem(childSketch, subList); // Recursively create list items
            });
            listItem.appendChild(subList);

            // Optional: Add click listener to toggle visibility of sub-list
            listItem.addEventListener('click', (event) => {
                // Prevent sketch loading if a folder is clicked,
                // and toggle visibility of the sub-list.
                event.stopPropagation(); // Stop event from bubbling to parent listeners
                subList.style.display = subList.style.display === 'none' ? 'block' : 'none';
            });

        } else if (sketch.file && sketch.sketchFunction) {
            // It's a runnable sketch
            listItem.dataset.sketchId = sketch.id;
            listItem.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent folder click listener if it's a nested sketch
                loadSketch(sketch.id);
                if (currentActiveListItem) {
                    currentActiveListItem.classList.remove('active');
                }
                listItem.classList.add('active');
                currentActiveListItem = listItem;
            });
        }
        container.appendChild(listItem);
    }

    sketches.forEach(sketch => {
        createSketchListItem(sketch, sketchListContainer);
    });

    // Helper function to load a single script and return a Promise
    function loadSingleScript(src) {
        return new Promise((resolve, reject) => {
            // Remove existing script if it has the same src to avoid re-declaration errors
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Ensure scripts are executed in order of appending for non-module scripts
            script.onload = () => {
                console.log(`Script loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Error loading script: ${src}`);
                reject(new Error(`Error loading script: ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    // Helper function to load multiple scripts in order
    async function loadScriptsInOrder(scriptSources) {
        for (const src of scriptSources) {
            await loadSingleScript(src);
        }
    }

    // Function to load and run a sketch
    function findSketchById(id, sketchArray) {
        for (const sketch of sketchArray) {
            if (sketch.id === id) return sketch;
            if (sketch.children) {
                const foundInChild = findSketchById(id, sketch.children);
                if (foundInChild) return foundInChild;
            }
        }
        return null;
    }

    async function loadSketch(sketchId) {
        const selectedSketch = findSketchById(sketchId, sketches); // Use the new finder function
        const sketchInfoContainer = document.getElementById('sketch-info'); // Get the sketch-info div

        // --- Hide all sketch-specific control containers first ---
        // This logic is removed as dynamic UIs will manage themselves
        // for (const containerId of Object.values(sketchControlContainerIds)) {
        //     const el = document.getElementById(containerId);
        //     if (el) el.style.display = 'none';
        // }

        if (!selectedSketch) { // Simplified check
            console.error('Sketch not found:', sketchId);
            sketchContainer.innerHTML = '<p>Please select a sketch.</p>';
            if (sketchInfoContainer) sketchInfoContainer.innerHTML = '';
            if (currentP5Instance) {
                currentP5Instance.remove();
                currentP5Instance = null;
            }
            return;
        }
        
        // Clear previous sketch and its container
        if (currentP5Instance) {
            currentP5Instance.remove();
            currentP5Instance = null;
        }
        sketchContainer.innerHTML = ''; // Clear out previous canvas/elements

        // Update sketch information display
        if (sketchInfoContainer) {
            let infoHtml = '';
            if (selectedSketch.title) {
                infoHtml += `<h2>${selectedSketch.title}</h2>`;
            } else {
                infoHtml += `<h2>${selectedSketch.name}</h2>`; // Fallback to name if no specific title
            }
            if (selectedSketch.date) {
                infoHtml += `<p class="art-date">${selectedSketch.date}</p>`;
            }
            if (selectedSketch.art_description) {
                infoHtml += `<p class="art-description">${selectedSketch.art_description}</p>`;
            } else if (selectedSketch.description) { // Fallback to general description
                infoHtml += `<p class="art-description">${selectedSketch.description}</p>`;
            }
            sketchInfoContainer.innerHTML = infoHtml;
        }
        
        // Prepare a clean container for the new sketch
        const canvasContainerDiv = document.createElement('div');
        canvasContainerDiv.id = 'canvas-container'; // The ID your sketch.js expects
        canvasContainerDiv.style.position = 'relative';
        sketchContainer.appendChild(canvasContainerDiv);

        // --- Show controls for the current sketch if any ---
        // This logic is removed as dynamic UIs will manage themselves
        // if (selectedSketch.id && sketchControlContainerIds[selectedSketch.id]) {
        //     const currentControlsId = sketchControlContainerIds[selectedSketch.id];
        //     const el = document.getElementById(currentControlsId);
        //     if (el) {
        //         el.style.display = 'block'; // Or 'flex', or your preferred display style
        //     } else {
        //         console.warn(`Controls container with ID '${currentControlsId}' not found in index.html for sketch '${selectedSketch.name}'.`);
        //     }
        // }

        if (selectedSketch.id === 'neuralAnt') {
            const neuralAntScripts = [
                'sketches/neural_networks/config.js',
                'sketches/neural_networks/neural_network.js',
                'sketches/neural_networks/feature_extractor.js',
                'sketches/neural_networks/cell.js',
                'sketches/neural_networks/grid.js',
                'sketches/neural_networks/ant.js',
                'sketches/neural_networks/ui.js',
                'sketches/neural_networks/neural_ant.js'
            ];
            try {
                console.log("Loading scripts for Neural Ant...");
                await loadScriptsInOrder(neuralAntScripts);
                if (window[selectedSketch.sketchFunction]) {
                    currentP5Instance = new p5(window[selectedSketch.sketchFunction], canvasContainerDiv);
                    console.log(`Neural Ant sketch "${selectedSketch.name}" initialized.`);
                } else {
                    console.error(`Sketch function ${selectedSketch.sketchFunction} not found for Neural Ant.`);
                    sketchContainer.innerHTML = '<p>Error loading Neural Ant sketch function. Check console.</p>';
                    // Also hide its controls if loading failed -- This is removed
                    // const controlsId = sketchControlContainerIds[selectedSketch.id];
                    // if (controlsId) {
                    //     const el = document.getElementById(controlsId);
                    //     if (el) el.style.display = 'none';
                    // }
                }
            } catch (error) {
                console.error(`Failed to load scripts for ${selectedSketch.name}: `, error);
                sketchContainer.innerHTML = '<p>Error loading Neural Ant sketch. Check console.</p>';
                // Also hide its controls if loading failed -- This is removed
                // const controlsId = sketchControlContainerIds[selectedSketch.id];
                // if (controlsId) {
                //     const el = document.getElementById(controlsId);
                //     if (el) el.style.display = 'none';
                // }
            }
        } else if (selectedSketch.file && selectedSketch.sketchFunction) {
            // Standard loading for other sketches
            try {
                await loadSingleScript(selectedSketch.file);
                if (window[selectedSketch.sketchFunction]) {
                    currentP5Instance = new p5(window[selectedSketch.sketchFunction], canvasContainerDiv);
                    console.log(`Sketch "${selectedSketch.name}" initialized.`);
                } else {
                    console.error(`Sketch function ${selectedSketch.sketchFunction} not found for ${selectedSketch.name}.`);
                    sketchContainer.innerHTML = '<p>Error loading sketch function. Check console.</p>';
                }
            } catch (error) {
                console.error(`Failed to load script for ${selectedSketch.name}: `, error);
                sketchContainer.innerHTML = '<p>Error loading sketch. Check console.</p>';
            }
        } else {
             console.warn(`Sketch ${sketchId} is not configured for loading (no file or sketchFunction).`);
             if (sketchContainer.innerHTML === '') { // Only update if not already showing an error
                sketchContainer.innerHTML = '<p>Selected item is not a runnable sketch.</p>';
             }
        }
    }

    // Initial state
    if (sketches.length > 0) {
        sketchContainer.innerHTML = '<p>Please select a sketch to view.</p>';
        // --- Hide all sketch-specific control containers initially --- This is removed
        // for (const containerId of Object.values(sketchControlContainerIds)) {
        //     const el = document.getElementById(containerId);
        //     if (el) el.style.display = 'none';
        // }
        // Check if the first item is a folder or a sketch to avoid errors
        const firstItem = sketches[0];
        if (firstItem && firstItem.file) { // If it's a sketch, load it by default (optional)
            // loadSketch(firstItem.id); // Or just show the message
            // if (currentActiveListItem) currentActiveListItem.classList.remove('active');
            // const firstListItem = sketchListContainer.querySelector(`li[data-sketch-id="${firstItem.id}"]`);
            // if (firstListItem) {
            //     firstListItem.classList.add('active');
            //     currentActiveListItem = firstListItem;
            // }
        }
    } else {
        sketchListContainer.innerHTML = '<li>No sketches defined.</li>';
        sketchContainer.innerHTML = '<p>No sketches available.</p>';
    }
});