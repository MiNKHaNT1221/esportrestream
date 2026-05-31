import React, { useState, useEffect } from 'react';

// Firebase Imports
import { db, auth, provider } from '../firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import {
    PlayCircle,
    Mic2,
    Repeat,
    Trophy,
    Settings,
    Search,
    MessageSquare,
    Heart,
    Send,
    Gamepad2,
    Bell,
    User,
    PanelRightClose,
    PanelRightOpen,
    Maximize2,
    Volume2,
    ArrowLeft,
    ArrowRight,
    Twitter,
    Twitch,
    ArrowRight as ArrowIcon,
    Calendar,
    MapPin,
    Zap,
    Star,
    DollarSign,
    Lock,
    CheckCircle,
    Image,
    Menu, 
    Home, 
    CalendarDays, 
    Hash, 
    LogOut, 
    History, 
    CreditCard
} from 'lucide-react';

// --- Global Neon Classes ---
const NEON_GREEN = 'text-[#00FF41]';
const NEON_PINK = 'text-[#FF00A6]';
const NEON_PINK_ACCENT = NEON_PINK;
const NEON_SHADOW_GREEN = 'shadow-[0_0_15px_rgba(0,255,65,0.6)]';
const NEON_SHADOW_PINK = 'shadow-[0_0_15px_rgba(255,0,166,0.6)]';

const LiveStreamingPage = () => {
    // 1. Firebase နှင့် Chat အတွက် State များ
    const [chatVisible, setChatVisible] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);

    // 2. User Login အခြေအနေကို စစ်ဆေးခြင်း
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // 3. Firebase မှ ဒေတာများကို အချိန်နှင့်တစ်ပြေးညီ (Realtime) ယူခြင်း
    useEffect(() => {
        const chatRef = ref(db, 'liveChat');
        onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessages(messageList);
            } else {
                setMessages([]);
            }
        });
    }, []);

    // 4. Google ဖြင့် Login ဝင်ခြင်း
    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    // 5. Firebase သို့ စာပို့ခြင်း
    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !user) return;
        
        const chatRef = ref(db, 'liveChat');
        push(chatRef, {
            text: newMessage,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            timestamp: serverTimestamp()
        });
        setNewMessage(''); // စာပို့ပြီးရင် Box ကို ပြန်ရှင်းမယ်
    };

    return (
        <div className="flex h-[calc(100vh-80px)] p-6 gap-6 relative z-10 overflow-hidden">
            {/* --- Main Video Area (မူလဒီဇိုင်းအတိုင်း) --- */}
            <div className={`flex-1 flex flex-col gap-4 transition-all duration-500 ease-in-out relative ${chatVisible ? 'mr-0' : 'mr-0'}`}>
                <div className={`flex-1 bg-black/80 backdrop-blur-xl border-4 border-[#00FF41]/70 rounded-lg overflow-hidden relative shadow-[0_0_15px_rgba(0,255,65,0.6)] group transition-all duration-300`}>
                    
                    {/* Top Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-6 z-20 bg-linear-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
                        <div className="flex items-start justify-between">
                            <div className="pointer-events-auto">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`bg-red-700 shadow-[0_0_15px_rgba(0,255,65,0.6)] text-[#00FF41] text-[12px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-widest animate-pulse border border-[#00FF41]`}>LIVE FEED</span>
                                    <div className={`flex items-center gap-1.5 text-[#FF00A6] text-xs font-bold bg-black/70 backdrop-blur-md px-3 py-1 rounded-sm border border-[#FF00A6]/50`}>
                                        <Gamepad2 size={12} /> LEAGUE OF LEGENDS
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-xl uppercase">GRAND FINALS 2025: T1 vs GEN.G</h1>
                                <p className="text-white/70 text-sm font-mono mt-1">MAP 3 | MATCH POINT</p>
                            </div>
                            <div className="flex gap-2 pointer-events-auto">
                                <button className="bg-white/5 hover:bg-[#FF00A6]/20 backdrop-blur-md text-white p-3 rounded-lg border border-[#FF00A6]/20 transition shadow-lg hover:shadow-[0_0_10px_rgba(255,0,166,0.5)]">
                                    <Heart size={20} className="text-[#FF00A6]" />
                                </button>
                                <button className="bg-white/5 hover:bg-[#00FF41]/20 backdrop-blur-md text-white p-3 rounded-lg border border-[#00FF41]/20 transition shadow-lg hover:shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                                    <Settings size={20} className="text-[#00FF41]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video Placeholder Content */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <div className="text-center group-hover:scale-105 transition duration-700">
                            <div className={`w-28 h-28 rounded-sm bg-white/5 border-4 border-[#FF00A6]/50 flex items-center justify-center backdrop-blur-sm mx-auto mb-6 shadow-[0_0_40px_rgba(255,0,166,0.3)] cursor-pointer hover:bg-black/50 hover:border-[#FF00A6] hover:scale-110 transition-all`}>
                                <PlayCircle size={56} className={`text-[#FF00A6] fill-transparent`} strokeWidth={1.5} />
                            </div>
                            <h3 className={`text-white font-bold tracking-[0.2em] text-sm uppercase text-[#FF00A6]`}>WAITING FOR SIGNAL</h3>
                        </div>
                    </div>

                    {/* Bottom Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-linear-to-t from-black/90 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-4 items-center">
                            <button className={`text-white hover:text-[#00FF41] transition`}><PlayCircle size={24} /></button>
                            <button className={`text-white hover:text-[#00FF41] transition`}><Volume2 size={24} /></button>
                            <div className="text-white/50 text-xs font-mono border-l border-white/20 pl-4">00:00 / LIVE</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => setChatVisible(!chatVisible)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-xs font-bold transition backdrop-blur-md shadow-lg
                                ${chatVisible
                                        ? `bg-[#FF00A6]/80 border-[#FF00A6] text-white shadow-[0_0_15px_rgba(0,255,65,0.6)]`
                                        : 'bg-black/60 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                {chatVisible ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
                                {chatVisible ? 'HIDE CHAT' : 'SHOW CHAT'}
                            </button>
                            <button className={`text-white hover:text-[#00FF41] transition`}><Maximize2 size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Right Column: Chat (Firebase ချိတ်ဆက်ပြီး) --- */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${chatVisible ? 'w-96 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10 p-0'}`}>
                <div className={`h-full bg-black/80 backdrop-blur-2xl border-4 border-[#FF00A6]/70 rounded-lg flex flex-col shadow-[0_0_15px_rgba(255,0,166,0.4)] relative overflow-hidden`}>
                    
                    {/* Chat Header */}
                    <div className="flex justify-between items-center p-4 border-b-2 border-[#FF00A6]/50 bg-black/50">
                        <h2 className={`text-lg font-black uppercase text-white flex items-center gap-2 text-[#FF00A6]`}>
                            <MessageSquare size={18} /> LIVE CHAT
                        </h2>
                        <div className="flex items-center gap-3">
                            {user && (
                                <button onClick={() => signOut(auth)} className="text-xs text-white/50 hover:text-red-500 font-bold tracking-wider">LOGOUT</button>
                            )}
                            <button onClick={() => setChatVisible(false)} className="text-white/50 hover:text-[#00FF41]">
                                <PanelRightClose size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages Rendering */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs font-mono">
                        {messages.length === 0 ? (
                            <p className="text-[#00FF41]/70 text-center mt-4 uppercase">No messages yet. Be the first to chat!</p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="group flex gap-3 items-start hover:bg-white/5 p-2 rounded-sm transition border-l-2 border-transparent hover:border-[#00FF41]/50">
                                    <div className="w-6 h-6 rounded-sm shrink-0 flex items-center justify-center text-[10px] font-bold text-black bg-[#00FF41] shadow-lg">
                                        {msg.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-[#00FF41] uppercase">{msg.userName}</span>
                                        </div>
                                        <p className="text-white text-sm leading-snug break-words">{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area (Authentication စစ်ဆေးခြင်း) */}
                    <div className="p-4 border-t-2 border-[#00FF41]/50 bg-black/50">
                        {user ? (
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="SEND MESSAGE..."
                                    className="w-full bg-black/50 border-2 border-[#FF00A6]/50 rounded-lg py-3 pl-4 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00FF41] font-mono shadow-inner shadow-black/70"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="absolute right-2 top-2 p-2 bg-[#00FF41] rounded-lg text-black hover:bg-[#FF00A6] transition shadow-lg shadow-[#00FF41]/30 group-focus-within:scale-105"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleLogin}
                                className="w-full py-3 bg-[#FF00A6] text-white font-bold rounded-lg uppercase tracking-widest hover:bg-[#FF00A6]/80 transition shadow-lg shadow-[#FF00A6]/30"
                            >
                                LOGIN TO CHAT
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};




// ------------------------------------
// NEW PAGES (Home, Schedule, Profile)
// ------------------------------------

const HomePage = () => (
    <div className="p-8 h-full overflow-y-auto">
        <div className="w-full h-64 bg-linear-to-r from-[#FF00A6]/20 to-[#00FF41]/20 border-2 border-[#00FF41]/50 rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.2)] mb-8">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,166,0.5)]">
                WELCOME TO <span className="text-[#00FF41]">ESPORTRESTREAM</span>
            </h1>
            <p className="text-white/60 mt-4 font-mono">YOUR ULTIMATE HUB FOR LIVE ESPORTS & VODS</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-black/50 border border-white/10 p-4 rounded-lg hover:border-[#FF00A6]/50 transition cursor-pointer group">
                    <div className="h-40 bg-white/5 rounded-sm mb-4 flex items-center justify-center group-hover:bg-[#FF00A6]/10 transition">
                        <PlayCircle size={40} className="text-[#FF00A6] opacity-50 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-white font-bold uppercase">TRENDING MATCH 0{i}</h3>
                    <p className="text-[#00FF41] text-xs font-mono mt-1">12.5K VIEWERS</p>
                </div>
            ))}
        </div>
    </div>
);

const TournamentSchedulePage = () => {
    const [selectedTag, setSelectedTag] = useState('');
    
    // Streamer တွေ တင်ထားတဲ့ Post (Mock Data)
    const posts = [
        { id: 1, author: "Mr. Yikee", content: "Don't miss the X.Borg insane plays tomorrow! Grand Finals are going to be fire. Catch me live!", tag: "#MLBB", time: "Tomorrow, 8:00 PM" },
        { id: 2, author: "Mr. Alex", content: "PMCL biggest tournament matches starting this weekend. YG is ready to defend their title!", tag: "#PUBG", time: "Saturday, 2:00 PM" },
        { id: 3, author: "Ms. Elena", content: "Analyzing the drafting phase for the M7 Championship. Who will dominate the mid lane?", tag: "#MLBB", time: "Friday, 5:00 PM" },
        { id: 4, author: "Mr. Lamar", content: "Valorant Champions Tour Regional Qualifiers. Let's go!", tag: "#VALORANT", time: "Sunday, 1:00 PM" }
    ];

    const filteredPosts = selectedTag ? posts.filter(p => p.tag === selectedTag) : posts;

    return (
        <div className="p-8 h-full overflow-y-auto">
            <h2 className="text-3xl font-black text-white uppercase mb-6 flex items-center gap-3">
                <CalendarDays className="text-[#00FF41]" /> TOURNAMENT SCHEDULE
            </h2>
            
            {/* Hashtag Search / Filter */}
            <div className="mb-8 p-4 bg-black/60 border-2 border-[#FF00A6]/50 rounded-lg flex items-center gap-4">
                <Hash className="text-[#FF00A6]" />
                <select 
                    value={selectedTag} 
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-transparent text-white font-bold uppercase outline-none flex-1 cursor-pointer"
                >
                    <option value="" className="bg-black">ALL GAMES (SHOW ALL)</option>
                    <option value="#MLBB" className="bg-black">#MLBB (MOBILE LEGENDS)</option>
                    <option value="#PUBG" className="bg-black">#PUBG (PLAYERUNKNOWN'S BATTLEGROUNDS)</option>
                    <option value="#VALORANT" className="bg-black">#VALORANT</option>
                </select>
            </div>

            {/* Streamer Posts */}
            <div className="space-y-4">
                {filteredPosts.map(post => (
                    <div key={post.id} className="bg-black/80 border border-[#00FF41]/30 p-6 rounded-lg hover:border-[#00FF41] transition">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-white font-bold flex items-center gap-2"><User size={16} className="text-[#00FF41]"/> {post.author}</span>
                            <span className="text-[#FF00A6] text-xs font-mono bg-[#FF00A6]/10 px-2 py-1 rounded">{post.time}</span>
                        </div>
                        <p className="text-white/80 mb-4">{post.content}</p>
                        <span className="text-[#00FF41] font-bold text-sm">{post.tag}</span>
                    </div>
                ))}
                {filteredPosts.length === 0 && <p className="text-white/50 italic">No schedules found for this game.</p>}
            </div>
        </div>
    );
};

const UserProfilePage = () => (
    <div className="p-8 h-full overflow-y-auto">
        <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3">
            <User className="text-[#FF00A6]" /> USER DASHBOARD
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/60 border-2 border-[#00FF41]/50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-[#00FF41]/20 rounded-full border-2 border-[#00FF41] flex items-center justify-center">
                        <User size={40} className="text-[#00FF41]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white uppercase">GUEST_USER</h3>
                        <p className="text-[#FF00A6] text-sm font-mono mt-1">BASIC TIER</p>
                    </div>
                </div>
                <button className="w-full py-3 bg-[#FF00A6] text-white font-bold rounded-lg uppercase tracking-widest hover:bg-[#FF00A6]/80 transition flex justify-center items-center gap-2">
                    <CreditCard size={18} /> UPGRADE TO PREMIUM
                </button>
            </div>

            <div className="bg-black/60 border border-white/10 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                    <History size={18} className="text-[#00FF41]" /> WATCH HISTORY
                </h3>
                <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded flex justify-between items-center text-sm">
                        <span className="text-white/80">T1 vs GEN.G (Grand Finals)</span>
                        <span className="text-white/40 font-mono">2 HRS AGO</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded flex justify-between items-center text-sm">
                        <span className="text-white/80">PMCL Highlights - YG Winning Moment</span>
                        <span className="text-white/40 font-mono">1 DAY AGO</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
// ------------------------------------


// ------------------------------------
// 3. CASTER HUB DATA & COMPONENTS (from viewer_caster.jsx)
// ------------------------------------

const CASTERS = [
    {
        id: 1,
        name: 'Mr. Yikee',
        role: 'Play-by-Play Caster',
        bio: 'Former pro player turned shoutcaster. Known for high-energy commentary in MOBA grand finals. "The voice of the clutch."',
        image: 'src/assets/caster1-removebg-preview.png', // Placeholder
        highlight: { title: "THE BASE RACE OF THE CENTURY!", views: '2.4M', thumbnail: 'bg-[#FF00A6]' }, // Used hex for visual distinction
        social: { twitter: '@valk', twitch: 'valkyrie_live' }
    },
    {
        id: 2,
        name: 'Mr. Lamar',
        role: 'Analyst Desk Host',
        bio: 'Strategic mastermind who breaks down complex macro plays. Provides deep analytical insight into draft phases.',
        image: 'src/assets/caster2.png', // Placeholder
        highlight: { title: "Predicting the Draft perfectly 3 times in a row", views: '850K', thumbnail: 'bg-[#00FF41]' },
        social: { twitter: '@macro_dave', twitch: 'macro_analysis' }
    },
    {
        id: 3,
        name: 'Ms. Elena',
        role: 'Color Commentator',
        bio: 'The face of the analyst desk. Brings out the best stories from players during post-match interviews.',
        image: 'src/assets/caster3.png', // Placeholder
        highlight: { title: "Emotional Interview with the Champions", views: '1.2M', thumbnail: 'bg-[#FF00A6]' },
        social: { twitter: '@pixel_perfect', twitch: 'pixel_stream' }
    },
    {
        id: 4,
        name: 'Mr. Alex',
        role: 'FPS Shoutcaster',
        bio: 'Fast-paced commentary for tactical shooters. Known for his incredible lungs and speed-talking abilities.',
        image: 'src/assets/caster4.png', // Placeholder
        highlight: { title: "RAP GOD MODE: The Penta Kill Call", views: '3.1M', thumbnail: 'bg-[#00FF41]' },
        social: { twitter: '@rapidfire', twitch: 'rapid_casts' }
    },
    {
        id: 5,
        name: 'Ms. Jasmine',
        role: 'Interviewer',
        bio: 'Connecting fans with their idols. Jasmine specializes in heartfelt and fun post-game interviews.',
        image: 'src/assets/caster5.png', // Placeholder
        highlight: { title: "Backstage Tour at M5", views: '500K', thumbnail: 'bg-[#FF00A6]' },
        social: { twitter: '@jinx_talks', twitch: 'jinx_lounge' }
    }
];

const QUIZ_QUESTIONS = [
    { id: 1, question: "What is Mr. Yikee's real name?", options: ["Sarah Chen", "Mike Yikes", "John Doe", "Alex Smith"], correct: 1 },
    { id: 2, question: "Which caster is known as the 'Rap God'?", options: ["Mr. Lamar", "Mr. Alex", "Ms. Elena", "Mr. Yikee"], correct: 1 },
    { id: 3, question: "What is Ms. Jasmine's specialty?", options: ["Play-by-Play", "Analysis", "Interviews", "Observing"], correct: 2 },
    { id: 4, question: "Who predicted the draft perfectly 3 times?", options: ["Mr. Lamar", "Ms. Elena", "Mr. Yikee", "Mr. Alex"], correct: 0 },
    { id: 5, question: "Ms. Elena is famous for her role as a...", options: ["Host", "Color Commentator", "Play-by-Play", "Player"], correct: 1 },
    { id: 6, question: "Which caster shouted 'THE BASE RACE OF THE CENTURY'?", options: ["Mr. Alex", "Mr. Yikee", "Ms. Jasmine", "Mr. Lamar"], correct: 1 },
];

const TOURNAMENTS_DATA = [
    // Ongoing
    {
        id: 101, status: 'ongoing', name: 'Liga Esports Nasional - Liga 1',
        date: 'Now - Dec 04', location: 'Jakarta, ID',
        casters: [1, 2], // Yikee, Lamar
        tags: ['Regional', 'Official']
    },
    {
        id: 102, status: 'ongoing', name: 'Light of Dawn Pro-Invitational S3',
        date: 'Now - Dec 07', location: 'Online',
        casters: [4], // Alex
        tags: ['Invitational']
    },
    {
        id: 103, status: 'ongoing', name: 'IESF World Esports Championship',
        date: 'Dec 03 - Dec 07', location: 'Kuala Lumpur, MY',
        casters: [1, 3, 5], // Yikee, Elena, Jasmine
        tags: ['Global', 'National Teams']
    },
    // Upcoming
    {
        id: 201, status: 'upcoming', name: '33rd SEA Games',
        date: 'Dec 13 - 17', location: 'Bangkok, TH',
        casters: [2, 3], // Lamar, Elena
        tags: ['Medal Event', 'Multi-Sport']
    },
    {
        id: 202, status: 'upcoming', name: 'Games of the Future 2025',
        date: 'Dec 18 - 23', location: 'Kazan, RU',
        casters: [4, 1], // Alex, Yikee
        tags: ['Phygital', 'Tier 1']
    },
    {
        id: 203, status: 'upcoming', name: 'M7 World Championship',
        date: 'Jan 03 - 25, 2026', location: 'Indonesia',
        casters: [1, 2, 3, 4, 5], // All Stars
        tags: ['World Championship', '$1M Prize']
    }
];

const CasterGame = () => {
    const [bgIndex, setBgIndex] = useState(0);
    const [score, setScore] = useState(0); // 0 to 3 stars
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [gameState, setGameState] = useState('idle'); // idle, playing, answered
    const [selectedOption, setSelectedOption] = useState(null);

    // Auto-change background every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % 4); // Cycle through 4 mock backgrounds
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const startGame = () => {
        const randomQ = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
        setCurrentQuestion(randomQ);
        setGameState('playing');
        setSelectedOption(null);
    };

    const handleAnswer = (index) => {
        if (gameState !== 'playing') return;
        setSelectedOption(index);
        setGameState('answered');

        if (index === currentQuestion.correct) {
            setScore(prev => Math.min(prev + 1, 3));
        }
    };

    return (
        <div className={`w-full max-w-5xl mx-auto rounded-xl overflow-hidden border-4 border-[#FF00A6] relative shadow-[0_0_20px_rgba(255,0,166,0.3)] bg-black/90 transition-all duration-1000`}>
            {/* Header Bar */}
            <div className="p-4 border-b-2 border-[#FF00A6] flex justify-between items-center bg-[#111111] backdrop-blur-md">
                <h3 className={`text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter ${NEON_GREEN}`}>
                    <Gamepad2 size={24} className={NEON_GREEN} /> CASTER TRIVIA CHALLENGE
                </h3>
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <Star
                            key={i}
                            size={24}
                            className={`${i < score ? 'fill-[#FF00A6] text-[#FF00A6] drop-shadow-[0_0_5px_rgba(255,0,166,0.5)]' : 'text-white/30'} transition-all duration-300`}
                        />
                    ))}
                </div>
            </div>

            {/* Game Area */}
            <div className="p-8 min-h-[300px] flex flex-col items-center justify-center text-center relative z-10 font-mono">

                {gameState === 'idle' ? (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-white uppercase">HOW WELL DO YOU KNOW YOUR CASTERS?</h2>
                        <p className={`text-lg ${NEON_GREEN}`}>TEST YOUR KNOWLEDGE AND EARN STARS!</p>
                        <button
                            onClick={startGame}
                            className={`px-8 py-4 bg-[#00FF41] text-black font-black rounded-lg hover:scale-[1.02] transition shadow-xl shadow-[#00FF41]/40 uppercase tracking-widest border-2 border-[#00FF41]`}
                        >
                            PLAY GAME
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl space-y-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-white uppercase">{currentQuestion.question}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((opt, idx) => {
                                let btnClass = "bg-black border-[#FF00A6]/50 text-white/90 hover:bg-[#FF00A6]/20";
                                if (gameState === 'answered') {
                                    if (idx === currentQuestion.correct) btnClass = "bg-[#00FF41]/70 text-black border-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.7)]";
                                    else if (idx === selectedOption) btnClass = "bg-red-900/70 text-white border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]";
                                    else btnClass = "bg-black/50 text-white/30 border-white/10 opacity-50";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={gameState === 'answered'}
                                        className={`p-4 rounded-lg border-2 font-bold uppercase transition-all ${btnClass}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {gameState === 'answered' && (
                            <button
                                onClick={startGame}
                                className="mt-6 px-6 py-2 bg-[#FF00A6] text-white font-bold rounded-lg hover:bg-[#FF00A6]/80 transition uppercase tracking-widest shadow-md shadow-[#FF00A6]/30"
                            >
                                NEXT QUESTION
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const CasterPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeCaster = CASTERS[activeIndex];

    const nextCaster = () => {
        setActiveIndex((prev) => (prev + 1) % CASTERS.length);
    };

    const prevCaster = () => {
        setActiveIndex((prev) => (prev - 1 + CASTERS.length) % CASTERS.length);
    };

    return (
        <div className="flex flex-col h-full relative z-10 overflow-y-auto p-6 pt-10 scrollbar-hide">

            {/* --- HERO SECTION (Redesigned) --- */}
            <div className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-center relative mb-24">

                {/* Left Side: Info (Text) */}
                <div className="w-full lg:w-3/5 p-8 lg:pl-16 z-20 flex flex-col justify-center space-y-6">
                    <div className="inline-block">
                        <span className={`bg-[#00FF41]/20 ${NEON_GREEN} border border-[#00FF41]/50 px-4 py-1.5 rounded-sm text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-[0_0_8px_rgba(0,255,65,0.3)]`}>
                            FEATURED TALENT
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,65,0.6)] leading-[0.9] uppercase">
                            {activeCaster.name}
                        </h1>
                        <h2 className={`text-2xl font-mono uppercase ${NEON_PINK}`}>
                            // {activeCaster.role}
                        </h2>
                    </div>

                    <p className="text-white/80 text-lg leading-relaxed max-w-xl backdrop-blur-sm bg-black/70 p-6 rounded-lg border-2 border-[#FF00A6]/50 shadow-xl shadow-black/70 font-mono">
                        {activeCaster.bio}
                    </p>

                    {/* Highlight Reel Panel */}
                    <div className="max-w-xl group cursor-pointer relative overflow-hidden rounded-lg border-2 border-[#00FF41]/50 shadow-2xl shadow-black/70 hover:border-[#00FF41] transition">
                        <div className={`h-32 w-full ${activeCaster.highlight.thumbnail} opacity-40 group-hover:opacity-60 transition bg-cover bg-center`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-14 h-14 bg-black/50 backdrop-blur-md rounded-sm flex items-center justify-center border-2 border-[#FF00A6] group-hover:scale-110 transition shadow-[0_0_10px_rgba(255,0,166,0.5)]`}>
                                <PlayCircle size={28} className={`${NEON_PINK} fill-transparent`} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 to-transparent">
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${NEON_GREEN}`}>TOP HIGHLIGHT</p>
                            <h3 className="text-white font-black text-lg leading-tight uppercase">{activeCaster.highlight.title}</h3>
                            <p className="text-white/50 text-xs mt-1 font-mono">{activeCaster.highlight.views} VIEWS</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className={`p-3 bg-black/50 rounded-lg hover:bg-[#1DA1F2]/70 hover:text-white transition border border-white/10 ${NEON_GREEN} hover:border-white/50`}>
                            <Twitter size={20} />
                        </button>
                        <button className={`p-3 bg-black/50 rounded-lg hover:bg-[#9146FF]/70 hover:text-white transition border border-white/10 ${NEON_PINK} hover:border-white/50`}>
                            <Twitch size={20} />
                        </button>
                        <button className="px-6 py-3 bg-[#FF00A6] text-white rounded-lg font-bold hover:bg-[#FF00A6]/80 transition shadow-xl shadow-[#FF00A6]/30 flex items-center gap-2 uppercase tracking-widest">
                            PROFILE <ArrowIcon size={16} />
                        </button>
                    </div>
                </div>

                {/* Right Side: Hero Image */}
                <div className="w-full lg:w-1/2 lg:mt-10 lg:h-[650px] relative flex items-end justify-center pointer-events-none">
                    <img
                        key={activeCaster.id}
                        src={activeCaster.image}
                        alt={activeCaster.name}
                        className={`h-[500px] lg:h-[650px] w-auto object-cover object-bottom drop-shadow-2xl animate-fade-in-up z-0 border-b-4 border-l-4 border-r-4 border-[#00FF41]/70 shadow-[0_0_40px_rgba(0,255,65,0.4)] transition-all duration-500`}
                        style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                    />
                    <div className="absolute bottom-0 right-20 w-[600px] h-[600px] bg-[#00FF41]/10 rounded-full blur-[120px] -z-10 opacity-50"></div>
                </div>

                {/* Navigation Arrows */}
                <button onClick={prevCaster} className={`absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-lg bg-black/50 hover:bg-[#00FF41]/30 border-2 border-[#00FF41]/50 backdrop-blur-md text-white ${NEON_GREEN} transition z-30 pointer-events-auto shadow-[0_0_10px_rgba(0,255,65,0.3)]`}><ArrowLeft size={24} /></button>
                <button onClick={nextCaster} className={`absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-lg bg-black/50 hover:bg-[#FF00A6]/30 border-2 border-[#FF00A6]/50 backdrop-blur-md text-white ${NEON_PINK} transition z-30 pointer-events-auto shadow-[0_0_10px_rgba(255,0,166,0.3)]`}><ArrowRight size={24} /></button>
            </div>



            {/* --- TOURNAMENT HUB SECTION (Redesigned) --- */}
            <div className="w-full max-w-7xl mx-auto mb-20 relative z-30">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">TOURNAMENT HUB</h2>
                        <p className="text-white/60 text-sm font-mono">TRACK ONGOING AND UPCOMING MAJOR EVENTS</p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-sm bg-red-800/50 border border-red-500/70 text-red-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.4)]`}><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> LIVE NOW</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* ONGOING EVENTS */}
                    <div className="space-y-4">
                        <h3 className={`text-white/50 font-bold text-sm uppercase tracking-widest mb-4 border-b border-[#00FF41]/50 pb-2 ${NEON_GREEN}`}>ONGOING ACTION</h3>
                        {TOURNAMENTS_DATA.filter(t => t.status === 'ongoing').map((event) => (
                            <div key={event.id} className="bg-black/70 border-2 border-[#00FF41]/50 rounded-lg p-5 relative overflow-hidden group hover:border-[#00FF41] transition shadow-lg shadow-black/50">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition"><Zap size={64} className={NEON_GREEN} /></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            {event.tags.map(tag => <span key={tag} className={`px-2 py-0.5 bg-red-800/50 text-red-400 text-[10px] font-bold rounded uppercase border border-red-400/50`}>{tag}</span>)}
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-1 uppercase">{event.name}</h4>
                                        <p className="text-white/50 text-xs font-mono flex items-center gap-2"><MapPin size={12} className={NEON_GREEN} /> {event.location} • {event.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1 font-mono">ON DESK</p>
                                        <div className="flex -space-x-2 justify-end">
                                            {event.casters.map(cid => {
                                                const c = CASTERS.find(cast => cast.id === cid);
                                                return c ? <img key={cid} src={c.image} className="w-8 h-8 rounded-full border-2 border-[#111111] bg-black/50 object-cover shadow-md" alt={c.name} title={c.name} /> : null
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* UPCOMING EVENTS */}
                    <div className="space-y-4">
                        <h3 className={`text-white/50 font-bold text-sm uppercase tracking-widest mb-4 border-b border-[#FF00A6]/50 pb-2 ${NEON_PINK}`}>UPCOMING MAJORS</h3>
                        {TOURNAMENTS_DATA.filter(t => t.status === 'upcoming').map((event) => (
                            <div key={event.id} className="bg-black/70 border-2 border-[#FF00A6]/50 rounded-lg p-5 hover:bg-black/50 transition group shadow-lg shadow-black/50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className={`text-lg font-bold text-white uppercase group-hover:${NEON_PINK} transition`}>{event.name}</h4>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-white/50 font-mono">
                                            <span className={`flex items-center gap-1 ${NEON_PINK}`}><Calendar size={12} /> {event.date}</span>
                                            <span className={`flex items-center gap-1 ${NEON_PINK}`}><MapPin size={12} /> {event.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {event.tags.includes('$1M Prize') && <span className={`text-[#00FF41] text-xs font-bold flex items-center gap-1 shadow-md shadow-[#00FF41]/20`}><Trophy size={12} /> $1M PRIZE</span>}
                                        <div className="flex -space-x-2 opacity-60 group-hover:opacity-100 transition">
                                            {event.casters.map(cid => {
                                                const c = CASTERS.find(cast => cast.id === cid);
                                                return c ? <img key={cid} src={c.image} className="w-6 h-6 rounded-full border border-[#111111] bg-black/50 object-cover" alt={c.name} /> : null
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>


            <div className="w-full max-w-7xl mx-auto mb-12 relative z-30">
                <div className="flex items-center justify-center mb-8">
                    <div className={`h-px w-16 bg-[#FF00A6] mr-4 shadow-md shadow-[#FF00A6]/30`}></div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">FAN ZONE</h2>
                    <div className={`h-px w-16 bg-[#FF00A6] ml-4 shadow-md shadow-[#FF00A6]/30`}></div>
                </div>

                <CasterGame />
            </div>

        </div>
    );
}

// ------------------------------------
// 4. RESTREAM/VOD COMPONENT (from viewer_restream.jsx)
// ------------------------------------

const MOCK_VOD = 'FINISHED LIVE MATCH – GRAND FINALS REPLAY';

const RestreamPage = () => {
    const [subscribed, setSubscribed] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [donation, setDonation] = useState(0);
    const [premium, setPremium] = useState(false);
    const [tempDonation, setTempDonation] = useState('');

    // --- Mock Ad Interruptions ---
    useEffect(() => {
        if (subscribed) return;
        const timer = setInterval(() => {
            setShowAd(true);
            setTimeout(() => setShowAd(false), 3000);
        }, 15000);
        return () => clearInterval(timer);
    }, [subscribed]);

    // --- Donation Gate ---
    const handleDonate = () => {
        const amount = parseFloat(tempDonation);
        if (amount >= 10) {
            setDonation(amount);
            setPremium(true);
            // In a real app, this would trigger a payment gateway
        } else if (amount > 0) {
            setDonation(amount);
        }
        // Use a modal/toast for feedback, not alert()
        console.log(`Donated $${amount}. Premium status: ${amount >= 10 ? 'Unlocked' : 'Locked'}`);
        setTempDonation('');
    };

    return (
        <div className="flex h-[calc(100vh-80px)] p-6 gap-6 relative z-10">
            {/* --- Video & Info --- */}
            <div className="flex-1 flex flex-col gap-6">

                {/* Video container with sharp borders and glow */}
                <div className={`relative flex-1 bg-black/80 border-4 border-[#FF00A6]/70 rounded-lg overflow-hidden group ${NEON_SHADOW_PINK} transition-all duration-300`}>

                    {/* Video Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <div className="text-center">
                            <PlayCircle size={72} className={`${NEON_PINK} mx-auto fill-transparent transition-all duration-500`} strokeWidth={1.5} />
                            <p className={`mt-4 ${NEON_PINK} font-bold tracking-wide uppercase`}>{MOCK_VOD}</p>
                        </div>
                    </div>

                    {/* Ad Overlay */}
                    {showAd && !subscribed && (
                        <div className="absolute inset-0 bg-black/95 z-30 flex items-center justify-center">
                            <div className="text-center space-y-4 p-8 border-4 border-[#00FF41] rounded-lg shadow-2xl shadow-[#00FF41]/40">
                                <p className="text-2xl font-black text-white uppercase">SPONSORED AD INTERRUPT</p>
                                <p className={`${NEON_GREEN} font-mono`}>SUBSCRIBE TO REMOVE ADS INSTANTLY</p>
                                <button
                                    onClick={() => setSubscribed(true)}
                                    className="px-6 py-2 rounded-lg bg-[#00FF41] text-black font-black uppercase tracking-widest hover:bg-[#FF00A6] hover:text-white transition shadow-lg shadow-[#00FF41]/30"
                                >
                                    SUBSCRIBE NOW
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between bg-linear-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition">
                        <div className="flex items-center gap-4 text-white">
                            <PlayCircle size={24} className={`hover:${NEON_GREEN}`} />
                            <Volume2 size={24} className={`hover:${NEON_GREEN}`} />
                            <div className='flex items-center gap-1'>
                                <span className='text-white/50 text-xs uppercase'>QUALITY:</span>
                                {premium ? (
                                    <select className={`bg-black/50 border border-[#00FF41]/50 rounded-sm px-2 text-white text-xs ${NEON_GREEN} focus:ring-1 focus:ring-[#00FF41] cursor-pointer`}>
                                        <option className='bg-black'>1080p</option>
                                        <option className='bg-black'>4K (Premium)</option>
                                    </select>
                                ) : (
                                    <Lock size={16} className="text-white/40 ml-2" />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className='flex items-center gap-1'>
                                <span className='text-white/50 text-xs uppercase'>SPEED:</span>
                                {premium ? (
                                    <select className={`bg-black/50 border border-[#00FF41]/50 rounded-sm px-2 text-white text-xs ${NEON_GREEN} focus:ring-1 focus:ring-[#00FF41] cursor-pointer`}>
                                        <option className='bg-black'>1x</option>
                                        <option className='bg-black'>1.5x</option>
                                        <option className='bg-black'>2x (Premium)</option>
                                    </select>
                                ) : (
                                    <Lock size={16} className="text-white/40 ml-2" />
                                )}
                            </div>
                            <Settings size={20} className={`hover:${NEON_GREEN}`} />
                            <Maximize2 size={20} className={`hover:${NEON_GREEN}`} />
                        </div>
                    </div>
                </div>

                {/* Channel Info (Sharp, Dark) */}
                <div className="bg-black/70 border-2 border-[#00FF41]/50 rounded-lg p-6 flex justify-between items-center shadow-lg shadow-black/50">
                    <div>
                        <h2 className={`text-2xl font-black text-white uppercase tracking-tighter ${NEON_GREEN}`}>ESPORTRESTREAM CHANNEL</h2>
                        <div className="flex items-center gap-3 text-sm text-white/50 mt-1 font-mono">
                            <Gamepad2 size={14} className={NEON_PINK} /> League of Legends // 128K Subscribers
                        </div>
                    </div>
                    {!subscribed ? (
                        <button
                            onClick={() => setSubscribed(true)}
                            className="px-6 py-3 rounded-lg bg-[#FF00A6] text-white font-bold uppercase tracking-widest hover:bg-[#FF00A6]/80 transition shadow-lg shadow-[#FF00A6]/30"
                        >
                            SUBSCRIBE
                        </button>
                    ) : (
                        <span className={`flex items-center gap-2 ${NEON_GREEN} font-bold uppercase`}>
                            <CheckCircle size={18} /> ACCESS GRANTED
                        </span>
                    )}
                </div>
            </div>

            {/* --- Chat (Redesigned) --- */}
            <div className={`w-96 bg-black/80 border-4 border-[#FF00A6]/70 rounded-lg flex flex-col shadow-2xl ${NEON_SHADOW_PINK} overflow-hidden`}>
                <div className="p-4 border-b-2 border-[#FF00A6]/50 flex items-center gap-2 font-black uppercase text-white bg-black/50">
                    <MessageSquare size={18} className={NEON_PINK} /> RESTREAM CHAT
                </div>

                <div className="flex-1 p-4 space-y-3 overflow-y-auto font-mono text-sm">
                    <p className={`${NEON_GREEN}/70`}>[SYSTEM] CHAT CONNECTED...</p>
                    <div className="flex gap-2 text-white">
                        <span className={NEON_GREEN}>[BOT]:</span> <span className='text-white/80'>THE FINAL MAP IS STARTING SOON.</span>
                    </div>
                    <div className="flex gap-2 text-white">
                        <span className={NEON_PINK}>[USER_01]:</span> <span className='text-white/80'>THE VOD QUALITY IS AMAZING!</span>
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t-2 border-[#00FF41]/50 bg-black/50 space-y-3">
                    {/* Donation Gate Message */}
                    {!premium && (
                        <div className={`text-xs ${NEON_PINK} font-mono text-center border-b border-[#FF00A6]/30 pb-2`}>
                            DONATE $10+ TO UNLOCK PREMIUM VIEWING (4K, SPEED, CC)
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            type='text'
                            className="flex-1 bg-black/50 border-2 border-[#FF00A6]/50 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition shadow-inner shadow-black/70 font-mono"
                            placeholder="SEND MESSAGE..."
                        />
                        <button className="p-2 bg-[#FF00A6] rounded-lg text-white hover:bg-[#FF00A6]/80 transition shadow-lg shadow-[#FF00A6]/30">
                            <Send size={16} />
                        </button>
                    </div>

                    {/* Media + Donate */}
                    <div className="flex justify-between items-center text-white/50">
                        <div className="flex gap-3">
                            <MessageSquare size={20} className="cursor-not-allowed hover:text-white transition" />
                            <Image size={20} className="cursor-not-allowed hover:text-white transition" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                placeholder='$ AMOUNT'
                                value={tempDonation}
                                onChange={(e) => setTempDonation(e.target.value)}
                                className='w-24 bg-black/50 border border-white/20 text-white px-2 py-1 rounded-sm text-xs font-mono focus:border-[#00FF41] focus:outline-none'
                            />
                            <button
                                onClick={handleDonate}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#00FF41] text-black font-black uppercase text-xs hover:bg-[#00FF41]/80 transition shadow-lg shadow-[#00FF41]/30`}
                            >
                                <DollarSign size={16} /> DONATE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ------------------------------------
// 5. MAIN APP COMPONENT
// ------------------------------------

export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { id: 'home', label: 'HOME', icon: Home },
        { id: 'live', label: 'LIVE VIEW', icon: PlayCircle },
        { id: 'schedule', label: 'SCHEDULE', icon: CalendarDays },
        { id: 'caster', label: 'CASTER HUB', icon: Mic2 },
        { id: 'restreamer', label: 'VOD / RESTREAMS', icon: Repeat },
        { id: 'profile', label: 'PROFILE', icon: User },
    ];

    return (
        <div className="h-dvh w-screen overflow-hidden font-sans text-slate-200 bg-black flex flex-col">
            
            {/* --- 1. PERSISTENT TOP HEADER --- */}
            <header className="h-16 flex items-center justify-between px-4 bg-[#111111] border-b-2 border-[#00FF41]/50 shadow-md shadow-black/50 z-50 shrink-0">
                <div className="flex items-center gap-4">
                    {/* Hamburger Menu */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="p-2 text-white/70 hover:text-[#00FF41] transition bg-white/5 rounded-md"
                    >
                        <Menu size={24} />
                    </button>
                    
                    {/* Logo (Smaller for Header) */}
                    <div className="text-xl font-black uppercase tracking-tighter text-[#00FF41] flex items-center gap-2 hidden md:flex">
    <img 
        src="src/assets/logo14.png" 
        alt="EsportRestream Logo" 
        className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,0,166,0.5)]" 
    />
    ESPORTSRESTREAM
</div>
                </div>

                {/* Persistent Search Bar */}
                <div className="flex-1 max-w-xl px-4">
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="SEARCH STREAMS, TOURNAMENTS, CASTERS..." 
                            className="w-full bg-[#222222] border border-white/20 rounded-full py-2 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition text-sm font-mono"
                        />
                        <Search size={18} className="absolute left-4 top-2.5 text-white/50 group-focus-within:text-[#00FF41] transition" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-white/70 hover:text-[#FF00A6] transition"><Bell size={20} /></button>
                    <div onClick={() => setActiveTab('profile')} className="w-8 h-8 rounded-full bg-white/20 border border-[#00FF41] flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                        <User size={16} className="text-[#00FF41]" />
                    </div>
                </div>
            </header>

            {/* --- 2. MAIN LAYOUT (Sidebar + Content) --- */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                
                {/* Sidebar */}
                <aside className={`
                    bg-[#111111] border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col shrink-0
                    ${isSidebarOpen ? 'w-64' : 'w-16'}
                `}>
                    <div className="flex-1 py-4 flex flex-col gap-2 px-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center gap-4 px-3 py-3 rounded-lg font-bold transition whitespace-nowrap overflow-hidden
                                    ${activeTab === item.id 
                                        ? 'bg-[#FF00A6]/20 text-[#FF00A6] border border-[#FF00A6]/50' 
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                                title={!isSidebarOpen ? item.label : ""}
                            >
                                <item.icon size={20} className="shrink-0" />
                                <span className={`text-sm uppercase tracking-wider transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    {/* Bottom Logout Button */}
                    <div className="p-2 border-t border-white/10">
                        <button className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-white/50 hover:text-red-500 hover:bg-red-500/10 transition overflow-hidden">
                            <LogOut size={20} className="shrink-0" />
                            <span className={`text-sm font-bold uppercase transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>LOGOUT</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 h-full overflow-hidden relative">
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute inset-0 bg-repeat bg-size-[20px_20px] opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #00FF4120 1px, transparent 1px), linear-gradient(to bottom, #00FF4120 1px, transparent 1px)' }}></div>
                    </div>
                    
                    {/* Render Active Page */}
                    <div className="relative z-10 h-full w-full">
                        {activeTab === 'home' && <HomePage />}
                        {activeTab === 'live' && <LiveStreamingPage />}
                        {activeTab === 'schedule' && <TournamentSchedulePage />}
                        {activeTab === 'caster' && <CasterPage />}
                        {activeTab === 'restreamer' && <RestreamPage />}
                        {activeTab === 'profile' && <UserProfilePage />}
                    </div>
                </main>

            </div>
        </div>
    );
}