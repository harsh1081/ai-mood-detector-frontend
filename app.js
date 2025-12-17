// Global state
let detectionActive = false;
let videoStream = null;
let audioStream = null;
let typingStartTime = null;
let detectionHistory = [];
let autoStopTimer = null;
let countdownTimer = null;
let guideVisible = true;
let faceModel = null;
let facialExpressions = [];
let expressionHistory = [];

// Content database
const contentDatabase = {
    movies: {
        happy: [
            { title: "The Secret Life of Pets", description: "A fun animated adventure", image: "🎬", genre: "Animation", year: "2016" },
            { title: "The Grand Budapest Hotel", description: "Whimsical comedy-drama", image: "🎭", genre: "Comedy", year: "2014" },
            { title: "La La Land", description: "Musical romance", image: "🎵", genre: "Musical", year: "2016" },
            { title: "Paddington", description: "Heartwarming family film", image: "🐻", genre: "Family", year: "2014" },
            { title: "The Intouchables", description: "Inspiring true story", image: "💫", genre: "Drama", year: "2011" },
            { title: "Amélie", description: "Charming French romance", image: "🇫🇷", genre: "Romance", year: "2001" },
            { title: "Zootopia", description: "Funny animated mystery", image: "🦊", genre: "Animation", year: "2016" },
            { title: "The Lego Movie", description: "Everything is awesome!", image: "🧱", genre: "Animation", year: "2014" },
            { title: "Sing", description: "Musical comedy", image: "🎤", genre: "Musical", year: "2016" },
            { title: "The Princess Bride", description: "Classic adventure comedy", image: "⚔️", genre: "Adventure", year: "1987" },
            { title: "Back to the Future", description: "Time-traveling adventure", image: "⏰", genre: "Sci-Fi", year: "1985" },
            { title: "Ferris Bueller's Day Off", description: "Classic comedy", image: "🚗", genre: "Comedy", year: "1986" }
        ],
        sad: [
            { title: "The Pursuit of Happyness", description: "Inspiring true story", image: "💪", genre: "Drama", year: "2006" },
            { title: "Good Will Hunting", description: "Emotional drama", image: "🧠", genre: "Drama", year: "1997" },
            { title: "The Shawshank Redemption", description: "Hope and redemption", image: "🔓", genre: "Drama", year: "1994" },
            { title: "Inside Out", description: "Understanding emotions", image: "🧠", genre: "Animation", year: "2015" },
            { title: "A Beautiful Mind", description: "Triumph over adversity", image: "🌟", genre: "Biography", year: "2001" },
            { title: "The Green Mile", description: "Powerful emotional journey", image: "💚", genre: "Drama", year: "1999" },
            { title: "Forrest Gump", description: "Life's ups and downs", image: "🏃", genre: "Drama", year: "1994" },
            { title: "The Fault in Our Stars", description: "Touching love story", image: "⭐", genre: "Romance", year: "2014" },
            { title: "Up", description: "Emotional animated adventure", image: "🎈", genre: "Animation", year: "2009" },
            { title: "The Notebook", description: "Timeless romance", image: "📔", genre: "Romance", year: "2004" }
        ],
        stressed: [
            { title: "The Secret Garden", description: "Peaceful and calming", image: "🌺", genre: "Drama", year: "1993" },
            { title: "My Neighbor Totoro", description: "Gentle animated film", image: "🌳", genre: "Animation", year: "1988" },
            { title: "The Grand Budapest Hotel", description: "Whimsical escape", image: "🏨", genre: "Comedy", year: "2014" },
            { title: "Chef", description: "Feel-good food journey", image: "👨‍🍳", genre: "Comedy", year: "2014" },
            { title: "The Sound of Music", description: "Uplifting musical", image: "🎵", genre: "Musical", year: "1965" },
            { title: "Spirited Away", description: "Beautiful animated fantasy", image: "👻", genre: "Animation", year: "2001" },
            { title: "The Darjeeling Limited", description: "Quirky travel comedy", image: "🚂", genre: "Comedy", year: "2007" },
            { title: "Little Miss Sunshine", description: "Heartwarming family road trip", image: "🚐", genre: "Comedy", year: "2006" },
            { title: "The Big Lebowski", description: "Relaxed comedy", image: "🎳", genre: "Comedy", year: "1998" },
            { title: "Lost in Translation", description: "Quiet contemplative drama", image: "🌃", genre: "Drama", year: "2003" },
            { title: "Paterson", description: "Calm slice-of-life", image: "📝", genre: "Drama", year: "2016" },
            { title: "The Secret Life of Walter Mitty", description: "Adventure and self-discovery", image: "🌍", genre: "Adventure", year: "2013" }
        ],
        angry: [
            { title: "The Dark Knight", description: "Action-packed thriller", image: "🦇", genre: "Action", year: "2008" },
            { title: "John Wick", description: "Intense action", image: "🔫", genre: "Action", year: "2014" },
            { title: "Fight Club", description: "Thought-provoking drama", image: "👊", genre: "Drama", year: "1999" },
            { title: "Mad Max: Fury Road", description: "High-octane adventure", image: "🚗", genre: "Action", year: "2015" },
            { title: "Gladiator", description: "Epic historical action", image: "⚔️", genre: "Action", year: "2000" },
            { title: "The Raid", description: "Intense martial arts", image: "🥋", genre: "Action", year: "2011" },
            { title: "Django Unchained", description: "Western revenge tale", image: "🤠", genre: "Western", year: "2012" },
            { title: "Kill Bill", description: "Stylish action revenge", image: "🗡️", genre: "Action", year: "2003" },
            { title: "300", description: "Epic battle scenes", image: "🛡️", genre: "Action", year: "2006" },
            { title: "The Matrix", description: "Revolutionary action", image: "💊", genre: "Sci-Fi", year: "1999" }
        ],
        neutral: [
            { title: "The Matrix", description: "Mind-bending sci-fi", image: "💊", genre: "Sci-Fi", year: "1999" },
            { title: "Inception", description: "Complex thriller", image: "🌀", genre: "Thriller", year: "2010" },
            { title: "Interstellar", description: "Epic space journey", image: "🚀", genre: "Sci-Fi", year: "2014" },
            { title: "Blade Runner 2049", description: "Thoughtful sci-fi", image: "🤖", genre: "Sci-Fi", year: "2017" },
            { title: "The Social Network", description: "Tech drama", image: "💻", genre: "Drama", year: "2010" },
            { title: "Her", description: "AI relationship story", image: "💬", genre: "Sci-Fi", year: "2013" },
            { title: "Ex Machina", description: "AI thriller", image: "🤖", genre: "Thriller", year: "2014" },
            { title: "Arrival", description: "Linguistic sci-fi", image: "👽", genre: "Sci-Fi", year: "2016" }
        ]
    },
    songs: {
        happy: [
            { title: "Happy", artist: "Pharrell Williams", image: "😊", genre: "Pop" },
            { title: "Walking on Sunshine", artist: "Katrina & The Waves", image: "☀️", genre: "Pop" },
            { title: "Don't Stop Me Now", artist: "Queen", image: "🎸", genre: "Rock" },
            { title: "Good Vibrations", artist: "The Beach Boys", image: "🌊", genre: "Pop" },
            { title: "I Gotta Feeling", artist: "Black Eyed Peas", image: "🎉", genre: "Pop" },
            { title: "Uptown Funk", artist: "Bruno Mars", image: "🎤", genre: "Funk" },
            { title: "Can't Stop the Feeling", artist: "Justin Timberlake", image: "💃", genre: "Pop" },
            { title: "Shake It Off", artist: "Taylor Swift", image: "🎵", genre: "Pop" },
            { title: "Best Day of My Life", artist: "American Authors", image: "🌟", genre: "Indie" },
            { title: "On Top of the World", artist: "Imagine Dragons", image: "🌍", genre: "Rock" },
            { title: "September", artist: "Earth, Wind & Fire", image: "🍂", genre: "Funk" },
            { title: "Dancing Queen", artist: "ABBA", image: "👑", genre: "Pop" }
        ],
        sad: [
            { title: "Someone Like You", artist: "Adele", image: "💔", genre: "Pop" },
            { title: "Fix You", artist: "Coldplay", image: "💙", genre: "Rock" },
            { title: "Hallelujah", artist: "Jeff Buckley", image: "🎹", genre: "Folk" },
            { title: "The Sound of Silence", artist: "Simon & Garfunkel", image: "🔇", genre: "Folk" },
            { title: "Skinny Love", artist: "Bon Iver", image: "🎻", genre: "Indie" },
            { title: "All Too Well", artist: "Taylor Swift", image: "🧣", genre: "Pop" },
            { title: "Say Something", artist: "A Great Big World", image: "💭", genre: "Pop" },
            { title: "Mad World", artist: "Gary Jules", image: "🌍", genre: "Alternative" },
            { title: "Creep", artist: "Radiohead", image: "👤", genre: "Alternative" },
            { title: "Nothing Compares 2 U", artist: "Sinead O'Connor", image: "💧", genre: "Pop" }
        ],
        stressed: [
            { title: "Weightless", artist: "Marconi Union", image: "🌊", genre: "Ambient" },
            { title: "Clair de Lune", artist: "Debussy", image: "🌙", genre: "Classical" },
            { title: "Strawberry Swing", artist: "Coldplay", image: "🍓", genre: "Indie" },
            { title: "Gymnopédie No.1", artist: "Erik Satie", image: "🎹", genre: "Classical" },
            { title: "Pure Shores", artist: "All Saints", image: "🏖️", genre: "Pop" },
            { title: "Watermark", artist: "Enya", image: "💧", genre: "New Age" },
            { title: "The Four Seasons", artist: "Vivaldi", image: "🍃", genre: "Classical" },
            { title: "Moonlight Sonata", artist: "Beethoven", image: "🌙", genre: "Classical" },
            { title: "Breathe Me", artist: "Sia", image: "💨", genre: "Pop" },
            { title: "Holocene", artist: "Bon Iver", image: "🏔️", genre: "Indie" },
            { title: "River Flows in You", artist: "Yiruma", image: "🌊", genre: "Piano" },
            { title: "Comptine d'un autre été", artist: "Yann Tiersen", image: "🎹", genre: "Instrumental" }
        ],
        angry: [
            { title: "Killing in the Name", artist: "Rage Against the Machine", image: "🤘", genre: "Metal" },
            { title: "Master of Puppets", artist: "Metallica", image: "🎸", genre: "Metal" },
            { title: "Break Stuff", artist: "Limp Bizkit", image: "💥", genre: "Nu Metal" },
            { title: "Du Hast", artist: "Rammstein", image: "🔥", genre: "Industrial" },
            { title: "Bulls on Parade", artist: "Rage Against the Machine", image: "🐂", genre: "Metal" },
            { title: "Enter Sandman", artist: "Metallica", image: "😴", genre: "Metal" },
            { title: "Chop Suey!", artist: "System of a Down", image: "🥢", genre: "Metal" },
            { title: "Bleed", artist: "Meshuggah", image: "🩸", genre: "Metal" },
            { title: "Down with the Sickness", artist: "Disturbed", image: "🤒", genre: "Metal" },
            { title: "The Beautiful People", artist: "Marilyn Manson", image: "👥", genre: "Industrial" }
        ],
        neutral: [
            { title: "Bohemian Rhapsody", artist: "Queen", image: "👑", genre: "Rock" },
            { title: "Hotel California", artist: "Eagles", image: "🏨", genre: "Rock" },
            { title: "Stairway to Heaven", artist: "Led Zeppelin", image: "☁️", genre: "Rock" },
            { title: "Comfortably Numb", artist: "Pink Floyd", image: "💉", genre: "Rock" },
            { title: "Wish You Were Here", artist: "Pink Floyd", image: "👋", genre: "Rock" },
            { title: "Black", artist: "Pearl Jam", image: "⚫", genre: "Grunge" },
            { title: "The Scientist", artist: "Coldplay", image: "🔬", genre: "Rock" },
            { title: "Yellow", artist: "Coldplay", image: "💛", genre: "Rock" }
        ]
    },
    exercises: {
        stressed: [
            { title: "Deep Breathing", description: "5-minute breathing exercise", image: "🧘", duration: "5 min", difficulty: "Easy" },
            { title: "Yoga Flow", description: "Gentle yoga sequence", image: "🧘‍♀️", duration: "15 min", difficulty: "Easy" },
            { title: "Meditation", description: "Mindfulness meditation", image: "🧘‍♂️", duration: "10 min", difficulty: "Easy" },
            { title: "Stretching", description: "Full body stretch", image: "🤸", duration: "10 min", difficulty: "Easy" },
            { title: "Tai Chi", description: "Slow movement practice", image: "☯️", duration: "20 min", difficulty: "Medium" },
            { title: "Progressive Muscle Relaxation", description: "Tension release technique", image: "💆", duration: "15 min", difficulty: "Easy" },
            { title: "Yin Yoga", description: "Deep stretching and relaxation", image: "🧘", duration: "30 min", difficulty: "Easy" },
            { title: "Walking Meditation", description: "Mindful walking", image: "🚶", duration: "20 min", difficulty: "Easy" },
            { title: "Qigong", description: "Energy flow practice", image: "🌀", duration: "20 min", difficulty: "Easy" },
            { title: "Gentle Pilates", description: "Low-impact core work", image: "🤸‍♀️", duration: "25 min", difficulty: "Easy" }
        ],
        sad: [
            { title: "Light Cardio", description: "Brisk walk or jog", image: "🚶", duration: "20 min", difficulty: "Easy" },
            { title: "Dancing", description: "Free-form dancing", image: "💃", duration: "15 min", difficulty: "Easy" },
            { title: "Yoga", description: "Uplifting yoga flow", image: "🧘‍♀️", duration: "20 min", difficulty: "Medium" },
            { title: "Swimming", description: "Swim laps", image: "🏊", duration: "30 min", difficulty: "Medium" },
            { title: "Cycling", description: "Outdoor or stationary bike", image: "🚴", duration: "30 min", difficulty: "Easy" },
            { title: "Zumba", description: "Dance fitness", image: "💃", duration: "30 min", difficulty: "Easy" },
            { title: "Hiking", description: "Nature walk", image: "🥾", duration: "45 min", difficulty: "Medium" },
            { title: "Jump Rope", description: "Cardio workout", image: "🪢", duration: "15 min", difficulty: "Medium" },
            { title: "Aerobics", description: "Low-impact aerobics", image: "👟", duration: "30 min", difficulty: "Easy" }
        ],
        angry: [
            { title: "HIIT Workout", description: "High-intensity interval training", image: "💪", duration: "20 min", difficulty: "Hard" },
            { title: "Boxing", description: "Punching bag workout", image: "🥊", duration: "30 min", difficulty: "Hard" },
            { title: "Running", description: "Fast-paced run", image: "🏃", duration: "30 min", difficulty: "Medium" },
            { title: "Weight Training", description: "Strength workout", image: "🏋️", duration: "45 min", difficulty: "Hard" },
            { title: "Kickboxing", description: "Martial arts workout", image: "🥋", duration: "30 min", difficulty: "Hard" },
            { title: "CrossFit", description: "High-intensity training", image: "🔥", duration: "30 min", difficulty: "Hard" },
            { title: "Sprint Intervals", description: "High-speed running", image: "⚡", duration: "20 min", difficulty: "Hard" },
            { title: "Rowing", description: "Full-body cardio", image: "🚣", duration: "30 min", difficulty: "Hard" },
            { title: "Battle Ropes", description: "High-intensity cardio", image: "🪢", duration: "20 min", difficulty: "Hard" },
            { title: "Burpees", description: "Full-body explosive movement", image: "💥", duration: "15 min", difficulty: "Hard" }
        ],
        happy: [
            { title: "Dancing", description: "Celebrate with dance", image: "💃", duration: "20 min", difficulty: "Easy" },
            { title: "Outdoor Activities", description: "Enjoy nature", image: "🌳", duration: "60 min", difficulty: "Easy" },
            { title: "Sports", description: "Play your favorite sport", image: "⚽", duration: "60 min", difficulty: "Medium" },
            { title: "Tennis", description: "Racket sport", image: "🎾", duration: "60 min", difficulty: "Medium" },
            { title: "Basketball", description: "Team sport", image: "🏀", duration: "60 min", difficulty: "Medium" },
            { title: "Volleyball", description: "Beach or court", image: "🏐", duration: "60 min", difficulty: "Medium" },
            { title: "Rock Climbing", description: "Indoor or outdoor", image: "🧗", duration: "90 min", difficulty: "Hard" },
            { title: "Surfing", description: "Water sport", image: "🏄", duration: "120 min", difficulty: "Hard" },
            { title: "Yoga Flow", description: "Energetic yoga", image: "🧘‍♀️", duration: "30 min", difficulty: "Medium" }
        ],
        neutral: [
            { title: "Moderate Cardio", description: "Steady pace workout", image: "🚴", duration: "30 min", difficulty: "Medium" },
            { title: "Pilates", description: "Core strengthening", image: "🤸‍♀️", duration: "30 min", difficulty: "Medium" },
            { title: "Strength Training", description: "Moderate weights", image: "🏋️", duration: "45 min", difficulty: "Medium" },
            { title: "Elliptical", description: "Low-impact cardio", image: "🏃", duration: "30 min", difficulty: "Easy" },
            { title: "Rowing Machine", description: "Full-body workout", image: "🚣", duration: "30 min", difficulty: "Medium" },
            { title: "Circuit Training", description: "Mixed exercises", image: "🔄", duration: "40 min", difficulty: "Medium" },
            { title: "Barre", description: "Ballet-inspired workout", image: "🩰", duration: "45 min", difficulty: "Medium" }
        ]
    },
    activities: {
        stressed: [
            { title: "Reading", description: "Escape into a good book", image: "📚", category: "Relaxation" },
            { title: "Nature Walk", description: "Connect with nature", image: "🌲", category: "Outdoor" },
            { title: "Journaling", description: "Write your thoughts", image: "✍️", category: "Mindfulness" },
            { title: "Art & Crafts", description: "Creative expression", image: "🎨", category: "Creative" },
            { title: "Gardening", description: "Tend to plants", image: "🌱", category: "Outdoor" },
            { title: "Bath & Relax", description: "Soothing bath time", image: "🛁", category: "Self-care" },
            { title: "Listen to Podcasts", description: "Calming audio content", image: "🎧", category: "Entertainment" },
            { title: "Coloring Books", description: "Adult coloring for relaxation", image: "🖍️", category: "Creative" },
            { title: "Aromatherapy", description: "Essential oils and scents", image: "🕯️", category: "Self-care" },
            { title: "Puzzle Solving", description: "Jigsaw or crossword puzzles", image: "🧩", category: "Mental" },
            { title: "Tea Ceremony", description: "Mindful tea preparation", image: "🍵", category: "Mindfulness" },
            { title: "Stargazing", description: "Observe the night sky", image: "⭐", category: "Outdoor" }
        ],
        sad: [
            { title: "Call a Friend", description: "Connect with loved ones", image: "📞", category: "Social" },
            { title: "Watch Comedy", description: "Laugh it out", image: "😄", category: "Entertainment" },
            { title: "Cook Something", description: "Create delicious food", image: "🍳", category: "Creative" },
            { title: "Volunteer", description: "Help others", image: "🤝", category: "Social" },
            { title: "Photography", description: "Capture beauty", image: "📷", category: "Creative" },
            { title: "Write Letters", description: "Send handwritten notes", image: "✉️", category: "Social" },
            { title: "Pet Therapy", description: "Spend time with animals", image: "🐕", category: "Social" },
            { title: "Music Making", description: "Play an instrument", image: "🎹", category: "Creative" },
            { title: "Baking", description: "Create sweet treats", image: "🍰", category: "Creative" },
            { title: "Watch Stand-up", description: "Comedy specials", image: "🎤", category: "Entertainment" },
            { title: "Dance Party", description: "Move to your favorite songs", image: "💃", category: "Physical" },
            { title: "Gratitude List", description: "Write what you're thankful for", image: "🙏", category: "Mindfulness" }
        ],
        angry: [
            { title: "Punching Bag", description: "Physical release", image: "🥊", category: "Physical" },
            { title: "Loud Music", description: "Rock out", image: "🎸", category: "Entertainment" },
            { title: "Cleaning", description: "Organize your space", image: "🧹", category: "Productive" },
            { title: "Video Games", description: "Gaming session", image: "🎮", category: "Entertainment" },
            { title: "Scream Therapy", description: "Vocal release in private", image: "🗣️", category: "Physical" },
            { title: "Tearing Paper", description: "Physical destruction", image: "📄", category: "Physical" },
            { title: "Intense Workout", description: "Push your limits", image: "💪", category: "Physical" },
            { title: "Write Angry Letter", description: "Express feelings (don't send)", image: "📝", category: "Emotional" },
            { title: "Drumming", description: "Beat on drums", image: "🥁", category: "Creative" },
            { title: "Rage Room", description: "Break things safely", image: "💥", category: "Physical" },
            { title: "Competitive Sports", description: "Channel aggression", image: "🏆", category: "Physical" }
        ],
        happy: [
            { title: "Social Gathering", description: "Spend time with friends", image: "👥", category: "Social" },
            { title: "Try New Hobby", description: "Explore interests", image: "🎯", category: "Creative" },
            { title: "Travel Planning", description: "Plan your next trip", image: "✈️", category: "Planning" },
            { title: "Celebrate", description: "Enjoy the moment", image: "🎉", category: "Social" },
            { title: "Concert", description: "Live music event", image: "🎵", category: "Entertainment" },
            { title: "Adventure Sports", description: "Try something thrilling", image: "🎢", category: "Adventure" },
            { title: "Host a Party", description: "Gather people together", image: "🎊", category: "Social" },
            { title: "Creative Project", description: "Start something new", image: "🎨", category: "Creative" },
            { title: "Explore City", description: "Discover new places", image: "🏙️", category: "Adventure" },
            { title: "Learn Dance", description: "Take dance lessons", image: "💃", category: "Creative" },
            { title: "Food Adventure", description: "Try new restaurants", image: "🍽️", category: "Social" },
            { title: "Achievement Celebration", description: "Reward yourself", image: "🏅", category: "Social" }
        ],
        neutral: [
            { title: "Learn Something", description: "Online course or tutorial", image: "📖", category: "Educational" },
            { title: "Organize", description: "Declutter space", image: "📦", category: "Productive" },
            { title: "Explore", description: "Visit new places", image: "🗺️", category: "Adventure" },
            { title: "Research", description: "Deep dive into a topic", image: "🔬", category: "Educational" },
            { title: "Plan Goals", description: "Set future objectives", image: "🎯", category: "Planning" },
            { title: "Home Improvement", description: "DIY projects", image: "🔨", category: "Productive" },
            { title: "Financial Planning", description: "Budget and savings", image: "💰", category: "Planning" },
            { title: "Skill Building", description: "Develop new abilities", image: "🛠️", category: "Educational" },
            { title: "Museum Visit", description: "Cultural exploration", image: "🏛️", category: "Educational" },
            { title: "Documentary", description: "Watch informative content", image: "📺", category: "Educational" }
        ]
    },
    games: {
        happy: [
            { title: "Color Match Challenge", description: "Match colors quickly!", type: "reaction", icon: "🎨", play: "playColorMatch" },
            { title: "Bubble Pop", description: "Pop bubbles to relax", type: "casual", icon: "🫧", play: "playBubblePop" },
            { title: "Memory Match", description: "Test your memory", type: "puzzle", icon: "🧩", play: "playMemoryMatch" },
            { title: "Happy Runner", description: "Run and collect coins", type: "arcade", icon: "🏃", play: "playHappyRunner" },
            { title: "Dance Party", description: "Follow the dance moves", type: "movement", icon: "💃", play: "playDanceParty" }
        ],
        sad: [
            { title: "Zen Garden", description: "Create peaceful patterns", type: "relaxing", icon: "🌿", play: "playZenGarden" },
            { title: "Word Search", description: "Find hidden words", type: "puzzle", icon: "🔍", play: "playWordSearch" },
            { title: "Jigsaw Puzzle", description: "Piece together images", type: "puzzle", icon: "🧩", play: "playJigsaw" },
            { title: "Meditation Game", description: "Breathe and relax", type: "mindfulness", icon: "🧘", play: "playMeditation" },
            { title: "Story Builder", description: "Create your own story", type: "creative", icon: "📖", play: "playStoryBuilder" }
        ],
        stressed: [
            { title: "Stress Buster", description: "Squeeze stress away", type: "relaxing", icon: "💆", play: "playStressBuster" },
            { title: "Bubble Wrap", description: "Pop virtual bubble wrap", type: "casual", icon: "🫧", play: "playBubbleWrap" },
            { title: "Zen Coloring", description: "Color mandalas", type: "artistic", icon: "🎨", play: "playZenColoring" },
            { title: "Breathing Exercise", description: "Follow breathing patterns", type: "mindfulness", icon: "💨", play: "playBreathing" },
            { title: "Flow State", description: "Match flowing patterns", type: "relaxing", icon: "🌊", play: "playFlowState" }
        ],
        angry: [
            { title: "Punch Bag", description: "Release your energy", type: "action", icon: "🥊", play: "playPunchBag" },
            { title: "Rage Runner", description: "Run fast and break barriers", type: "arcade", icon: "💥", play: "playRageRunner" },
            { title: "Smash It", description: "Break things safely", type: "action", icon: "💢", play: "playSmashIt" },
            { title: "Speed Challenge", description: "Test your reflexes", type: "reaction", icon: "⚡", play: "playSpeedChallenge" },
            { title: "Energy Release", description: "Channel your energy", type: "movement", icon: "🔥", play: "playEnergyRelease" }
        ],
        neutral: [
            { title: "Trivia Challenge", description: "Test your knowledge", type: "quiz", icon: "🧠", play: "playTrivia" },
            { title: "Sudoku", description: "Number puzzle", type: "puzzle", icon: "🔢", play: "playSudoku" },
            { title: "2048", description: "Slide and merge tiles", type: "puzzle", icon: "🎯", play: "play2048" },
            { title: "Snake Game", description: "Classic snake", type: "arcade", icon: "🐍", play: "playSnake" },
            { title: "Tetris", description: "Stack blocks", type: "puzzle", icon: "📦", play: "playTetris" }
        ]
    },
    jokes: {
        happy: [
            { joke: "Why don't scientists trust atoms? Because they make up everything!", image: "https://picsum.photos/seed/joke1/400/300", category: "Science" },
            { joke: "I told my wife she was drawing her eyebrows too high. She looked surprised.", image: "https://picsum.photos/seed/joke2/400/300", category: "Family" },
            { joke: "Why did the scarecrow win an award? He was outstanding in his field!", image: "https://picsum.photos/seed/joke3/400/300", category: "Puns" },
            { joke: "What do you call a fake noodle? An impasta!", image: "https://picsum.photos/seed/joke4/400/300", category: "Food" },
            { joke: "Why don't eggs tell jokes? They'd crack each other up!", image: "https://picsum.photos/seed/joke5/400/300", category: "Food" },
            { joke: "What's the best thing about Switzerland? I don't know, but the flag is a big plus!", image: "https://picsum.photos/seed/joke6/400/300", category: "Geography" }
        ],
        sad: [
            { joke: "Why did the math book look so sad? Because it had too many problems!", image: "https://picsum.photos/seed/joke7/400/300", category: "Math" },
            { joke: "What do you call a bear with no teeth? A gummy bear!", image: "https://picsum.photos/seed/joke8/400/300", category: "Animals" },
            { joke: "Why don't programmers like nature? It has too many bugs!", image: "https://picsum.photos/seed/joke9/400/300", category: "Tech" },
            { joke: "What's orange and sounds like a parrot? A carrot!", image: "https://picsum.photos/seed/joke10/400/300", category: "Puns" },
            { joke: "Why did the coffee file a police report? It got mugged!", image: "https://picsum.photos/seed/joke11/400/300", category: "Food" },
            { joke: "What do you call a sleeping bull? A bulldozer!", image: "https://picsum.photos/seed/joke12/400/300", category: "Animals" }
        ],
        stressed: [
            { joke: "I'm reading a book about anti-gravity. It's impossible to put down!", image: "https://picsum.photos/seed/joke13/400/300", category: "Science" },
            { joke: "Why did the bicycle fall over? Because it was two tired!", image: "https://picsum.photos/seed/joke14/400/300", category: "Puns" },
            { joke: "What do you call a bear with no ears? B!", image: "https://picsum.photos/seed/joke15/400/300", category: "Animals" },
            { joke: "Why don't skeletons fight each other? They don't have the guts!", image: "https://picsum.photos/seed/joke16/400/300", category: "Halloween" },
            { joke: "What's a vampire's favorite fruit? A blood orange!", image: "https://picsum.photos/seed/joke17/400/300", category: "Halloween" },
            { joke: "Why did the golfer bring two pairs of pants? In case he got a hole in one!", image: "https://picsum.photos/seed/joke18/400/300", category: "Sports" }
        ],
        angry: [
            { joke: "Why don't eggs tell jokes? They'd crack each other up!", image: "https://picsum.photos/seed/joke19/400/300", category: "Food" },
            { joke: "What do you call a factory that makes okay products? A satisfactory!", image: "https://picsum.photos/seed/joke20/400/300", category: "Business" },
            { joke: "Why did the math book look so sad? Because it had too many problems!", image: "https://picsum.photos/seed/joke21/400/300", category: "Math" },
            { joke: "What's the best thing about Switzerland? I don't know, but the flag is a big plus!", image: "https://picsum.photos/seed/joke22/400/300", category: "Geography" },
            { joke: "Why don't scientists trust atoms? Because they make up everything!", image: "https://picsum.photos/seed/joke23/400/300", category: "Science" },
            { joke: "I told my wife she was drawing her eyebrows too high. She looked surprised.", image: "https://picsum.photos/seed/joke24/400/300", category: "Family" }
        ],
        neutral: [
            { joke: "Why did the scarecrow win an award? He was outstanding in his field!", image: "https://picsum.photos/seed/joke25/400/300", category: "Puns" },
            { joke: "What do you call a fake noodle? An impasta!", image: "https://picsum.photos/seed/joke26/400/300", category: "Food" },
            { joke: "Why don't programmers like nature? It has too many bugs!", image: "https://picsum.photos/seed/joke27/400/300", category: "Tech" },
            { joke: "What's orange and sounds like a parrot? A carrot!", image: "https://picsum.photos/seed/joke28/400/300", category: "Puns" },
            { joke: "Why did the coffee file a police report? It got mugged!", image: "https://picsum.photos/seed/joke29/400/300", category: "Food" },
            { joke: "What do you call a sleeping bull? A bulldozer!", image: "https://picsum.photos/seed/joke30/400/300", category: "Animals" }
        ]
    }
};

// Music Player State
let musicPlayer = {
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    currentIndex: 0,
    audio: null
};

// Dance/Movement State
let danceMode = {
    active: false,
    moveCount: 0,
    energyLevel: 0,
    videoStream: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        setupNavigation();
        setupDetectionControls();
        setupTypingTest();
        loadDashboard();
        
    // Make functions globally accessible
    window.toggleGuide = toggleGuide;
    window.toggleMusicPlayer = toggleMusicPlayer;
    window.toggleDanceZone = toggleDanceZone;
    window.playSong = playSong;
    window.playSongInline = playSongInline;
    window.togglePlayPause = togglePlayPause;
    window.toggleInlinePlay = toggleInlinePlay;
    window.previousTrack = previousTrack;
    window.nextTrack = nextTrack;
    window.startDanceMode = startDanceMode;
    window.stopDanceMode = stopDanceMode;
    window.startInlineGame = startInlineGame;
    window.closeInlineGame = closeInlineGame;
    window.shareJoke = shareJoke;
        
        // Show guide by default
        const guideElement = document.getElementById('ai-guide');
        if (guideElement) {
            guideElement.style.display = 'block';
        }
        
        // Pre-load face model in background (wait for libraries to load)
        setTimeout(async () => {
            try {
                if (typeof addGuideMessage === 'function') {
                    addGuideMessage("Initializing advanced AI facial recognition system...", "info");
                }
                await initializeFaceModel();
            } catch (error) {
                console.error('Failed to initialize face model:', error);
            }
        }, 2000); // Give libraries time to load
    } catch (error) {
        console.error('App initialization error:', error);
    }
}

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            switchPage(page);
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
}

// Detection Controls
function setupDetectionControls() {
    document.getElementById('start-detection').addEventListener('click', startDetection);
}

// AI Guide Functions
function toggleGuide() {
    try {
        guideVisible = !guideVisible;
        const guide = document.getElementById('ai-guide');
        if (guide) {
            guide.style.display = guideVisible ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Toggle guide error:', error);
    }
}

function addGuideMessage(text, type = 'info') {
    try {
        const messagesContainer = document.getElementById('guide-messages');
        if (!messagesContainer) {
            console.warn('Guide messages container not found');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `guide-message ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'warning' ? 'fa-exclamation-triangle' : 
                     type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
        
        messageDiv.innerHTML = `
            <i class="fas ${icon}"></i>
            <p>${text}</p>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Auto-remove after 5 seconds for info messages
        if (type === 'info') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    } catch (error) {
        console.error('Add guide message error:', error);
    }
}

async function startDetection() {
    detectionActive = true;
    document.getElementById('start-detection').disabled = true;
    document.getElementById('typing-input').disabled = false;
    document.getElementById('typing-input').focus();

    // Show AI guide message
    addGuideMessage("Great! Starting detection now. Please allow camera and microphone access when prompted.", "info");
    
    // Initialize face model if not already loaded
    if (!faceModel) {
        addGuideMessage("Loading advanced facial recognition...", "info");
        await initializeFaceModel();
    }
    
    // Reset typing stats
    typingStats = {
        keystrokes: [],
        errors: 0,
        backspaces: 0,
        lastKeyTime: null
    };
    
    // Reset expression history
    expressionHistory = [];
    facialExpressions = [];

    // Start camera
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        const video = document.getElementById('video');
        video.srcObject = videoStream;
        updateStatus('camera-status', 'Active', true);
        startFacialAnalysis();
        addGuideMessage("Camera activated! Facial recognition is analyzing your expressions. Start typing!", "success");
    } catch (error) {
        console.error('Camera error:', error);
        updateStatus('camera-status', 'Error', false);
        addGuideMessage("Camera access denied. Don't worry, we can still analyze your mood using typing and voice!", "warning");
    }

    // Start microphone
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        updateStatus('mic-status', 'Active', true);
        startVoiceAnalysis();
    } catch (error) {
        console.error('Microphone error:', error);
        updateStatus('mic-status', 'Error', false);
        addGuideMessage("Microphone access denied. We'll use typing analysis instead!", "warning");
    }

    // Reset typing test
    typingStartTime = Date.now();
    document.getElementById('typing-input').value = '';
    // Reset prompt display
    const promptElement = document.getElementById('typing-prompt');
    if (originalPromptText) {
        promptElement.textContent = originalPromptText;
    }
    updateTypingStats();

    // Start auto-stop timer (30 seconds)
    startAutoStopTimer();
    addGuideMessage("Detection will stop automatically in 30 seconds. Keep typing!", "info");
}

function startAutoStopTimer() {
    let timeLeft = 30;
    const timerDisplay = document.getElementById('timer-display');
    const timerText = document.getElementById('timer-text');
    
    timerDisplay.style.display = 'flex';
    timerText.textContent = timeLeft;

    countdownTimer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerDisplay.style.color = '#ff1744';
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            addGuideMessage("Time's up! Analyzing your mood and stress level now...", "info");
            setTimeout(() => {
                stopDetection();
            }, 500);
        }
    }, 1000);
}

function stopDetection() {
    detectionActive = false;
    document.getElementById('start-detection').disabled = false;
    document.getElementById('typing-input').disabled = true;

    // Clear timers
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    if (autoStopTimer) {
        clearTimeout(autoStopTimer);
        autoStopTimer = null;
    }
    
    document.getElementById('timer-display').style.display = 'none';

    // Stop camera
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    updateStatus('camera-status', 'Stopped', false);

    // Stop microphone
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
    }
    updateStatus('mic-status', 'Stopped', false);

    // Analyze and show results
    analyzeAndShowResults();
}

function updateStatus(elementId, text, active) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    const card = element.closest('.status-card');
    if (active) {
        card.classList.add('active');
    } else {
        card.classList.remove('active');
    }
}

// Advanced Facial Expression Analysis
async function initializeFaceModel() {
    try {
        // Check if library is loaded
        if (typeof faceLandmarksDetection === 'undefined') {
            console.warn('Face landmarks detection library not loaded');
            return false;
        }
        
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
            runtime: 'tfjs',
            refineLandmarks: true,
            maxFaces: 1,
        };
        faceModel = await faceLandmarksDetection.createDetector(model, detectorConfig);
        console.log('Face model loaded successfully');
        if (typeof addGuideMessage === 'function') {
            addGuideMessage("Facial recognition model loaded successfully!", "success");
        }
        return true;
    } catch (error) {
        console.error('Face model initialization error:', error);
        if (typeof addGuideMessage === 'function') {
            addGuideMessage("Using basic facial analysis (advanced model unavailable)", "warning");
        }
        return false;
    }
}

function startFacialAnalysis() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    if (!video || !canvas) {
        console.error('Video or canvas element not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    
    expressionHistory = [];
    facialExpressions = [];
    let isAnalyzing = false;

    async function analyzeFrame() {
        if (!detectionActive || !videoStream || isAnalyzing) {
            requestAnimationFrame(analyzeFrame);
            return;
        }

        // Check if video is ready
        if (video.readyState < 2) {
            requestAnimationFrame(analyzeFrame);
            return;
        }

        try {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;

            // Draw video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            isAnalyzing = true;

            if (faceModel && typeof faceModel.estimateFaces === 'function') {
                try {
                    // Use TensorFlow.js face detection
                    const faces = await faceModel.estimateFaces(video, {
                        flipHorizontal: false,
                        staticImageMode: false
                    });

                    if (faces && faces.length > 0) {
                        const face = faces[0];
                        
                        // Draw face mesh
                        ctx.strokeStyle = '#ff1744';
                        ctx.lineWidth = 2;
                        
                        // Handle different keypoint formats
                        let keypoints = face.keypoints || face.landmarks || [];
                        
                        if (keypoints.length > 0) {
                            // Analyze facial landmarks for expression
                            const expression = analyzeFacialExpression(keypoints, canvas.width, canvas.height);
                            expressionHistory.push(expression);
                            
                            // Keep only last 30 frames
                            if (expressionHistory.length > 30) {
                                expressionHistory.shift();
                            }
                            
                            // Draw key points
                            keypoints.slice(0, 10).forEach((point) => {
                                const x = point.x || (point.xMin !== undefined ? point.xMin : 0);
                                const y = point.y || (point.yMin !== undefined ? point.yMin : 0);
                                if (x && y) {
                                    ctx.beginPath();
                                    ctx.arc(x, y, 3, 0, 2 * Math.PI);
                                    ctx.fillStyle = '#ff1744';
                                    ctx.fill();
                                }
                            });
                        }
                        
                        // Draw face box
                        if (face.box) {
                            ctx.strokeRect(face.box.xMin, face.box.yMin, 
                                         face.box.width, face.box.height);
                        } else if (face.boundingBox) {
                            const box = face.boundingBox;
                            ctx.strokeRect(box.xMin, box.yMin, 
                                         box.width, box.height);
                        }
                    }
                } catch (faceError) {
                    console.error('Face detection error:', faceError);
                    // Fallback to basic analysis
                    analyzeBasicFacialFeatures(ctx, canvas.width, canvas.height);
                }
            } else {
                // Fallback: Basic face detection using image analysis
                analyzeBasicFacialFeatures(ctx, canvas.width, canvas.height);
            }
        } catch (error) {
            console.error('Frame analysis error:', error);
        } finally {
            isAnalyzing = false;
            requestAnimationFrame(analyzeFrame);
        }
    }

    // Start analysis when video is ready
    if (video.readyState >= 2) {
        analyzeFrame();
    } else {
        video.addEventListener('loadedmetadata', () => {
            analyzeFrame();
        }, { once: true });
    }
}

// Analyze facial expression from landmarks
function analyzeFacialExpression(keypoints, width, height) {
    if (!keypoints || !Array.isArray(keypoints) || keypoints.length < 10) {
        return { mood: 'neutral', confidence: 0.3, smile: 0.5, eyeOpenness: 0.7, stressIndicator: 0.5 };
    }

    try {
        // Normalize keypoints - handle different formats
        const normalizedPoints = keypoints.map(kp => {
            if (typeof kp === 'object') {
                return {
                    x: kp.x || kp.xMin || 0,
                    y: kp.y || kp.yMin || 0
                };
            }
            return { x: 0, y: 0 };
        }).filter(kp => kp.x > 0 && kp.y > 0);

        if (normalizedPoints.length < 10) {
            return { mood: 'neutral', confidence: 0.3, smile: 0.5, eyeOpenness: 0.7, stressIndicator: 0.5 };
        }

        // Get mouth region points (indices vary by model, use geometric approach)
        const centerY = normalizedPoints.reduce((sum, p) => sum + p.y, 0) / normalizedPoints.length;
        const mouthPoints = normalizedPoints.filter(p => p.y > centerY * 0.9 && p.y < centerY * 1.1);
        const eyePoints = normalizedPoints.filter(p => p.y < centerY * 0.7);
        
        // Calculate mouth curvature (smile detection)
        let smileScore = 0.5;
        if (mouthPoints.length >= 4) {
            // Sort by x position
            const sortedMouth = [...mouthPoints].sort((a, b) => a.x - b.x);
            const leftCorner = sortedMouth[0];
            const rightCorner = sortedMouth[sortedMouth.length - 1];
            const mouthWidth = Math.abs(rightCorner.x - leftCorner.x);
            
            // Find middle points
            const middlePoints = sortedMouth.slice(1, -1);
            const avgMiddleY = middlePoints.reduce((sum, p) => sum + p.y, 0) / middlePoints.length;
            const avgCornerY = (leftCorner.y + rightCorner.y) / 2;
            const mouthHeight = Math.abs(avgMiddleY - avgCornerY);
            
            // Smile: wider mouth relative to height, corners higher than middle
            if (mouthHeight > 0) {
                const mouthRatio = mouthWidth / mouthHeight;
                const cornerElevation = (avgCornerY < avgMiddleY) ? 1 : 0.5;
                smileScore = Math.min(1, Math.max(0, (mouthRatio / 3) * cornerElevation));
            }
        }
        
        // Calculate eye openness
        let eyeOpenness = 0.7;
        if (eyePoints.length >= 4) {
            const eyeYVariance = eyePoints.reduce((sum, p) => {
                const avgY = eyePoints.reduce((s, p2) => s + p2.y, 0) / eyePoints.length;
                return sum + Math.pow(p.y - avgY, 2);
            }, 0) / eyePoints.length;
            eyeOpenness = Math.min(1, Math.max(0.3, eyeYVariance / (height * 0.01)));
        }
        
        // Calculate stress indicator (eyebrow position)
        const eyebrowPoints = normalizedPoints.filter(p => p.y < centerY * 0.5);
        let stressIndicator = 0.5;
        if (eyebrowPoints.length >= 2) {
            const avgEyebrowY = eyebrowPoints.reduce((sum, p) => sum + p.y, 0) / eyebrowPoints.length;
            // Lower eyebrows = more stress
            stressIndicator = Math.min(1, Math.max(0, (avgEyebrowY - height * 0.15) / (height * 0.2)));
        }
        
        // Determine mood from facial features
        let mood = 'neutral';
        let confidence = 0.5;
        
        if (smileScore > 0.65) {
            mood = 'happy';
            confidence = smileScore;
        } else if (smileScore < 0.35 && stressIndicator > 0.65) {
            mood = 'stressed';
            confidence = stressIndicator;
        } else if (smileScore < 0.35 && eyeOpenness < 0.5) {
            mood = 'sad';
            confidence = 0.7;
        } else if (stressIndicator > 0.65) {
            mood = 'stressed';
            confidence = stressIndicator;
        } else if (smileScore > 0.5) {
            mood = 'happy';
            confidence = smileScore * 0.8;
        }
        
        return {
            mood,
            confidence: Math.max(0.3, Math.min(1, confidence)),
            smile: Math.max(0, Math.min(1, smileScore)),
            eyeOpenness: Math.max(0.3, Math.min(1, eyeOpenness)),
            stressIndicator: Math.max(0, Math.min(1, stressIndicator))
        };
    } catch (error) {
        console.error('Expression analysis error:', error);
        return { mood: 'neutral', confidence: 0.3, smile: 0.5, eyeOpenness: 0.7, stressIndicator: 0.5 };
    }
}

// Fallback: Basic facial feature analysis using image data
function analyzeBasicFacialFeatures(ctx, width, height) {
    try {
        if (!ctx || width <= 0 || height <= 0) {
            return;
        }
        
        const imageData = ctx.getImageData(0, 0, width, height);
        if (!imageData || !imageData.data) {
            return;
        }
        
        const data = imageData.data;
        
        // Simple brightness analysis in face region (center)
        const faceRegion = {
            x: Math.floor(width * 0.25),
            y: Math.floor(height * 0.25),
            w: Math.floor(width * 0.5),
            h: Math.floor(height * 0.5)
        };
        
        let totalBrightness = 0;
        let pixelCount = 0;
        
        for (let y = faceRegion.y; y < faceRegion.y + faceRegion.h && y < height; y += 5) {
            for (let x = faceRegion.x; x < faceRegion.x + faceRegion.w && x < width; x += 5) {
                const idx = (y * width + x) * 4;
                if (idx + 2 < data.length) {
                    const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                    totalBrightness += brightness;
                    pixelCount++;
                }
            }
        }
        
        if (pixelCount === 0) {
            return;
        }
        
        const avgBrightness = totalBrightness / pixelCount;
        
        // Store basic expression data
        expressionHistory.push({
            mood: avgBrightness > 150 ? 'happy' : 'neutral',
            confidence: 0.4,
            smile: Math.min(1, avgBrightness / 255),
            eyeOpenness: 0.7,
            stressIndicator: Math.min(1, (255 - avgBrightness) / 255)
        });
        
        if (expressionHistory.length > 30) {
            expressionHistory.shift();
        }
        
        // Draw basic face box
        ctx.strokeStyle = '#ff1744';
        ctx.lineWidth = 3;
        ctx.strokeRect(faceRegion.x, faceRegion.y, faceRegion.w, faceRegion.h);
    } catch (error) {
        console.error('Basic facial analysis error:', error);
    }
}

// Voice Analysis (simplified)
function startVoiceAnalysis() {
    if (!audioStream) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(audioStream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function analyze() {
        if (!detectionActive) return;

        analyser.getByteFrequencyData(dataArray);
        // Simple analysis - calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        // Store for later analysis
        window.voiceData = window.voiceData || [];
        window.voiceData.push(average);

        requestAnimationFrame(analyze);
    }

    analyze();
}

// Typing Speed Test
let typingStats = {
    keystrokes: [],
    errors: 0,
    backspaces: 0,
    lastKeyTime: null
};
let originalPromptText = '';

function setupTypingTest() {
    const typingInput = document.getElementById('typing-input');
    const prompt = document.getElementById('typing-prompt');
    originalPromptText = prompt.textContent;
    let lastValue = '';

    // Highlight prompt text based on typing
    function highlightPrompt() {
        const input = typingInput.value;
        let highlighted = '';
        for (let i = 0; i < originalPromptText.length; i++) {
            if (i < input.length) {
                if (input[i] === originalPromptText[i]) {
                    highlighted += `<span style="color: #4caf50;">${originalPromptText[i]}</span>`;
                } else {
                    highlighted += `<span style="color: #ff1744; background: rgba(255,23,68,0.2);">${originalPromptText[i]}</span>`;
                }
            } else {
                highlighted += originalPromptText[i];
            }
        }
        prompt.innerHTML = highlighted;
    }

    typingInput.addEventListener('input', (e) => {
        const currentValue = e.target.value;
        
        // Track backspaces
        if (currentValue.length < lastValue.length) {
            typingStats.backspaces++;
        }
        
        // Track keystroke timing for more accurate WPM
        const now = Date.now();
        if (typingStats.lastKeyTime) {
            const timeSinceLastKey = now - typingStats.lastKeyTime;
            typingStats.keystrokes.push(timeSinceLastKey);
        }
        typingStats.lastKeyTime = now;
        
        // Update visual feedback
        highlightPrompt();
        
        lastValue = currentValue;
        updateTypingStats();
    });

    typingInput.addEventListener('keydown', (e) => {
        // Track errors (when user presses wrong key)
        if (e.key.length === 1 && typingInput.value.length < originalPromptText.length) {
            const expectedChar = originalPromptText[typingInput.value.length];
            if (e.key !== expectedChar && e.key !== 'Backspace') {
                typingStats.errors++;
            }
        }
    });
}

function updateTypingStats() {
    const input = document.getElementById('typing-input').value;
    const prompt = originalPromptText || document.getElementById('typing-prompt').textContent;
    
    if (!typingStartTime || !input) {
        document.getElementById('typing-speed').textContent = '0';
        document.getElementById('typing-accuracy').textContent = '0';
        return;
    }

    // More accurate WPM calculation
    const timeElapsed = (Date.now() - typingStartTime) / 1000 / 60; // minutes
    
    // Calculate WPM based on characters typed (standard: 5 characters = 1 word)
    const charactersTyped = input.length;
    const wordsTyped = charactersTyped / 5;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

    // Calculate accuracy more precisely
    let correctChars = 0;
    const minLength = Math.min(input.length, prompt.length);
    
    for (let i = 0; i < minLength; i++) {
        if (input[i] === prompt[i]) {
            correctChars++;
        }
    }
    
    // Account for extra characters as errors
    const totalChars = Math.max(input.length, prompt.length);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    // Calculate consistency (variation in typing speed)
    let consistency = 100;
    if (typingStats.keystrokes.length > 5) {
        const avgKeystrokeTime = typingStats.keystrokes.reduce((a, b) => a + b, 0) / typingStats.keystrokes.length;
        const variance = typingStats.keystrokes.reduce((sum, time) => {
            return sum + Math.pow(time - avgKeystrokeTime, 2);
        }, 0) / typingStats.keystrokes.length;
        const stdDev = Math.sqrt(variance);
        consistency = Math.max(0, Math.min(100, 100 - (stdDev / avgKeystrokeTime * 100)));
    }

    document.getElementById('typing-speed').textContent = wpm;
    document.getElementById('typing-accuracy').textContent = accuracy;

    // Store typing data with more metrics
    window.typingData = {
        wpm,
        accuracy,
        consistency,
        errors: typingStats.errors,
        backspaces: typingStats.backspaces,
        timeElapsed: (Date.now() - typingStartTime) / 1000,
        keystrokeVariance: typingStats.keystrokes.length > 0 
            ? typingStats.keystrokes.reduce((sum, time) => sum + Math.pow(time - (typingStats.keystrokes.reduce((a, b) => a + b, 0) / typingStats.keystrokes.length), 2), 0) / typingStats.keystrokes.length
            : 0
    };
}

// Call Python AI Backend for advanced analysis
async function callAIBackend(facialData, typingData, voiceData) {
    try {
        const response = await fetch("https://ai-mood-detector-backend-production.up.railway.app/api/analyze")
, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                facial: facialData,
                typing: typingData,
                voice: voiceData
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.result;
            }
        }
    } catch (error) {
        console.log('AI Backend not available, using local analysis:', error);
    }
    return null;
}

// AI Mood Detection - Advanced Algorithm
async function analyzeAndShowResults() {
    const typingData = window.typingData || { wpm: 0, accuracy: 0, consistency: 100, errors: 0, backspaces: 0, keystrokeVariance: 0 };
    const voiceData = window.voiceData || [];
    const avgVoiceLevel = voiceData.length > 0 
        ? voiceData.reduce((a, b) => a + b, 0) / voiceData.length 
        : 50;
    
    // Calculate voice variance (indicator of stress)
    const voiceVariance = voiceData.length > 1
        ? voiceData.reduce((sum, val) => sum + Math.pow(val - avgVoiceLevel, 2), 0) / voiceData.length
        : 0;

    // Analyze facial expressions (HIGHEST PRIORITY - 50% weight)
    let facialMood = 'neutral';
    let facialConfidence = 0;
    let avgSmile = 0;
    let avgStressIndicator = 0;
    
    if (expressionHistory.length > 0) {
        // Calculate average facial expression metrics
        const totalExpressions = expressionHistory.length;
        const moodCounts = {};
        let totalSmile = 0;
        let totalStress = 0;
        let totalConfidence = 0;
        
        expressionHistory.forEach(expr => {
            moodCounts[expr.mood] = (moodCounts[expr.mood] || 0) + expr.confidence;
            totalSmile += expr.smile || 0;
            totalStress += expr.stressIndicator || 0;
            totalConfidence += expr.confidence || 0;
        });
        
        avgSmile = totalSmile / totalExpressions;
        avgStressIndicator = totalStress / totalExpressions;
        facialConfidence = totalConfidence / totalExpressions;
        
        // Determine dominant facial mood
        const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
        );
        facialMood = dominantMood;
        
        // If smiling consistently, prioritize happy
        if (avgSmile > 0.6 && expressionHistory.filter(e => e.mood === 'happy').length > totalExpressions * 0.5) {
            facialMood = 'happy';
            facialConfidence = Math.max(facialConfidence, avgSmile);
        }
        
        // If high stress indicators consistently, prioritize stressed
        if (avgStressIndicator > 0.7 && expressionHistory.filter(e => e.mood === 'stressed').length > totalExpressions * 0.4) {
            facialMood = 'stressed';
            facialConfidence = Math.max(facialConfidence, avgStressIndicator);
        }
    }

    // Determine mood based on multiple factors with weighted scoring
    // Facial expressions: 50%, Typing: 30%, Voice: 20%
    let mood = 'neutral';
    let stressLevel = 50;
    let moodScores = {
        happy: 0,
        sad: 0,
        stressed: 0,
        angry: 0,
        neutral: 0
    };
    
    // FACE ANALYSIS (50% weight) - HIGHEST PRIORITY
    if (expressionHistory.length > 0 && facialConfidence > 0.2) {
        const faceWeight = Math.min(0.5, facialConfidence * 0.6); // Up to 50% weight
        moodScores[facialMood] += faceWeight * 12;
        
        // Strong smile detection - boost happy significantly
        if (avgSmile > 0.65) {
            moodScores.happy += faceWeight * 15;
            moodScores.stressed = Math.max(0, moodScores.stressed - faceWeight * 8); // Strongly reduce stress
            stressLevel = Math.max(0, stressLevel - (avgSmile * 25)); // Reduce stress level
        } else if (avgSmile > 0.5) {
            moodScores.happy += faceWeight * 8;
            moodScores.stressed = Math.max(0, moodScores.stressed - faceWeight * 4);
            stressLevel = Math.max(0, stressLevel - (avgSmile * 15));
        }
        
        // Stress indicator - only if smile is low
        if (avgStressIndicator > 0.75 && avgSmile < 0.4) {
            moodScores.stressed += faceWeight * 8;
            stressLevel += avgStressIndicator * 12;
        } else if (avgStressIndicator > 0.6 && avgSmile < 0.5) {
            moodScores.stressed += faceWeight * 4;
            stressLevel += avgStressIndicator * 8;
        }
    }

    // TYPING ANALYSIS (30% weight) - Secondary priority
    const typingWeight = 0.3;
    
    // Only add stress for very slow typing (might indicate stress)
    if (typingData.wpm < 10 && typingData.timeElapsed > 5) {
        stressLevel += 10;
        moodScores.stressed += 1.5 * typingWeight;
    } else if (typingData.wpm < 20 && typingData.timeElapsed > 10) {
        stressLevel += 5;
        moodScores.stressed += 0.8 * typingWeight;
    } 
    // Fast typing indicates positive mood
    else if (typingData.wpm > 60) {
        stressLevel -= 15;
        moodScores.happy += 2.5 * typingWeight;
    } else if (typingData.wpm > 40) {
        stressLevel -= 8;
        moodScores.happy += 1.5 * typingWeight;
    }
    // Normal typing speed (30-50 WPM) doesn't indicate stress
    else if (typingData.wpm >= 25 && typingData.wpm <= 55) {
        // Neutral - no stress addition for normal typing
        moodScores.happy += 0.3 * typingWeight;
    }

    // Typing accuracy - only penalize very low accuracy
    if (typingData.accuracy < 50 && typingData.timeElapsed > 5) {
        stressLevel += 8;
        moodScores.stressed += 0.8 * typingWeight;
    } else if (typingData.accuracy < 70 && typingData.timeElapsed > 10) {
        stressLevel += 3;
        moodScores.stressed += 0.3 * typingWeight;
    } else if (typingData.accuracy >= 90) {
        stressLevel -= 5;
        moodScores.happy += 0.8 * typingWeight;
    }

    // Typing consistency - only penalize very inconsistent typing
    if (typingData.consistency < 50 && typingData.timeElapsed > 5) {
        stressLevel += 5;
        moodScores.stressed += 0.5 * typingWeight;
    } else if (typingData.consistency >= 80) {
        stressLevel -= 3;
        moodScores.happy += 0.5 * typingWeight;
    }

    // Errors and backspaces - only penalize high error rates
    const errorRate = typingData.errors / Math.max(typingData.timeElapsed, 1) * 60;
    if (errorRate > 8 && typingData.timeElapsed > 5) {
        stressLevel += 5;
        moodScores.stressed += 0.5 * typingWeight;
    } else if (errorRate < 1 && typingData.timeElapsed > 5) {
        stressLevel -= 3;
        moodScores.happy += 0.3 * typingWeight;
    }

    const backspaceRate = typingData.backspaces / Math.max(typingData.timeElapsed, 1) * 60;
    if (backspaceRate > 15 && typingData.timeElapsed > 5) {
        stressLevel += 3;
        moodScores.stressed += 0.3 * typingWeight;
    }

    // VOICE ANALYSIS (20% weight) - Lowest priority
    const voiceWeight = 0.2;
    
    // Only add stress for extreme voice levels
    if (avgVoiceLevel > 150 && voiceData.length > 10) {
        stressLevel += 5;
        moodScores.angry += 1 * voiceWeight;
    } else if (avgVoiceLevel > 120 && voiceData.length > 10) {
        stressLevel += 3;
        moodScores.stressed += 0.3 * voiceWeight;
    } 
    // Very quiet might indicate sadness, not stress
    else if (avgVoiceLevel < 15 && voiceData.length > 10) {
        moodScores.sad += 0.8 * voiceWeight;
        stressLevel += 2;
    }
    // Normal voice levels (40-100) don't indicate stress
    else if (avgVoiceLevel >= 40 && avgVoiceLevel <= 100) {
        // Neutral - no stress addition
        moodScores.happy += 0.2 * voiceWeight;
    }

    // Voice variance - only penalize extreme variance
    if (voiceVariance > 800 && voiceData.length > 10) {
        stressLevel += 3;
        moodScores.stressed += 0.3 * voiceWeight;
    }
    
    // FACIAL EXPRESSION OVERRIDE - If face shows strong emotion, override other signals
    if (facialConfidence > 0.6) {
        // Strong facial expression detected - prioritize it
        if (facialMood === 'happy' && avgSmile > 0.7) {
            moodScores.happy += 5; // Strong boost
            moodScores.stressed = Math.max(0, moodScores.stressed - 3); // Reduce stress
            stressLevel = Math.max(0, stressLevel - 20); // Significant stress reduction
        } else if (facialMood === 'stressed' && avgStressIndicator > 0.75) {
            moodScores.stressed += 3;
            stressLevel += 15;
        }
    }

    // Determine final mood based on scores
    const maxScore = Math.max(...Object.values(moodScores));
    if (maxScore > 0) {
        mood = Object.keys(moodScores).find(key => moodScores[key] === maxScore);
    }

    // Normalize stress level
    stressLevel = Math.max(0, Math.min(100, stressLevel));

    // FINAL MOOD DETERMINATION - Prioritize facial expressions and mood scores
    // First, check mood scores to see which has the highest value
    const maxMoodScore = Math.max(...Object.values(moodScores));
    const topMood = Object.keys(moodScores).find(key => moodScores[key] === maxMoodScore);
    
    // If facial expression data exists and is confident, prioritize it
    if (expressionHistory.length > 5 && facialConfidence > 0.4) {
        // Strong smile detection - highest priority
        if (avgSmile > 0.65) {
            mood = 'happy';
            stressLevel = Math.max(0, Math.min(100, stressLevel - (avgSmile * 40))); // Strong stress reduction
        }
        // Strong stress indicators
        else if (avgStressIndicator > 0.75 && avgSmile < 0.4) {
            mood = 'stressed';
            stressLevel = Math.min(100, stressLevel + (avgStressIndicator * 15));
        }
        // Use facial mood if it's confident
        else if (facialConfidence > 0.5) {
            mood = facialMood;
            // Adjust stress level based on facial mood
            if (facialMood === 'happy') {
                stressLevel = Math.max(0, stressLevel - 20);
            } else if (facialMood === 'stressed') {
                stressLevel = Math.min(100, stressLevel + 10);
            }
        }
        // Use top mood from scores
        else if (maxMoodScore > 0.5) {
            mood = topMood;
        }
    } else {
        // No facial data or low confidence - use mood scores and stress level
        if (maxMoodScore > 1) {
            mood = topMood;
        } else {
            // Fallback to stress level thresholds (more balanced)
            if (stressLevel > 80) {
                mood = 'stressed';
            } else if (stressLevel > 65 && moodScores.stressed > moodScores.happy) {
                mood = 'stressed';
            } else if (stressLevel < 20) {
                mood = 'happy';
            } else if (stressLevel < 35 && moodScores.happy > moodScores.stressed) {
                mood = 'happy';
            } else {
                // Use the mood with highest score, default to neutral
                mood = maxMoodScore > 0.3 ? topMood : 'neutral';
            }
        }
    }
    
    // Final override: Strong smile always wins
    if (avgSmile > 0.7 && expressionHistory.length > 5) {
        mood = 'happy';
        stressLevel = Math.max(0, Math.min(100, stressLevel - 30));
    }
    
    // Ensure mood is not always stressed - if stress level is moderate and no strong indicators, use neutral or happy
    if (mood === 'stressed' && stressLevel < 55 && avgSmile > 0.5) {
        mood = 'happy';
        stressLevel = Math.max(0, stressLevel - 15);
    }

    // Try to use Python AI backend for enhanced analysis
    const aiResult = await callAIBackend(
        { avgSmile, avgStressIndicator, facialConfidence },
        typingData,
        { avgVoiceLevel, voiceVariance }
    );
    
    // Use AI result if available and confident
    if (aiResult && aiResult.confidence > 0.6) {
        mood = aiResult.mood;
        stressLevel = aiResult.stressLevel;
        console.log('AI Analysis:', aiResult);
    }

    // Display results
    const moodText = mood.charAt(0).toUpperCase() + mood.slice(1);
    document.getElementById('mood-result').textContent = moodText;
    document.getElementById('stress-result').textContent = `${Math.round(stressLevel)}%`;
    document.getElementById('results').classList.remove('hidden');

    // AI Guide feedback
    addGuideMessage(`Analysis complete! Your mood is ${moodText} and stress level is ${Math.round(stressLevel)}%.`, "success");
    if (stressLevel > 70) {
        addGuideMessage("Your stress level is high. I've recommended some calming activities for you!", "warning");
    } else if (stressLevel < 30) {
        addGuideMessage("Great! You're feeling relaxed. Check out the fun recommendations below!", "success");
    }

    // Show recommendations
    showRecommendations(mood, stressLevel);

    // Save to history
    saveToHistory(mood, stressLevel);

    // Reset data
    window.typingData = null;
    window.voiceData = [];
    typingStats = {
        keystrokes: [],
        errors: 0,
        backspaces: 0,
        lastKeyTime: null
    };
}

// Recommendations
function showRecommendations(mood, stressLevel) {
    document.getElementById('recommendations').classList.remove('hidden');
    
    // Save mood for music player
    localStorage.setItem('lastMood', mood);
    
    // Set default tab
    switchTab('movies', mood);

    // Setup tab switching with smooth transitions
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            // Add smooth transition
            const contentGrid = document.getElementById('content-grid');
            contentGrid.style.opacity = '0';
            contentGrid.style.transform = 'translateY(20px)';
            
            setTimeout(async () => {
                await switchTab(tab, mood);
                contentGrid.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                contentGrid.style.opacity = '1';
                contentGrid.style.transform = 'translateY(0)';
            }, 200);
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Get image URL based on content type and title - Using better APIs
function getImageUrl(type, title, artist = null, index = 0) {
    // Create unique hash for consistent images
    const hash = title.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    // Movie poster images - using themed images
    if (type === 'movies') {
        const movieTitle = encodeURIComponent(title);
        // Using Picsum with movie theme
        return `https://picsum.photos/seed/${Math.abs(hash)}/400/300`;
    }
    
    // Song/Album artwork - using music-themed images
    if (type === 'songs') {
        const searchTerm = artist ? `${artist}-${title}` : title;
        const songHash = searchTerm.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        return `https://picsum.photos/seed/${Math.abs(songHash + 1000)}/400/300`;
    }
    
    // Exercises and activities - using themed Unsplash
    const term = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `https://source.unsplash.com/400x300/?${term},${type}&sig=${Math.abs(hash)}`;
}

// Get game images
function getGameImage(gameTitle, index) {
    const hash = gameTitle.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return `https://picsum.photos/seed/game${Math.abs(hash + index * 100)}/400/300`;
}

// Enhanced image loading with fallback
function loadImageWithFallback(url, title, type) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => {
            // Fallback to themed placeholder
            const fallback = type === 'movies' 
                ? `https://via.placeholder.com/400x300/ff1744/ffffff?text=${encodeURIComponent(title)}`
                : `https://source.unsplash.com/400x300/?${type}&sig=${Date.now()}`;
            resolve(fallback);
        };
        img.src = url;
    });
}

async function switchTab(tab, mood) {
    const contentGrid = document.getElementById('content-grid');
    const content = contentDatabase[tab][mood] || contentDatabase[tab]['neutral'] || [];
    
    // Special handling for games - inline playable games with images
    if (tab === 'games') {
        contentGrid.innerHTML = content.map((item, index) => {
            const gameImage = getGameImage(item.title, index);
            return `
                <div class="content-item game-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="content-image" style="background-image: url('${gameImage}');">
                        <div class="image-overlay"></div>
                        <button class="play-game-btn" onclick="startInlineGame('${item.play}', ${index})">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                    <div class="content-info">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <div class="game-type">${item.type}</div>
                    </div>
                    <div class="inline-game-container" id="game-container-${index}" style="display: none;">
                        <div class="game-header-inline">
                            <h4>${item.title}</h4>
                            <button onclick="closeInlineGame(${index})"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="inline-game-area" id="inline-game-${index}"></div>
                    </div>
                </div>
            `;
        }).join('');
        contentGrid.classList.remove('loading');
        return;
    }
    
    // Special handling for jokes with images
    if (tab === 'jokes') {
        contentGrid.innerHTML = content.map((item, index) => {
            return `
                <div class="content-item joke-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="content-image" style="background-image: url('${item.image}');">
                        <div class="image-overlay"></div>
                        <div class="joke-badge">😂</div>
                    </div>
                    <div class="content-info">
                        <div class="joke-category">${item.category}</div>
                        <h4>Joke #${index + 1}</h4>
                        <p class="joke-text">${item.joke}</p>
                        <button class="share-joke-btn" onclick="shareJoke('${item.joke.replace(/'/g, "\\'")}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        contentGrid.classList.remove('loading');
        return;
    }
    
    // Special handling for songs - add play button with actual audio
    if (tab === 'songs') {
        contentGrid.innerHTML = content.map((item, index) => {
            const imageUrl = getImageUrl(tab, item.title, item.artist, index);
            return `
                <div class="content-item song-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="content-image" style="background-image: url('${imageUrl}');">
                        <div class="image-overlay"></div>
                        <button class="play-song-btn" onclick="playSongInline('${item.title}', '${item.artist || ''}', ${index}, '${item.genre || 'Pop'}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="content-info">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <div class="content-meta">
                            ${item.artist ? `<span><i class="fas fa-user"></i> ${item.artist}</span>` : ''}
                            ${item.genre ? `<span><i class="fas fa-tag"></i> ${item.genre}</span>` : ''}
                        </div>
                        <div class="inline-audio-player" id="audio-player-${index}"></div>
                    </div>
                </div>
            `;
        }).join('');
        contentGrid.classList.remove('loading');
        return;
    }
    
    // Default handling for other tabs
    contentGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    contentGrid.classList.add('loading');
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const items = await Promise.all(content.map(async (item, index) => {
        const imageUrl = getImageUrl(tab, item.title, item.artist, index);
        const finalUrl = await loadImageWithFallback(imageUrl, item.title, tab);
        
        return `
            <div class="content-item" style="animation-delay: ${index * 0.1}s;">
                <div class="content-image" style="background-image: url('${finalUrl}');">
                    <div class="image-overlay"></div>
                    <div class="image-loading"><i class="fas fa-spinner fa-spin"></i></div>
                </div>
                <div class="content-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="content-meta">
                        ${item.artist ? `<span><i class="fas fa-user"></i> ${item.artist}</span>` : ''}
                        ${item.genre ? `<span><i class="fas fa-tag"></i> ${item.genre}</span>` : ''}
                        ${item.year ? `<span><i class="fas fa-calendar"></i> ${item.year}</span>` : ''}
                        ${item.duration ? `<span><i class="fas fa-clock"></i> ${item.duration}</span>` : ''}
                        ${item.difficulty ? `<span><i class="fas fa-signal"></i> ${item.difficulty}</span>` : ''}
                        ${item.category ? `<span><i class="fas fa-folder"></i> ${item.category}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }));
    
    contentGrid.innerHTML = items.join('');
    contentGrid.classList.remove('loading');
    
    setTimeout(() => {
        document.querySelectorAll('.image-loading').forEach(el => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        });
    }, 500);
}

// History
function saveToHistory(mood, stressLevel) {
    const session = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        mood,
        stressLevel: Math.round(stressLevel)
    };
    
    detectionHistory.unshift(session);
    
    // Keep only last 50 sessions
    if (detectionHistory.length > 50) {
        detectionHistory = detectionHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('detectionHistory', JSON.stringify(detectionHistory));
    
    loadDashboard();
}

function loadDashboard() {
    // Load from localStorage
    const saved = localStorage.getItem('detectionHistory');
    if (saved) {
        detectionHistory = JSON.parse(saved);
    }

    // Update stats
    const totalSessions = detectionHistory.length;
    const avgStress = totalSessions > 0
        ? Math.round(detectionHistory.reduce((sum, s) => sum + s.stressLevel, 0) / totalSessions)
        : 0;
    
    const moodCounts = {};
    detectionHistory.forEach(s => {
        moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
    });
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    );

    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('avg-stress').textContent = `${avgStress}%`;
    document.getElementById('avg-mood').textContent = mostCommonMood.charAt(0).toUpperCase() + mostCommonMood.slice(1);

    // Update history list
    const historyList = document.getElementById('history-list');
    if (detectionHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--text-dark); padding: 20px;">No history yet. Start your first detection!</p>';
    } else {
        historyList.innerHTML = detectionHistory.slice(0, 20).map(session => `
            <div class="history-item">
                <div class="history-info">
                    <h4>Session ${new Date(session.id).toLocaleDateString()}</h4>
                    <p>${session.date}</p>
                </div>
                <div class="history-stats">
                    <span class="mood-badge">${session.mood.charAt(0).toUpperCase() + session.mood.slice(1)}</span>
                    <span>Stress: <strong style="color: var(--primary-red);">${session.stressLevel}%</strong></span>
                </div>
            </div>
        `).join('');
    }
}

// ==================== GAMES ====================

// Inline game functions
function startInlineGame(gameFunction, index) {
    const container = document.getElementById(`game-container-${index}`);
    const gameArea = document.getElementById(`inline-game-${index}`);
    
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Map function names to game types
    const gameMap = {
        'playColorMatch': 'colorMatch',
        'playBubblePop': 'bubblePop',
        'playMemoryMatch': 'memoryMatch',
        'playHappyRunner': 'happyRunner',
        'playDanceParty': 'danceParty',
        'playZenGarden': 'zenGarden',
        'playWordSearch': 'wordSearch',
        'playJigsaw': 'jigsaw',
        'playMeditation': 'meditation',
        'playStoryBuilder': 'storyBuilder',
        'playStressBuster': 'stressBuster',
        'playBubbleWrap': 'bubbleWrap',
        'playZenColoring': 'zenColoring',
        'playBreathing': 'breathing',
        'playFlowState': 'flowState',
        'playPunchBag': 'punchBag',
        'playRageRunner': 'rageRunner',
        'playSmashIt': 'smashIt',
        'playSpeedChallenge': 'speedChallenge',
        'playEnergyRelease': 'energyRelease',
        'playTrivia': 'trivia',
        'playSudoku': 'sudoku',
        'play2048': 'game2048',
        'playSnake': 'snake',
        'playTetris': 'tetris'
    };
    
    const gameType = gameMap[gameFunction] || 'colorMatch';
    
    if (gameFunction === 'playDanceParty' || gameFunction === 'playEnergyRelease') {
        toggleDanceZone();
        container.style.display = 'none';
        return;
    }
    
    gameArea.innerHTML = getGameHTML(gameType);
    initInlineGame(gameType, gameArea);
}

function closeInlineGame(index) {
    const container = document.getElementById(`game-container-${index}`);
    container.style.display = 'none';
}

function initInlineGame(gameType, container) {
    // Create temporary elements for game initialization
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = getGameHTML(gameType);
    container.appendChild(tempDiv);
    
    // Initialize based on game type
    setTimeout(() => {
        switch(gameType) {
            case 'colorMatch':
                initColorMatchInline(container);
                break;
            case 'bubblePop':
                initBubblePopInline(container);
                break;
            case 'memoryMatch':
                initMemoryMatchInline(container);
                break;
            case 'happyRunner':
                initHappyRunnerInline(container);
                break;
            case 'zenGarden':
                initZenGardenInline(container);
                break;
            case 'stressBuster':
                initStressBusterInline(container);
                break;
            case 'bubbleWrap':
                initBubbleWrapInline(container);
                break;
        }
    }, 100);
}

function openGameModal(title, gameType) {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
        <div class="game-modal-content">
            <div class="game-header">
                <h2>${title}</h2>
                <button class="close-game" onclick="this.closest('.game-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="game-area" id="game-area">
                ${getGameHTML(gameType)}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    initGame(gameType);
}

function getGameHTML(gameType) {
    const games = {
        colorMatch: `
            <div class="color-match-game">
                <h3>Match the colors!</h3>
                <div class="color-grid" id="color-grid"></div>
                <div class="game-score">Score: <span id="color-score">0</span></div>
            </div>
        `,
        bubblePop: `
            <div class="bubble-pop-game">
                <canvas id="bubble-canvas" width="600" height="400"></canvas>
                <div class="game-score">Popped: <span id="bubble-score">0</span></div>
            </div>
        `,
        memoryMatch: `
            <div class="memory-game">
                <div class="card-grid" id="card-grid"></div>
                <div class="game-score">Moves: <span id="memory-moves">0</span></div>
            </div>
        `,
        happyRunner: `
            <div class="runner-game">
                <canvas id="runner-canvas" width="600" height="300"></canvas>
                <div class="game-controls">
                    <button onclick="jump()">Jump (Space)</button>
                </div>
                <div class="game-score">Distance: <span id="runner-distance">0</span>m</div>
            </div>
        `,
        zenGarden: `
            <div class="zen-garden-game">
                <canvas id="zen-canvas" width="600" height="400"></canvas>
                <p>Click and drag to create patterns</p>
            </div>
        `,
        stressBuster: `
            <div class="stress-buster-game">
                <div class="stress-circle" id="stress-circle">
                    <div class="squeeze-area">Squeeze Here!</div>
                </div>
                <div class="game-score">Squeezes: <span id="squeeze-count">0</span></div>
            </div>
        `,
        bubbleWrap: `
            <div class="bubble-wrap-game">
                <div class="bubble-wrap-grid" id="bubble-wrap-grid"></div>
                <div class="game-score">Popped: <span id="wrap-score">0</span></div>
            </div>
        `
    };
    return games[gameType] || '<p>Game coming soon!</p>';
}

function initGame(gameType) {
    switch(gameType) {
        case 'colorMatch':
            initColorMatch();
            break;
        case 'bubblePop':
            initBubblePop();
            break;
        case 'memoryMatch':
            initMemoryMatch();
            break;
        case 'happyRunner':
            initHappyRunner();
            break;
        case 'zenGarden':
            initZenGarden();
            break;
        case 'stressBuster':
            initStressBuster();
            break;
        case 'bubbleWrap':
            initBubbleWrap();
            break;
    }
}

// Inline game implementations
function initColorMatchInline(container) {
    const grid = container.querySelector('#color-grid') || container.querySelector('.color-grid');
    if (!grid) {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'color-match-game';
        gameDiv.innerHTML = `
            <h3 id="color-target">Match the color!</h3>
            <div class="color-grid" id="color-grid-inline"></div>
            <div class="game-score">Score: <span id="color-score-inline">0</span></div>
        `;
        container.appendChild(gameDiv);
        initColorMatchInline(container);
        return;
    }
    
    const scoreEl = container.querySelector('#color-score-inline') || container.querySelector('#color-score');
    const targetEl = container.querySelector('#color-target') || container.querySelector('h3');
    const actualGrid = container.querySelector('#color-grid-inline') || grid;
    
    const colors = ['#ff1744', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4'];
    let score = 0;
    let targetColor = colors[Math.floor(Math.random() * colors.length)];
    
    actualGrid.innerHTML = '';
    if (scoreEl) scoreEl.textContent = score;
    if (targetEl) targetEl.textContent = `Match: ${targetColor}`;
    
    for (let i = 0; i < 12; i++) {
        const cell = document.createElement('div');
        cell.className = 'color-cell';
        const color = colors[Math.floor(Math.random() * colors.length)];
        cell.style.backgroundColor = color;
        cell.onclick = () => {
            if (color === targetColor) {
                score++;
                if (scoreEl) scoreEl.textContent = score;
                targetColor = colors[Math.floor(Math.random() * colors.length)];
                if (targetEl) targetEl.textContent = `Match: ${targetColor}`;
                initColorMatchInline(container);
            } else {
                cell.style.animation = 'shake 0.3s';
                setTimeout(() => cell.style.animation = '', 300);
            }
        };
        actualGrid.appendChild(cell);
    }
}

function initBubblePopInline(container) {
    const canvas = container.querySelector('#bubble-canvas') || document.createElement('canvas');
    if (!canvas.id) {
        canvas.id = 'bubble-canvas-inline';
        canvas.width = 600;
        canvas.height = 400;
        const gameDiv = document.createElement('div');
        gameDiv.className = 'bubble-pop-game';
        gameDiv.innerHTML = `
            <canvas id="bubble-canvas-inline" width="600" height="400"></canvas>
            <div class="game-score">Popped: <span id="bubble-score-inline">0</span></div>
        `;
        container.appendChild(gameDiv);
        initBubblePopInline(container);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let score = 0;
    const scoreEl = container.querySelector('#bubble-score-inline') || container.querySelector('#bubble-score');
    
    function createBubble() {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            radius: 20 + Math.random() * 30,
            speed: 1 + Math.random() * 2,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach((bubble, i) => {
            bubble.y -= bubble.speed;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            
            if (bubble.y < -bubble.radius) {
                bubbles.splice(i, 1);
            }
        });
        
        if (bubbles.length < 10) createBubble();
        requestAnimationFrame(draw);
    }
    
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        bubbles.forEach((bubble, i) => {
            const dist = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
            if (dist < bubble.radius) {
                bubbles.splice(i, 1);
                score++;
                if (scoreEl) scoreEl.textContent = score;
            }
        });
    };
    
    draw();
}

function initMemoryMatchInline(container) {
    const grid = container.querySelector('#card-grid') || container.querySelector('.card-grid');
    if (!grid) {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'memory-game';
        gameDiv.innerHTML = `
            <div class="card-grid" id="card-grid-inline"></div>
            <div class="game-score">Moves: <span id="memory-moves-inline">0</span></div>
        `;
        container.appendChild(gameDiv);
        initMemoryMatchInline(container);
        return;
    }
    
    const cards = ['🎮', '🎯', '🎨', '🎵', '🎭', '🎪', '🎮', '🎯', '🎨', '🎵', '🎭', '🎪'];
    cards.sort(() => Math.random() - 0.5);
    let flipped = [];
    let moves = 0;
    const movesEl = container.querySelector('#memory-moves-inline') || container.querySelector('#memory-moves');
    const actualGrid = container.querySelector('#card-grid-inline') || grid;
    
    actualGrid.innerHTML = '';
    cards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = i;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.onclick = () => {
            if (flipped.length === 2 || card.classList.contains('flipped')) return;
            
            card.classList.add('flipped');
            card.textContent = card.dataset.emoji;
            flipped.push({card, index: i, emoji});
            
            if (flipped.length === 2) {
                moves++;
                if (movesEl) movesEl.textContent = moves;
                if (flipped[0].emoji === flipped[1].emoji) {
                    flipped.forEach(f => f.card.classList.add('matched'));
                    flipped = [];
                } else {
                    setTimeout(() => {
                        flipped.forEach(f => {
                            f.card.classList.remove('flipped');
                            f.card.textContent = '?';
                        });
                        flipped = [];
                    }, 1000);
                }
            }
        };
        actualGrid.appendChild(card);
    });
}

function initHappyRunnerInline(container) {
    const canvas = container.querySelector('#runner-canvas') || document.createElement('canvas');
    if (!canvas.id) {
        canvas.id = 'runner-canvas-inline';
        canvas.width = 600;
        canvas.height = 300;
        const gameDiv = document.createElement('div');
        gameDiv.className = 'runner-game';
        gameDiv.innerHTML = `
            <canvas id="runner-canvas-inline" width="600" height="300"></canvas>
            <div class="game-controls">
                <button onclick="window.runnerJump()">Jump (Space)</button>
            </div>
            <div class="game-score">Distance: <span id="runner-distance-inline">0</span>m</div>
        `;
        container.appendChild(gameDiv);
        initHappyRunnerInline(container);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let playerY = 200;
    let obstacles = [];
    let distance = 0;
    let gameRunning = true;
    const distanceEl = container.querySelector('#runner-distance-inline') || container.querySelector('#runner-distance');
    
    function gameLoop() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(50, playerY, 30, 50);
        
        obstacles.forEach((obs, i) => {
            obs.x -= 5;
            ctx.fillStyle = '#ff1744';
            ctx.fillRect(obs.x, obs.y, 30, 30);
            
            if (obs.x < -30) {
                obstacles.splice(i, 1);
                distance += 10;
                if (distanceEl) distanceEl.textContent = distance;
            }
        });
        
        if (Math.random() < 0.02) {
            obstacles.push({x: canvas.width, y: Math.random() * 250 + 50});
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    window.runnerJump = () => {
        if (playerY > 100) {
            playerY -= 100;
            setTimeout(() => playerY += 100, 300);
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') window.runnerJump();
    });
    
    gameLoop();
}

function initZenGardenInline(container) {
    const canvas = container.querySelector('#zen-canvas') || document.createElement('canvas');
    if (!canvas.id) {
        canvas.id = 'zen-canvas-inline';
        canvas.width = 600;
        canvas.height = 400;
        const gameDiv = document.createElement('div');
        gameDiv.className = 'zen-garden-game';
        gameDiv.innerHTML = `
            <canvas id="zen-canvas-inline" width="600" height="400"></canvas>
            <p>Click and drag to create patterns</p>
        `;
        container.appendChild(gameDiv);
        initZenGardenInline(container);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 3;
    
    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => drawing = false;
    canvas.onmousemove = (e) => {
        if (drawing) {
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }
    };
}

function initStressBusterInline(container) {
    const circle = container.querySelector('#stress-circle') || container.querySelector('.stress-circle');
    if (!circle) {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'stress-buster-game';
        gameDiv.innerHTML = `
            <div class="stress-circle" id="stress-circle-inline">
                <div class="squeeze-area">Squeeze Here!</div>
            </div>
            <div class="game-score">Squeezes: <span id="squeeze-count-inline">0</span></div>
        `;
        container.appendChild(gameDiv);
        initStressBusterInline(container);
        return;
    }
    
    let squeezes = 0;
    const countEl = container.querySelector('#squeeze-count-inline') || container.querySelector('#squeeze-count');
    const actualCircle = container.querySelector('#stress-circle-inline') || circle;
    
    actualCircle.onclick = () => {
        squeezes++;
        if (countEl) countEl.textContent = squeezes;
        actualCircle.style.transform = 'scale(0.9)';
        setTimeout(() => actualCircle.style.transform = 'scale(1)', 100);
    };
}

function initBubbleWrapInline(container) {
    const grid = container.querySelector('#bubble-wrap-grid') || container.querySelector('.bubble-wrap-grid');
    if (!grid) {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'bubble-wrap-game';
        gameDiv.innerHTML = `
            <div class="bubble-wrap-grid" id="bubble-wrap-grid-inline"></div>
            <div class="game-score">Popped: <span id="wrap-score-inline">0</span></div>
        `;
        container.appendChild(gameDiv);
        initBubbleWrapInline(container);
        return;
    }
    
    let popped = 0;
    const scoreEl = container.querySelector('#wrap-score-inline') || container.querySelector('#wrap-score');
    const actualGrid = container.querySelector('#bubble-wrap-grid-inline') || grid;
    
    actualGrid.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'wrap-bubble';
        bubble.onclick = () => {
            if (!bubble.classList.contains('popped')) {
                bubble.classList.add('popped');
                popped++;
                if (scoreEl) scoreEl.textContent = popped;
            }
        };
        actualGrid.appendChild(bubble);
    }
}

// Legacy game implementations (for modals)
function initColorMatch() {
    const grid = document.getElementById('color-grid');
    if (!grid) return;
    initColorMatchInline({ querySelector: (sel) => document.querySelector(sel) });
}

function initBubblePop() {
    const canvas = document.getElementById('bubble-canvas');
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let score = 0;
    
    function createBubble() {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            radius: 20 + Math.random() * 30,
            speed: 1 + Math.random() * 2,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach((bubble, i) => {
            bubble.y -= bubble.speed;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            
            if (bubble.y < -bubble.radius) {
                bubbles.splice(i, 1);
            }
        });
        
        if (bubbles.length < 10) createBubble();
        requestAnimationFrame(draw);
    }
    
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        bubbles.forEach((bubble, i) => {
            const dist = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
            if (dist < bubble.radius) {
                bubbles.splice(i, 1);
                score++;
                document.getElementById('bubble-score').textContent = score;
            }
        });
    };
    
    draw();
}

function initMemoryMatch() {
    // Simplified memory game
    const grid = document.getElementById('card-grid');
    const cards = ['🎮', '🎯', '🎨', '🎵', '🎭', '🎪', '🎮', '🎯', '🎨', '🎵', '🎭', '🎪'];
    cards.sort(() => Math.random() - 0.5);
    let flipped = [];
    let moves = 0;
    
    grid.innerHTML = '';
    cards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = i;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.onclick = () => flipCard(card, i);
        grid.appendChild(card);
    });
    
    function flipCard(card, index) {
        if (flipped.length === 2 || card.classList.contains('flipped')) return;
        
        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        flipped.push({card, index, emoji: card.dataset.emoji});
        
        if (flipped.length === 2) {
            moves++;
            document.getElementById('memory-moves').textContent = moves;
            if (flipped[0].emoji === flipped[1].emoji) {
                flipped.forEach(f => f.card.classList.add('matched'));
                flipped = [];
            } else {
                setTimeout(() => {
                    flipped.forEach(f => {
                        f.card.classList.remove('flipped');
                        f.card.textContent = '?';
                    });
                    flipped = [];
                }, 1000);
            }
        }
    }
}

function initHappyRunner() {
    const canvas = document.getElementById('runner-canvas');
    const ctx = canvas.getContext('2d');
    let playerY = 200;
    let obstacles = [];
    let distance = 0;
    let gameRunning = true;
    
    function gameLoop() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw player
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(50, playerY, 30, 50);
        
        // Draw obstacles
        obstacles.forEach((obs, i) => {
            obs.x -= 5;
            ctx.fillStyle = '#ff1744';
            ctx.fillRect(obs.x, obs.y, 30, 30);
            
            if (obs.x < -30) {
                obstacles.splice(i, 1);
                distance += 10;
                document.getElementById('runner-distance').textContent = distance;
            }
        });
        
        if (Math.random() < 0.02) {
            obstacles.push({x: canvas.width, y: Math.random() * 250 + 50});
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    window.jump = () => {
        if (playerY > 100) {
            playerY -= 100;
            setTimeout(() => playerY += 100, 300);
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jump();
    });
    
    gameLoop();
}

function initZenGarden() {
    const canvas = document.getElementById('zen-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 3;
    
    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => drawing = false;
    canvas.onmousemove = (e) => {
        if (drawing) {
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }
    };
}

function initStressBuster() {
    const circle = document.getElementById('stress-circle');
    let squeezes = 0;
    
    circle.onclick = () => {
        squeezes++;
        document.getElementById('squeeze-count').textContent = squeezes;
        circle.style.transform = 'scale(0.9)';
        setTimeout(() => circle.style.transform = 'scale(1)', 100);
    };
}

function initBubbleWrap() {
    const grid = document.getElementById('bubble-wrap-grid');
    let popped = 0;
    grid.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'wrap-bubble';
        bubble.onclick = () => {
            if (!bubble.classList.contains('popped')) {
                bubble.classList.add('popped');
                popped++;
                document.getElementById('wrap-score').textContent = popped;
            }
        };
        grid.appendChild(bubble);
    }
}

// ==================== MUSIC PLAYER ====================

function toggleMusicPlayer() {
    const player = document.getElementById('music-player');
    player.classList.toggle('hidden');
    if (!player.classList.contains('hidden')) {
        loadPlaylist();
    }
}

function loadPlaylist() {
    const playlist = document.getElementById('playlist');
    const currentMood = localStorage.getItem('lastMood') || 'happy';
    const songs = contentDatabase.songs[currentMood] || contentDatabase.songs.happy;
    
    playlist.innerHTML = songs.map((song, index) => `
        <div class="playlist-item" onclick="playSong('${song.title}', '${song.artist || ''}', ${index})">
            <i class="fas fa-music"></i>
            <div>
                <strong>${song.title}</strong>
                <p>${song.artist || 'Unknown Artist'}</p>
            </div>
        </div>
    `).join('');
}

function playSong(title, artist, index) {
    const audio = document.getElementById('audio-player');
    musicPlayer.currentTrack = {title, artist, index};
    
    // Use YouTube or Spotify embed (simplified - in production use actual API)
    const searchQuery = encodeURIComponent(`${title} ${artist}`);
    // For demo, we'll use a placeholder
    document.getElementById('track-title').textContent = title;
    document.getElementById('track-artist').textContent = artist || 'Unknown Artist';
    
    // In production, integrate with Spotify/YouTube API
    addGuideMessage(`Playing: ${title} by ${artist || 'Unknown'}`, 'info');
    
    toggleMusicPlayer();
    document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
    musicPlayer.isPlaying = true;
}

// Play song inline with generated audio
function playSongInline(title, artist, index, genre) {
    const playerDiv = document.getElementById(`audio-player-${index}`);
    
    // Stop any currently playing audio
    if (musicPlayer.audio) {
        musicPlayer.audio.pause();
        musicPlayer.audio = null;
    }
    
    // Create audio context for generating music
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Generate music based on genre
    const frequencies = {
        'Pop': [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88],
        'Rock': [220.00, 246.94, 277.18, 311.13, 349.23, 392.00],
        'Funk': [196.00, 220.00, 246.94, 261.63, 293.66],
        'Indie': [174.61, 196.00, 220.00, 246.94, 261.63],
        'Metal': [146.83, 164.81, 174.61, 196.00, 220.00]
    };
    
    const notes = frequencies[genre] || frequencies['Pop'];
    let currentNote = 0;
    
    oscillator.type = 'sine';
    oscillator.frequency.value = notes[currentNote];
    gainNode.gain.value = 0.3;
    
    const playSequence = () => {
        if (musicPlayer.isPlaying) {
            oscillator.frequency.value = notes[currentNote];
            currentNote = (currentNote + 1) % notes.length;
            setTimeout(playSequence, 500);
        }
    };
    
    playerDiv.innerHTML = `
        <div class="inline-player-controls">
            <button class="mini-play-btn" onclick="toggleInlinePlay(${index})" id="inline-play-${index}">
                <i class="fas fa-pause"></i>
            </button>
            <div class="mini-track-info">
                <strong>${title}</strong>
                <span>${artist || 'Unknown'}</span>
            </div>
            <div class="mini-progress">
                <div class="mini-progress-bar" id="mini-progress-${index}"></div>
            </div>
        </div>
    `;
    
    musicPlayer.audio = { oscillator, gainNode, audioContext, index };
    musicPlayer.isPlaying = true;
    musicPlayer.currentIndex = index;
    
    oscillator.start();
    playSequence();
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        if (musicPlayer.isPlaying && musicPlayer.currentIndex === index) {
            progress += 2;
            if (progress > 100) progress = 0;
            document.getElementById(`mini-progress-${index}`).style.width = progress + '%';
        } else {
            clearInterval(progressInterval);
        }
    }, 100);
}

function toggleInlinePlay(index) {
    const btn = document.getElementById(`inline-play-${index}`);
    if (musicPlayer.isPlaying && musicPlayer.currentIndex === index) {
        if (musicPlayer.audio) {
            musicPlayer.audio.gainNode.gain.value = 0;
        }
        musicPlayer.isPlaying = false;
        btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        if (musicPlayer.audio && musicPlayer.audio.index === index) {
            musicPlayer.audio.gainNode.gain.value = 0.3;
        }
        musicPlayer.isPlaying = true;
        musicPlayer.currentIndex = index;
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function shareJoke(joke) {
    if (navigator.share) {
        navigator.share({
            title: 'Funny Joke',
            text: joke
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(joke).then(() => {
            addGuideMessage('Joke copied to clipboard!', 'success');
        });
    }
}

function togglePlayPause() {
    const btn = document.getElementById('play-pause-btn');
    if (musicPlayer.isPlaying) {
        btn.innerHTML = '<i class="fas fa-play"></i>';
        musicPlayer.isPlaying = false;
    } else {
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        musicPlayer.isPlaying = true;
    }
}

function previousTrack() {
    if (musicPlayer.currentIndex > 0) {
        musicPlayer.currentIndex--;
        const songs = contentDatabase.songs[localStorage.getItem('lastMood') || 'happy'];
        playSong(songs[musicPlayer.currentIndex].title, songs[musicPlayer.currentIndex].artist, musicPlayer.currentIndex);
    }
}

function nextTrack() {
    const songs = contentDatabase.songs[localStorage.getItem('lastMood') || 'happy'];
    if (musicPlayer.currentIndex < songs.length - 1) {
        musicPlayer.currentIndex++;
        playSong(songs[musicPlayer.currentIndex].title, songs[musicPlayer.currentIndex].artist, musicPlayer.currentIndex);
    }
}

// ==================== DANCE/MOVEMENT ====================

function toggleDanceZone() {
    const zone = document.getElementById('dance-zone');
    zone.classList.toggle('hidden');
    if (!zone.classList.contains('hidden') && !danceMode.active) {
        startDanceMode();
    }
}

async function startDanceMode() {
    try {
        danceMode.videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        const video = document.getElementById('dance-video');
        video.srcObject = danceMode.videoStream;
        danceMode.active = true;
        danceMode.moveCount = 0;
        danceMode.energyLevel = 0;
        
        trackMovement();
        startVisualizer();
    } catch (error) {
        console.error('Camera access denied:', error);
        addGuideMessage('Camera access needed for movement tracking', 'warning');
    }
}

function stopDanceMode() {
    if (danceMode.videoStream) {
        danceMode.videoStream.getTracks().forEach(track => track.stop());
        danceMode.videoStream = null;
    }
    danceMode.active = false;
    document.getElementById('move-count').textContent = 0;
    document.getElementById('energy-level').textContent = '0%';
}

function trackMovement() {
    if (!danceMode.active) return;
    
    const video = document.getElementById('dance-video');
    const canvas = document.getElementById('dance-canvas');
    const ctx = canvas.getContext('2d');
    
    let lastFrame = null;
    
    function analyze() {
        if (!danceMode.active) return;
        
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.drawImage(video, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (lastFrame) {
            let diff = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = Math.abs(imageData.data[i] - lastFrame[i]);
                const g = Math.abs(imageData.data[i+1] - lastFrame[i+1]);
                const b = Math.abs(imageData.data[i+2] - lastFrame[i+2]);
                diff += (r + g + b) / 3;
            }
            
            if (diff > 50000) {
                danceMode.moveCount++;
                danceMode.energyLevel = Math.min(100, danceMode.energyLevel + 2);
                document.getElementById('move-count').textContent = danceMode.moveCount;
                document.getElementById('energy-level').textContent = `${danceMode.energyLevel}%`;
            }
        }
        
        lastFrame = new Uint8ClampedArray(imageData.data);
        requestAnimationFrame(analyze);
    }
    
    video.addEventListener('loadedmetadata', analyze);
}

function startVisualizer() {
    const canvas = document.getElementById('visualizer-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 200;
    
    function draw() {
        if (!danceMode.active) return;
        
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const bars = 50;
        const barWidth = canvas.width / bars;
        
        for (let i = 0; i < bars; i++) {
            const height = (Math.sin(Date.now() / 100 + i) + 1) * 50 + 
                          (danceMode.energyLevel / 100) * 50;
            ctx.fillStyle = `hsl(${i * 5}, 70%, 60%)`;
            ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}


