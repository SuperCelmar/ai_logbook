// =====================
// IDEA OCEAN
// =====================

// Sample AI scoring algorithm (simulated backend)
function scoreIdea(ideaText) {
    // In a real application, this would call a backend API with AI
    return {
        feasibility: Math.floor(Math.random() * 100),
        originality: Math.floor(Math.random() * 100),
        creativity: Math.floor(Math.random() * 100),
        totalScore: Math.floor(Math.random() * 100),
    };
}

// Data storage (would be replaced by backend in production)
let ideas = [
    {
        id: 1,
        text: "AI-powered ocean pollution detector with marine drone swarms",
        scores: {
            feasibility: 68,
            originality: 85,
            creativity: 92,
            totalScore: 82
        },
        votes: 17,
        timestamp: Date.now() - 1000000
    },
    {
        id: 2,
        text: "Neural interface for deep sea exploration and marine life communication",
        scores: {
            feasibility: 41,
            originality: 95,
            creativity: 88,
            totalScore: 75
        },
        votes: 12,
        timestamp: Date.now() - 2000000
    },
    {
        id: 3,
        text: "Space debris collection system with self-replicating nanobots",
        scores: {
            feasibility: 54,
            originality: 78,
            creativity: 86,
            totalScore: 73
        },
        votes: 9,
        timestamp: Date.now() - 3000000
    }
];

// Track which idea the user has voted for
let userVote = null;

// DOM elements
const ideaInput = document.getElementById('idea-input');
const submitBtn = document.getElementById('submit-btn');
const leaderboard = document.getElementById('leaderboard');

// Theme sets based on common AI project domains
const themeSettings = {
    ocean: {
        primary: '#0a2463',
        secondary: '#247ba0',
        accent: '#05f4b7',
        background: '#05103a',
        particleColor: '#05f4b7',
        particleShape: 'circle',
        particleMovement: 'bubble'
    },
    space: {
        primary: '#0b3d91',
        secondary: '#4c6ef5',
        accent: '#fc3d21',
        background: '#030027',
        particleColor: '#ffffff',
        particleShape: 'star',
        particleMovement: 'slow'
    },
    biotech: {
        primary: '#2d6a4f',
        secondary: '#40916c',
        accent: '#95d5b2',
        background: '#081c15',
        particleColor: '#95d5b2',
        particleShape: 'circle',
        particleMovement: 'connect'
    },
    robotics: {
        primary: '#3a0ca3',
        secondary: '#4361ee',
        accent: '#f72585',
        background: '#10002b',
        particleColor: '#4cc9f0',
        particleShape: 'edge',
        particleMovement: 'grid'
    },
    quantum: {
        primary: '#480ca8',
        secondary: '#560bad',
        accent: '#b5179e',
        background: '#240046',
        particleColor: '#b5179e',
        particleShape: 'circle',
        particleMovement: 'quantum'
    }
};

// Initialize the application
function init() {
    // Set up event listeners
    submitBtn.addEventListener('click', handleSubmitIdea);
    ideaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmitIdea();
    });
    
    // Initial render
    renderLeaderboard();
    
    // Initialize particles based on top idea
    initializeParticles();
}

// Handle idea submission
function handleSubmitIdea() {
    const text = ideaInput.value.trim();
    
    if (text.length < 5) {
        shakeElement(ideaInput);
        return;
    }
    
    // Get AI scores (simulated)
    const scores = scoreIdea(text);
    
    // Create new idea
    const newIdea = {
        id: Date.now(),
        text: text,
        scores: scores,
        votes: 1, // Start with 1 vote
        timestamp: Date.now()
    };
    
    // Reset previous vote if any
    if (userVote) {
        const previousVotedIdea = ideas.find(idea => idea.id === userVote);
        if (previousVotedIdea) {
            previousVotedIdea.votes--;
        }
    }
    
    // Set user vote to new idea
    userVote = newIdea.id;
    
    // Add to ideas array
    ideas.push(newIdea);
    
    // Clear input
    ideaInput.value = '';
    
    // Re-render leaderboard
    renderLeaderboard();
    
    // Update theme based on top idea
    updateThemeBasedOnTopIdea();
}

// Render the leaderboard
function renderLeaderboard() {
    // Sort ideas by votes (descending)
    ideas.sort((a, b) => b.votes - a.votes);
    
    // Clear leaderboard
    leaderboard.innerHTML = '';
    
    // Add each idea to the leaderboard
    ideas.forEach((idea, index) => {
        const isTopIdea = index === 0;
        const isVoted = userVote === idea.id;
        
        const ideaCard = document.createElement('div');
        ideaCard.className = `idea-card ${isTopIdea ? 'top-idea' : ''} fade-in`;
        ideaCard.style.animationDelay = `${index * 0.1}s`;
        
        ideaCard.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="idea-content">
                <div class="idea-text">${idea.text}</div>
                <div class="idea-meta">
                    <span>Feasibility: ${idea.scores.feasibility}%</span>
                    <span>Originality: ${idea.scores.originality}%</span>
                    <span>Creativity: ${idea.scores.creativity}%</span>
                </div>
            </div>
            <div class="idea-score">
                <button class="vote-btn ${isVoted ? 'voted' : ''}" data-id="${idea.id}">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <span class="vote-count">${idea.votes}</span>
            </div>
        `;
        
        leaderboard.appendChild(ideaCard);
        
        // Add click event to vote button
        const voteBtn = ideaCard.querySelector('.vote-btn');
        voteBtn.addEventListener('click', () => handleVote(idea.id));
    });
}

// Handle voting
function handleVote(ideaId) {
    // If user already voted for this idea, do nothing
    if (userVote === ideaId) return;
    
    // If user voted for another idea, remove that vote
    if (userVote) {
        const previousVotedIdea = ideas.find(idea => idea.id === userVote);
        if (previousVotedIdea) {
            previousVotedIdea.votes--;
        }
    }
    
    // Add vote to this idea
    const votedIdea = ideas.find(idea => idea.id === ideaId);
    if (votedIdea) {
        votedIdea.votes++;
        userVote = ideaId;
    }
    
    // Re-render leaderboard
    renderLeaderboard();
    
    // Update theme based on top idea
    updateThemeBasedOnTopIdea();
}

// Initialize particles
function initializeParticles() {
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#05f4b7"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#05f4b7",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Update particle configuration
function updateParticles(config) {
    // This would ideally interface with the particles.js update API
    // For simplicity, we're destroying and recreating the particles
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
    }
    
    setTimeout(() => {
        const newConfig = {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: config.particleColor
                },
                shape: {
                    type: config.particleShape === 'star' ? 'star' : 
                          config.particleShape === 'edge' ? 'edge' : 'circle',
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: config.particleColor,
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: config.particleMovement === 'slow' ? 1 : 
                           config.particleMovement === 'quantum' ? 4 : 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: config.particleMovement === 'quantum',
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: config.particleMovement === 'bubble' ? 'bubble' :
                              config.particleMovement === 'connect' ? 'grab' :
                              config.particleMovement === 'grid' ? 'repulse' : 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        };
        
        particlesJS("particles-js", newConfig);
    }, 50);
}

// Utility: classify text and determine theme
function classifyIdeaTheme(ideaText) {
    // In a real application, this would use AI to categorize the idea
    const text = ideaText.toLowerCase();
    
    if (text.includes('ocean') || text.includes('sea') || text.includes('marine') || text.includes('water')) {
        return 'ocean';
    } else if (text.includes('space') || text.includes('star') || text.includes('planet') || text.includes('galax')) {
        return 'space';
    } else if (text.includes('bio') || text.includes('gene') || text.includes('medic') || text.includes('health')) {
        return 'biotech';
    } else if (text.includes('robot') || text.includes('machine') || text.includes('automat') || text.includes('mechan')) {
        return 'robotics';
    } else if (text.includes('quantum') || text.includes('physic') || text.includes('particle') || text.includes('energy')) {
        return 'quantum';
    }
    
    // Default to ocean theme
    return 'ocean';
}

// Update theme based on top idea
function updateThemeBasedOnTopIdea() {
    if (ideas.length === 0) return;
    
    // Sort ideas to ensure we have the top idea
    ideas.sort((a, b) => b.votes - a.votes);
    
    const topIdea = ideas[0];
    const theme = classifyIdeaTheme(topIdea.text);
    const themeConfig = themeSettings[theme];
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', themeConfig.primary);
    document.documentElement.style.setProperty('--secondary-color', themeConfig.secondary);
    document.documentElement.style.setProperty('--accent-color', themeConfig.accent);
    document.documentElement.style.setProperty('--background-color', themeConfig.background);
    
    // Update body background with a smooth transition
    document.body.style.background = themeConfig.background;
    
    // Update particles
    updateParticles(themeConfig);
}

// Utility: shake element for invalid input
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Add a shake animation to our CSS
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);