document.addEventListener('DOMContentLoaded', () => {
    const sketchListContainer = document.getElementById('sketch-list-container'); 
    const sketchContainer = document.getElementById('sketch-container');
    let currentP5Instance = null;
    let currentActiveListItem = null; // To keep track of the active list item

    // --- Define your sketches here ---
    // 'id' should be unique and can be used for file naming (convention)
    // 'name' is for display in the dropdown
    // 'sketchFunction': The name of the function defined in the sketch's JS file
    // 'file': Path to the sketch's JS file
    const sketches = [
        {
            id: 'spinningCircles',
            name: 'Spinning Circles',
            description:'',
            sketchFunction: 'spinningCirclesSketch',
            file: 'sketches/spinningCircles.js',

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


    function loadSketch(sketchId) {
        const selectedSketch = findSketchById(sketchId, sketches); // Use the new finder function
        const sketchInfoContainer = document.getElementById('sketch-info'); // Get the sketch-info div

        if (!selectedSketch || !selectedSketch.file) { // Ensure it's a loadable sketch
            console.error('Sketch not found or not loadable:', sketchId);
            sketchContainer.innerHTML = '<p>Please select a sketch.</p>';
            if (sketchInfoContainer) sketchInfoContainer.innerHTML = ''; // Clear sketch info
            if (currentP5Instance) { // Clean up if a sketch was loaded before this error
                currentP5Instance.remove();
                currentP5Instance = null;
            }
            return;
        }

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
        } else {
            console.warn("#sketch-info container not found in the DOM.");
        }

        // 1. Clean up any existing sketch
        if (currentP5Instance) {
            currentP5Instance.remove();
            currentP5Instance = null;
        }
        sketchContainer.innerHTML = ''; // Clear container

        // 2. Load the new sketch script
        const scriptId = 'dynamic-sketch-script';
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.remove(); // Remove old script tag
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = selectedSketch.file;
        script.onload = () => {
            // The script is loaded, now the sketchFunction (e.g., awesomeCirclesSketch) should be globally available
            if (typeof window[selectedSketch.sketchFunction] === 'function') {
                // Create a new p5 instance, targeting the 'sketch-container' div
                currentP5Instance = new p5(window[selectedSketch.sketchFunction], sketchContainer);

                // After the sketch is instantiated (and its setup() has run),
                // explicitly resize the canvas to the container's current dimensions.
                // This ensures the canvas matches the container, overriding any specific
                // dimensions set by createCanvas() within the sketch if they differ from the container.
                if (currentP5Instance && typeof currentP5Instance.resizeCanvas === 'function') {
                    if (sketchContainer.offsetWidth > 0 && sketchContainer.offsetHeight > 0) {
                        currentP5Instance.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetHeight);
                    } else {
                        console.warn('Sketch container has zero width or height. p5.js canvas might not be visible or correctly sized.');
                    }
                }
            } else {
                console.error(`Sketch function ${selectedSketch.sketchFunction} not found after loading ${selectedSketch.file}. Make sure the function is defined globally in the sketch file or assigned to window.`);
                sketchContainer.innerHTML = `<p>Error: Could not load sketch function ${selectedSketch.sketchFunction}.</p>`;
            }
        };
        script.onerror = () => {
            console.error('Error loading sketch file:', selectedSketch.file);
            sketchContainer.innerHTML = '<p>Error loading sketch. Check console.</p>';
        };
        document.head.appendChild(script); // Load the script
    }

    // Initial state
    if (sketches.length > 0) {
        sketchContainer.innerHTML = '<p>Please select a sketch to view.</p>';
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