import React, { useState, useEffect } from 'react';
import { db, auth, provider } from '../firebase';
import { ref, push, onValue, serverTimestamp, get, set, update, remove } from 'firebase/database';
import { signInWithPopup, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import {
    PlayCircle, Mic2, Repeat, Trophy, Settings, Search, MessageSquare, Heart, Send, Gamepad2, Bell, User, PanelRightClose, PanelRightOpen, Maximize2, Volume2, ArrowLeft, ArrowRight, Twitter, Twitch, ArrowRight as ArrowIcon, Calendar, MapPin, Zap, Star, DollarSign, Lock, CheckCircle, Image, Menu, Home, CalendarDays, Hash, LogOut, History, CreditCard, Video, Shield, LogIn, MonitorPlay, Users, Info, Box, TrendingUp, Edit3, Trash2, StopCircle, AlarmClock, PlusCircle
} from 'lucide-react';

const NEON_GREEN = 'text-[#00FF41]';
const NEON_PINK = 'text-[#FF00A6]';

// ==========================================
// 1. NOW STREAMING PAGE (Live View)
// ==========================================
const LiveStreamingPage = ({ selectedLive, setSelectedLive, user }) => {
    const [chatVisible, setChatVisible] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');

    const currentVideoId = selectedLive?.videoId;
    const currentStreamerId = selectedLive?.streamerId;
    const currentStreamerName = selectedLive?.streamerName;

    useEffect(() => {
        if(!currentVideoId) return;
        const chatRef = ref(db, `liveChats/${currentVideoId}`);
        onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setMessages(Object.keys(data).map(key => ({ id: key, ...data[key] })));
            else setMessages([]);
        });
    }, [currentVideoId]);

    useEffect(() => {
        if (user && currentStreamerId) {
            const subRef = ref(db, `subscriptions/${user.uid}/${currentStreamerId}`);
            onValue(subRef, (snapshot) => setIsSubscribed(snapshot.exists()));
        }
    }, [user, currentStreamerId]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !user || !currentVideoId) return;
        push(ref(db, `liveChats/${currentVideoId}`), {
            text: newMessage, userId: user.uid, userName: user.displayName || 'Anonymous', timestamp: serverTimestamp()
        });
        setNewMessage('');
    };

    const handleSubscribe = () => {
        if (!user) return alert("Please login to subscribe!");
        if (isSubscribed) {
            remove(ref(db, `subscriptions/${user.uid}/${currentStreamerId}`));
            push(ref(db, `notifications/${user.uid}`), { text: `Unsubscribed from ${currentStreamerName}.`, time: serverTimestamp(), read: false });
        } else {
            set(ref(db, `subscriptions/${user.uid}/${currentStreamerId}`), { streamerName: currentStreamerName, timestamp: serverTimestamp() });
            push(ref(db, `notifications/${user.uid}`), { text: `Successfully subscribed to ${currentStreamerName}!`, time: serverTimestamp(), read: false });
        }
    };

    const handleDonate = () => {
        if (!user) return alert("Please login to donate!");
        const amount = parseFloat(donationAmount);
        if (amount > 0 && currentStreamerId) {
            const earningsRef = ref(db, `earnings/${currentStreamerId}/donations`);
            get(earningsRef).then((snapshot) => {
                const currentTotal = snapshot.val() || 0;
                set(earningsRef, currentTotal + amount).then(() => {
                    alert(`Successfully donated $${amount} to ${currentStreamerName}!`);
                    push(ref(db, `notifications/${user.uid}`), { text: `You donated $${amount} to ${currentStreamerName}! Thank you for your support.`, time: serverTimestamp(), read: false });
                    setDonationAmount('');
                });
            });
        }
    };

    const handleEndLive = () => {
        if (window.confirm("Are you sure you want to end your live stream?")) {
            remove(ref(db, `activeStreams/${user.uid}`));
            setSelectedLive(null);
        }
    };

    if(!currentVideoId) {
        return (
            <div className="flex items-center justify-center h-full p-8 text-center flex-col gap-4">
                <MonitorPlay size={64} className="text-[#FF00A6] opacity-50" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">No Stream Selected</h2>
                <p className="text-white/50 font-mono">Please go to the "LIVES" page and select an active broadcast to watch.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full p-6 gap-6 relative z-10 overflow-hidden">
            <div className={`flex-1 flex flex-col gap-6 transition-all duration-500 relative`}>
                <div className={`flex-1 bg-black border-4 border-[#00FF41]/70 rounded-lg overflow-hidden relative shadow-[0_0_15px_rgba(0,255,65,0.6)] group`}>
                    <div className="absolute top-0 left-0 right-0 p-6 z-20 bg-linear-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
                        <div className="flex items-start justify-between">
                            <div className="pointer-events-auto">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-red-700 shadow-[0_0_15px_rgba(0,255,65,0.6)] text-[#00FF41] text-[12px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-widest animate-pulse border border-[#00FF41]">LIVE FEED</span>
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-xl uppercase">{currentStreamerName}'S BROADCAST</h1>
                            </div>
                            {user?.uid === currentStreamerId && (
                                <button onClick={handleEndLive} className="pointer-events-auto px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(255,0,0,0.6)] flex items-center gap-2 transition">
                                    <StopCircle size={18} /> END LIVE
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="absolute inset-0 z-10">
                        <iframe className="w-full h-full pointer-events-auto" src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=0`} title="Live Stream" frameBorder="0" allowFullScreen></iframe>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-linear-to-t from-black/90 to-transparent flex items-end justify-end pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
                        <button onClick={() => setChatVisible(!chatVisible)} className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-xs font-bold transition backdrop-blur-md shadow-lg ${chatVisible ? 'bg-[#FF00A6]/80 border-[#FF00A6] text-white' : 'bg-black/80 border-white/20 text-white/70'}`}>
                            {chatVisible ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />} {chatVisible ? 'HIDE CHAT' : 'SHOW CHAT'}
                        </button>
                    </div>
                </div>

                <div className="bg-black/70 border-2 border-[#00FF41]/50 rounded-lg p-6 flex justify-between items-center shadow-lg shadow-black/50 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-[#00FF41]">{currentStreamerName || 'ESPORTRESTREAM NETWORK'}</h2>
                        <div className="flex items-center gap-3 text-sm text-white/50 mt-1 font-mono"><MonitorPlay size={14} className="text-[#FF00A6]" /> Live Match Broadcasting</div>
                    </div>
                    {user?.uid !== currentStreamerId && (
                        <button onClick={handleSubscribe} className={`px-6 py-3 rounded-lg font-bold uppercase tracking-widest transition ${isSubscribed ? 'bg-white/10 text-white border border-white/30' : 'bg-[#FF00A6] text-white hover:bg-[#FF00A6]/80 shadow-[0_0_10px_rgba(255,0,166,0.5)]'}`}>
                            {isSubscribed ? 'UNSUBSCRIBE' : 'SUBSCRIBE'}
                        </button>
                    )}
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${chatVisible ? 'w-96 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10 p-0'}`}>
                <div className="h-full bg-black/80 backdrop-blur-2xl border-4 border-[#FF00A6]/70 rounded-lg flex flex-col shadow-[0_0_15px_rgba(255,0,166,0.4)]">
                    <div className="flex justify-between items-center p-4 border-b-2 border-[#FF00A6]/50 bg-black/50">
                        <h2 className="text-lg font-black text-white flex items-center gap-2 text-[#FF00A6]"><MessageSquare size={18} /> LIVE CHAT</h2>
                        <button onClick={() => setChatVisible(false)} className="text-white/50 hover:text-[#00FF41]"><PanelRightClose size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs font-mono">
                        {messages.length === 0 && <p className="text-[#00FF41]/70 text-center uppercase">No messages yet.</p>}
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex gap-3 items-start p-2 rounded-sm hover:bg-white/5 transition">
                                <span className="font-bold text-[#00FF41] uppercase shrink-0">{msg.userName}:</span>
                                <p className="text-white text-sm break-words">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t-2 border-[#00FF41]/50 bg-black/50 space-y-3">
                        <div className="flex gap-2">
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="SEND MESSAGE..." className="flex-1 bg-black/50 border-2 border-[#FF00A6]/50 rounded-lg py-2 px-3 text-white font-mono outline-none focus:border-[#00FF41]"/>
                            <button onClick={handleSendMessage} className="p-2 bg-[#00FF41] rounded-lg text-black hover:bg-[#FF00A6] hover:text-white transition"><Send size={16} /></button>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                            <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="$ AMOUNT" className="w-24 bg-black/50 border-2 border-white/20 rounded-lg py-2 px-3 text-white font-mono outline-none focus:border-[#00FF41] text-xs"/>
                            <button onClick={handleDonate} className="flex-1 bg-[#FF00A6] rounded-lg text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#FF00A6]/80"><DollarSign size={14}/> DONATE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. LIVES PAGE 
// ==========================================
const LivesPage = ({ setSelectedLive, setActiveTab }) => {
    const [activeStreams, setActiveStreams] = useState([]);

    useEffect(() => {
        onValue(ref(db, 'activeStreams'), (snapshot) => {
            if (snapshot.exists()) setActiveStreams(Object.values(snapshot.val()));
            else setActiveStreams([]);
        });
    }, []);

    const handleWatchLive = (stream) => {
        setSelectedLive(stream);
        setActiveTab('live');
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3">
                <MonitorPlay className="text-[#00FF41]" /> ACTIVE LIVES
            </h2>
            {activeStreams.length === 0 ? (
                <div className="bg-black/50 border border-white/20 p-8 rounded-lg text-center">
                    <p className="text-white/50 font-mono text-lg uppercase tracking-widest">No creators are currently live. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeStreams.map(stream => (
                        <div key={stream.streamerId} className="bg-black border-2 border-[#00FF41]/50 rounded-lg overflow-hidden group shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all">
                            <div className="h-48 relative">
                                <iframe className="w-full h-full pointer-events-none" src={`https://www.youtube.com/embed/${stream.videoId}?mute=1`} frameBorder="0"></iframe>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
                                    <button onClick={() => handleWatchLive(stream)} className="bg-[#00FF41] text-black px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-[#FF00A6] hover:text-white transition shadow-xl shadow-[#00FF41]/50 flex items-center gap-2">
                                        <PlayCircle size={20}/> WATCH LIVE
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-black/90 flex justify-between items-center border-t border-[#00FF41]/30">
                                <h3 className="text-white font-bold uppercase truncate pr-4">{stream.streamerName}</h3>
                                <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded animate-pulse font-bold tracking-wider shrink-0 shadow-[0_0_10px_rgba(255,0,0,0.6)]">LIVE</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 3. HOME PAGE (VODs Player)
// ==========================================
const HomePage = () => {
    const [allStreams, setAllStreams] = useState([]);
    const [playingVodId, setPlayingVodId] = useState(null);

    useEffect(() => {
        onValue(ref(db, 'streams'), (snapshot) => {
            const data = snapshot.val();
            if(data) setAllStreams(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
        });
    }, []);

    if (playingVodId) {
        return (
            <div className="p-8 h-full flex flex-col bg-black">
                <button onClick={() => setPlayingVodId(null)} className="mb-4 text-[#FF00A6] font-bold uppercase flex items-center gap-2 hover:text-white transition w-fit">
                    <ArrowLeft size={18}/> BACK TO HOME
                </button>
                <div className="flex-1 bg-black border-4 border-[#FF00A6]/70 rounded-lg overflow-hidden relative shadow-[0_0_20px_rgba(255,0,166,0.6)]">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${playingVodId}?autoplay=1&mute=0`} allowFullScreen frameBorder="0"></iframe>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="w-full h-48 bg-linear-to-r from-[#FF00A6]/20 to-[#00FF41]/20 border-2 border-[#00FF41]/50 rounded-xl flex flex-col items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter">TRENDING <span className="text-[#00FF41]">VODS</span></h1>
            </div>
            {allStreams.length === 0 ? <p className="text-white/50 text-center font-mono">No VODs available.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allStreams.map(stream => (
                        <div key={stream.id} className="bg-black border-2 border-white/10 rounded-lg overflow-hidden hover:border-[#FF00A6] transition group">
                            <div className="h-48 relative">
                                <iframe className="w-full h-full pointer-events-none" src={`https://www.youtube.com/embed/${stream.videoId}?mute=1`} title="VOD" frameBorder="0"></iframe>
                                <div className="absolute inset-0 bg-transparent z-10"></div>
                            </div>
                            <div className="p-4 bg-black/80 flex flex-col">
                                <h3 className="text-white font-bold uppercase truncate">{stream.streamerName}'s Broadcast</h3>
                                <button onClick={() => setPlayingVodId(stream.videoId)} className="mt-4 px-4 py-3 bg-[#FF00A6]/20 text-[#FF00A6] text-sm font-bold uppercase tracking-widest rounded border border-[#FF00A6]/50 hover:bg-[#FF00A6] hover:text-white transition text-center shadow-lg">
                                    Watch Full Stream
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 4. TOURNAMENTS PAGE (Alarm System)
// ==========================================
const TournamentsPage = () => {
    const [tournaments, setTournaments] = useState([]);
    const [alarms, setAlarms] = useState({});

    useEffect(() => {
        onValue(ref(db, 'tournaments'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // အချိန်နီးတဲ့ပွဲတွေကို အပေါ်မှာပြရန် Sort လုပ်ခြင်း
                const sortedData = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => new Date(a.time) - new Date(b.time));
                setTournaments(sortedData);
            } else setTournaments([]);
        });
    }, []);

    // Browser Notification API
    const handleSetAlarm = (tournament) => {
        const targetTime = new Date(tournament.time).getTime();
        const now = Date.now();
        const delay = targetTime - now;

        if (delay < 0) {
            alert("This match has already started or the time has passed!");
            return;
        }

        if ("Notification" in window) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    setAlarms(prev => ({ ...prev, [tournament.id]: true }));
                    alert(`Alarm set successfully! We will notify you when ${tournament.name} starts.`);
                    
                    // JS setTimeout Logic for trigger
                    setTimeout(() => {
                        new Notification("EsportRestream: Match Starting Now!", {
                            body: `${tournament.name} is live! Go check the LIVES page.`,
                            icon: "https://cdn-icons-png.flaticon.com/512/808/808439.png" // Alarm Icon
                        });
                        setAlarms(prev => ({ ...prev, [tournament.id]: false })); 
                    }, delay);
                    
                } else {
                    alert("Please allow Browser Notifications to set alarms.");
                }
            });
        } else {
            alert("Your browser does not support notifications.");
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3"><CalendarDays className="text-[#FF00A6]" /> TOURNAMENT SCHEDULES</h2>
            
            {tournaments.length === 0 ? (
                <div className="bg-black/50 border border-white/20 p-8 rounded-lg text-center">
                    <p className="text-white/50 font-mono text-lg uppercase tracking-widest">No upcoming tournaments scheduled yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tournaments.map(t => (
                        <div key={t.id} className="bg-black/80 border-2 border-white/10 p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[#FF00A6]/50 transition">
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="bg-[#FF00A6]/10 p-3 rounded-full border border-[#FF00A6]/30">
                                    <Gamepad2 className="text-[#FF00A6]" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{t.name}</h3>
                                    <p className="text-[#00FF41] font-mono mt-1 text-sm font-bold flex items-center gap-2 justify-center md:justify-start">
                                        <Calendar size={14} /> {new Date(t.time).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleSetAlarm(t)}
                                disabled={alarms[t.id]}
                                className={`px-6 py-3 font-bold uppercase tracking-widest rounded-lg transition flex items-center gap-2 shadow-lg ${alarms[t.id] ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20' : 'bg-[#00FF41] text-black hover:bg-[#FF00A6] hover:text-white shadow-[#00FF41]/30'}`}
                            >
                                <AlarmClock size={18} /> {alarms[t.id] ? 'ALARM SET' : 'SET ALARM'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 5. ADMIN PANEL (For Tournament Management)
// ==========================================
const AdminPanel = () => {
    const [matchName, setMatchName] = useState('');
    const [matchTime, setMatchTime] = useState('');

    const handleAddTournament = () => {
        if (!matchName || !matchTime) return alert("Please fill all fields.");
        push(ref(db, 'tournaments'), {
            name: matchName,
            time: matchTime,
            timestamp: serverTimestamp()
        }).then(() => {
            alert('Tournament Schedule Added Successfully!');
            setMatchName('');
            setMatchTime('');
        });
    };

    return (
        <div className="p-8 h-full overflow-y-auto max-w-3xl">
            <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3"><Shield className="text-red-500" /> SYSTEM ADMIN PANEL</h2>
            
            <div className="bg-black/60 border-2 border-red-500/50 p-8 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                <h3 className="text-xl font-bold text-white mb-6 uppercase border-b border-white/10 pb-4">Manage Tournament Schedules</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 block">Match Name / Title</label>
                        <input type="text" value={matchName} onChange={e => setMatchName(e.target.value)} placeholder="e.g., Grand Finals PMCL 2026" className="w-full bg-black/50 border border-white/20 rounded p-3 text-white outline-none focus:border-red-500 transition"/>
                    </div>
                    <div>
                        <label className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 block">Start Date & Time</label>
                        <input type="datetime-local" value={matchTime} onChange={e => setMatchTime(e.target.value)}style={{ colorScheme: 'dark' }} className="w-full bg-black/50 border border-white/20 rounded p-3 text-white outline-none focus:border-red-500 transition font-mono"/>
                    </div>
                    <button onClick={handleAddTournament} className="w-full mt-4 bg-red-600 text-white font-black uppercase tracking-widest py-3 rounded hover:bg-red-500 transition flex justify-center items-center gap-2">
                        <PlusCircle size={20} /> PUBLISH SCHEDULE
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 6. CREATOR STUDIO
// ==========================================
const StreamerDashboard = ({ user }) => {
    const [streamLink, setStreamLink] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [activeSubTab, setActiveSubTab] = useState('golive');
    const [earnings, setEarnings] = useState({ donations: 0, adRevenue: 0 });

    useEffect(() => {
        if (user) {
            onValue(ref(db, `earnings/${user.uid}`), (snapshot) => {
                if (snapshot.exists()) setEarnings(snapshot.val());
            });
        }
    }, [user]);

    const handleStartStream = () => {
        const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|watch\?v=|watch\?.+&v=)?)([\w-]{11})/;
        const match = streamLink.match(regExp);
        const videoId = match ? match[1] : null;

        if (videoId && user) {
            const streamData = {
                videoId: videoId, streamerId: user.uid, streamerName: user.displayName || 'Creator', timestamp: serverTimestamp()
            };
            set(ref(db, `activeStreams/${user.uid}`), streamData);
            push(ref(db, 'streams'), streamData).then(() => {
                setStatusMsg('SUCCESS: STREAM IS NOW LIVE!'); 
                setStreamLink(''); 
                push(ref(db, `notifications/${user.uid}`), { text: `Your stream is now LIVE on the platform!`, time: serverTimestamp(), read: false });
                setTimeout(() => setStatusMsg(''), 5000);
            });
        } else setStatusMsg('ERROR: INVALID YOUTUBE LINK.');
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3"><Video className="text-[#00FF41]" /> CREATOR STUDIO</h2>
            <div className="flex gap-4 mb-8 border-b border-white/20 pb-4">
                <button onClick={()=>setActiveSubTab('golive')} className={`px-4 py-2 font-bold uppercase rounded ${activeSubTab==='golive' ? 'bg-[#00FF41] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>Go Live</button>
                <button onClick={()=>setActiveSubTab('earn')} className={`px-4 py-2 font-bold uppercase rounded ${activeSubTab==='earn' ? 'bg-[#00FF41] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>Earnings</button>
                <button onClick={()=>setActiveSubTab('monetize')} className={`px-4 py-2 font-bold uppercase rounded ${activeSubTab==='monetize' ? 'bg-[#00FF41] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>Monetization Hub</button>
            </div>

            {activeSubTab === 'golive' && (
                <div className="bg-black/60 border-2 border-[#00FF41]/50 p-8 rounded-lg max-w-3xl">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase">Go Live Setup</h3>
                    <p className="text-white/50 font-mono mb-6 text-sm">Paste your YouTube broadcast link. It will automatically appear in the LIVES page for everyone to watch.</p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input type="text" value={streamLink} onChange={(e) => setStreamLink(e.target.value)} placeholder="YouTube Link..." className="flex-1 bg-[#111111] border-2 border-[#00FF41]/30 rounded-lg py-3 px-4 text-white font-mono outline-none"/>
                        <button onClick={handleStartStream} className="px-8 py-3 bg-[#00FF41] text-black font-black uppercase rounded-lg hover:bg-[#FF00A6] hover:text-white transition shadow-[0_0_15px_rgba(0,255,65,0.4)] whitespace-nowrap"><MonitorPlay className="inline mr-2" size={20} /> START STREAMING</button>
                    </div>
                    {statusMsg && <p className={`mt-4 font-mono font-bold ${statusMsg.includes('SUCCESS') ? 'text-[#00FF41]' : 'text-red-500'}`}>{statusMsg}</p>}
                </div>
            )}

            {activeSubTab === 'earn' && (
                <div className="grid grid-cols-2 gap-6 max-w-3xl">
                    <div className="bg-black/60 border-2 border-[#FF00A6]/50 p-6 rounded-lg text-center shadow-[0_0_15px_rgba(255,0,166,0.2)]">
                        <h3 className="text-white/50 uppercase font-bold mb-2">Total Donations</h3>
                        <p className="text-4xl font-black text-[#FF00A6]">${earnings.donations?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-black/60 border-2 border-[#00FF41]/50 p-6 rounded-lg text-center shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                        <h3 className="text-white/50 uppercase font-bold mb-2">Ad Revenue (Est.)</h3>
                        <p className="text-4xl font-black text-[#00FF41]">${earnings.adRevenue?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
            )}

            {activeSubTab === 'monetize' && (
                <div className="bg-black/60 border-2 border-[#00FF41]/50 p-8 rounded-lg max-w-3xl">
                    <h3 className="text-xl font-bold text-white mb-4 uppercase">Monetization Status</h3>
                    <div className="flex items-center gap-4">
                        <CheckCircle size={32} className="text-[#00FF41]" />
                        <div>
                            <p className="text-[#00FF41] font-bold uppercase tracking-wider">Partner Program Active</p>
                            <p className="text-white/50 text-sm font-mono mt-1">You are earning extra income from normal users watching popup ads.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 7. PROFILE SETTINGS & CLIPS
// ==========================================
const UserProfilePage = ({ user, userProfileData }) => {
    const [activeSubTab, setActiveSubTab] = useState('customize');
    const [newUsername, setNewUsername] = useState(user?.displayName || '');
    const [feedback, setFeedback] = useState('');
    const [myClips, setMyClips] = useState([]);

    useEffect(() => {
        if(user) {
            onValue(ref(db, 'posts'), (snapshot) => {
                const data = snapshot.val();
                if(data) {
                    const allPosts = Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse();
                    setMyClips(allPosts.filter(p => p.userId === user.uid));
                } else setMyClips([]);
            });
        }
    }, [user]);

    const handleUpdateProfile = () => {
        if(user) updateProfile(user, { displayName: newUsername }).then(()=>alert("Username updated successfully!"));
    };

    const handleUpgrade = () => {
        if(user) {
            update(ref(db, `users/${user.uid}`), { subscriptionPlan: 'premium' }).then(()=>{
                alert("Upgraded to Premium successfully!");
                push(ref(db, `notifications/${user.uid}`), { text: `Upgraded to PREMIUM PLAN! Enjoy your ad-free experience.`, time: serverTimestamp(), read: false });
            });
        }
    };

    const handleFeedback = () => {
        if(feedback) push(ref(db, 'feedbacks'), { userId: user.uid, text: feedback, time: serverTimestamp() }).then(()=>{ alert("Feedback sent!"); setFeedback(''); });
    };

    const handleDeleteClip = (postId) => {
        if(window.confirm("Delete this clip permanently?")) remove(ref(db, `posts/${postId}`));
    };

    const isPremium = userProfileData?.subscriptionPlan === 'premium';

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3"><Settings className="text-[#FF00A6]" /> PROFILE SETTINGS</h2>
            
            <div className="flex gap-4 mb-8 border-b border-white/20 pb-4">
                <button onClick={()=>setActiveSubTab('customize')} className={`px-4 py-2 font-bold uppercase rounded transition ${activeSubTab==='customize' ? 'bg-[#FF00A6] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Customize Profile</button>
                <button onClick={()=>setActiveSubTab('change')} className={`px-4 py-2 font-bold uppercase rounded transition ${activeSubTab==='change' ? 'bg-[#FF00A6] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Change Details</button>
                <button onClick={()=>setActiveSubTab('clips')} className={`px-4 py-2 font-bold uppercase rounded transition ${activeSubTab==='clips' ? 'bg-[#FF00A6] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Your Clips</button>
            </div>

            {activeSubTab === 'customize' && (
                <div className="bg-black/60 border-2 border-[#00FF41]/50 p-6 rounded-lg max-w-xl shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4 uppercase">Current Plan</h3>
                    <div className={`p-5 border-2 rounded-lg mb-6 shadow-inner ${isPremium ? 'border-[#00FF41] bg-[#00FF41]/10 shadow-[#00FF41]/20' : 'border-white/20 bg-white/5'}`}>
                        <p className={`font-black uppercase tracking-widest ${isPremium ? 'text-[#00FF41]' : 'text-white'}`}>{isPremium ? '★ PREMIUM (AD-FREE)' : 'NORMAL PLAN (FREE WITH ADS)'}</p>
                    </div>
                    {!isPremium ? (
                        <button onClick={handleUpgrade} className="w-full py-4 bg-[#FF00A6] text-white font-bold rounded-lg uppercase tracking-widest hover:bg-[#FF00A6]/80 flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(255,0,166,0.4)] transition"><CreditCard size={20} /> UPGRADE TO PREMIUM</button>
                    ) : (
                        <button className="w-full py-4 bg-white/10 text-white/50 font-bold rounded-lg uppercase tracking-widest cursor-not-allowed flex justify-center items-center gap-2 border border-white/20"><Star size={20} /> ENHANCE SUBSCRIPTION</button>
                    )}
                </div>
            )}

            {activeSubTab === 'change' && (
                <div className="bg-black/60 border-2 border-[#FF00A6]/50 p-8 rounded-lg max-w-xl space-y-6 shadow-lg">
                    <div>
                        <label className="text-[#FF00A6] text-xs font-bold uppercase tracking-widest mb-2 block">Contact Email</label>
                        <p className="text-white font-mono bg-black/50 p-3 rounded border border-white/10">{user?.email}</p>
                    </div>
                    <div>
                        <label className="text-[#FF00A6] text-xs font-bold uppercase tracking-widest mb-2 block">Display Username</label>
                        <div className="flex gap-2">
                            <input type="text" value={newUsername} onChange={(e)=>setNewUsername(e.target.value)} className="flex-1 bg-black/50 border border-white/30 p-3 rounded text-white outline-none focus:border-[#00FF41] transition"/>
                            <button onClick={handleUpdateProfile} className="bg-[#00FF41] px-6 rounded text-black font-black uppercase hover:bg-[#FF00A6] hover:text-white transition shadow-lg flex items-center gap-2"><Edit3 size={18}/> SAVE</button>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'clips' && (
                <div className="max-w-3xl space-y-6">
                    {myClips.length === 0 ? (
                        <div className="bg-black/50 border border-white/20 p-8 rounded-lg text-center">
                            <p className="text-white/50 font-mono">You haven't posted any highlights yet.</p>
                        </div>
                    ) : (
                        myClips.map(clip => (
                            <div key={clip.id} className="bg-black/60 border border-white/20 rounded-lg p-5 hover:border-[#FF00A6]/50 transition shadow-lg">
                                {clip.content && <p className="text-white mb-4 whitespace-pre-wrap">{clip.content}</p>}
                                {clip.fileData && clip.fileType === 'image' && <img src={clip.fileData} className="w-full max-h-80 object-contain rounded bg-black mb-4 border border-white/10"/>}
                                {clip.fileData && clip.fileType === 'video' && <video src={clip.fileData} controls className="w-full max-h-80 rounded bg-black mb-4 border border-white/10"/>}
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="text-white/30 text-xs font-mono">{new Date(clip.timestamp).toLocaleDateString()}</span>
                                    <button onClick={() => handleDeleteClip(clip.id)} className="text-red-500 font-bold uppercase text-xs tracking-widest flex items-center gap-1 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded transition"><Trash2 size={14}/> Delete Post</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 8. HIGHLIGHTS PAGE
// ==========================================
const HighlightsPage = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [postFileData, setPostFileData] = useState(null);
    const [postFileType, setPostFileType] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [openCommentPostId, setOpenCommentPostId] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        onValue(ref(db, 'posts'), (snapshot) => {
            const data = snapshot.val();
            if (data) setPosts(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
            else setPosts([]);
        });
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return alert("File too large. Max 5MB.");
        const reader = new FileReader();
        reader.onloadend = () => {
            setPostFileData(reader.result);
            setPostFileType(file.type.startsWith('video/') ? 'video' : 'image');
        };
        reader.readAsDataURL(file);
    };

    const handlePost = () => {
        if (!user || (!newPostText && !postFileData)) return;
        setIsUploading(true);
        push(ref(db, 'posts'), {
            userId: user.uid, userName: user.displayName || 'Anonymous', content: newPostText, fileData: postFileData || null, fileType: postFileType || null, timestamp: serverTimestamp(), likes: { initial: true }
        }).then(() => {
            setNewPostText(''); setPostFileData(null); setPostFileType(''); setIsUploading(false);
        });
    };

    const handleLike = (postId) => {
        if (!user) return;
        const postLikeRef = ref(db, `posts/${postId}/likes/${user.uid}`);
        get(postLikeRef).then(snap => { if (snap.exists()) remove(postLikeRef); else set(postLikeRef, true); });
    };

    const handleDelete = (postId) => { if(window.confirm("Delete this post?")) remove(ref(db, `posts/${postId}`)); };
    
    const handleCommentChange = (postId, text) => setCommentInputs(prev => ({ ...prev, [postId]: text }));
    
    const submitComment = (postId) => {
        const text = commentInputs[postId];
        if (!user || !text || text.trim() === '') return;
        push(ref(db, `posts/${postId}/comments`), { userId: user.uid, userName: user.displayName || 'Anonymous', text: text, timestamp: serverTimestamp() }).then(() => {
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        });
    };

    return (
        <div className="p-8 h-full overflow-y-auto max-w-3xl mx-auto custom-scrollbar">
            <h2 className="text-3xl font-black text-white uppercase mb-6 flex items-center gap-3"><Zap className="text-[#FF00A6]" /> COMMUNITY HIGHLIGHTS</h2>
            {user ? (
                <div className="bg-black/60 border-2 border-[#00FF41]/30 p-5 rounded-lg mb-8 shadow-lg">
                    <textarea value={newPostText} onChange={(e)=>setNewPostText(e.target.value)} placeholder="What's your gaming highlight?" className="w-full bg-black/50 border border-white/20 rounded p-3 text-white outline-none focus:border-[#00FF41] resize-none mb-3" rows="3"></textarea>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-white/10 hover:bg-[#00FF41]/20 text-white hover:text-[#00FF41] px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2 transition border border-white/20">
                                <Image size={16} /> Add Media <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
                            </label>
                            {postFileData && <span className="text-[#00FF41] text-xs font-mono flex items-center">Media Attached ✓</span>}
                        </div>
                        <button onClick={handlePost} disabled={isUploading} className={`px-8 py-2 font-bold uppercase rounded transition shadow-lg tracking-widest ${isUploading ? 'bg-gray-500 text-white' : 'bg-[#00FF41] text-black hover:bg-[#FF00A6] hover:text-white shadow-[#00FF41]/30'}`}>{isUploading ? 'POSTING...' : 'POST'}</button>
                    </div>
                </div>
            ) : <div className="bg-[#FF00A6]/10 border border-[#FF00A6]/50 p-4 rounded-lg mb-8 text-center text-[#FF00A6] font-bold uppercase text-sm">Please login to post.</div>}

            <div className="space-y-8">
                {posts.map(post => {
                    const likeCount = post.likes ? Object.keys(post.likes).length - 1 : 0;
                    const commentCount = post.comments ? Object.keys(post.comments).length : 0;
                    const isOwner = user?.uid === post.userId;
                    const isCommentsOpen = openCommentPostId === post.id;

                    return (
                        <div key={post.id} className="bg-black/80 border-2 border-white/10 rounded-lg p-5 shadow-lg hover:border-[#FF00A6]/30 transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#00FF41]/20 border border-[#00FF41] flex items-center justify-center font-bold text-[#00FF41]">{post.userName.charAt(0).toUpperCase()}</div>
                                    <div><span className="font-bold text-[#00FF41] uppercase block">{post.userName}</span></div>
                                </div>
                                {isOwner && <button onClick={() => handleDelete(post.id)} className="text-white/30 hover:text-red-500 transition"><Trash2 size={16}/></button>}
                            </div>
                            {post.content && <p className="text-white/90 mb-4 whitespace-pre-wrap">{post.content}</p>}
                            {post.fileData && post.fileType === 'image' && <img src={post.fileData} className="w-full max-h-96 object-contain bg-black rounded-md mb-4 border border-white/10" />}
                            {post.fileData && post.fileType === 'video' && <video src={post.fileData} controls className="w-full max-h-96 rounded-md mb-4 border border-white/10 bg-black" />}
                            
                            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 font-bold transition ${post.likes && post.likes[user?.uid] ? 'text-[#FF00A6]' : 'text-white/50 hover:text-[#FF00A6]'}`}>
                                    <Heart size={18} className={post.likes && post.likes[user?.uid] ? 'fill-[#FF00A6]' : ''} /> {isOwner ? `${likeCount} Likes` : (post.likes && post.likes[user?.uid] ? 'Liked' : 'Like')}
                                </button>
                                <button onClick={() => setOpenCommentPostId(isCommentsOpen ? null : post.id)} className={`flex items-center gap-2 font-bold transition ${isCommentsOpen ? 'text-[#00FF41]' : 'text-white/50 hover:text-[#00FF41]'}`}>
                                    <MessageSquare size={18} /> {commentCount} Comments
                                </button>
                            </div>

                            {isCommentsOpen && (
                                <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fade-in">
                                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                        {post.comments && Object.values(post.comments).map((cmt, idx) => (
                                            <div key={idx} className="bg-white/5 p-3 rounded-lg text-sm border border-white/10">
                                                <span className="font-bold text-[#00FF41] uppercase mr-2">{cmt.userName}:</span><span className="text-white/80">{cmt.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {user && (
                                        <div className="flex gap-2 pt-2">
                                            <input type="text" value={commentInputs[post.id] || ''} onChange={(e) => handleCommentChange(post.id, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && submitComment(post.id)} placeholder="Write a comment..." className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#00FF41]" />
                                            <button onClick={() => submitComment(post.id)} className="bg-[#00FF41] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#FF00A6] hover:text-white transition"><Send size={16}/></button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

// ==========================================
// 9. SUBSCRIPTIONS PAGE
// ==========================================
const SubscriptionsPage = ({ user, goToChannel }) => {
    const [subs, setSubs] = useState([]);
    useEffect(() => {
        if(user) {
            onValue(ref(db, `subscriptions/${user.uid}`), (snapshot) => {
                const data = snapshot.val();
                if(data) setSubs(Object.keys(data).map(k => ({ id: k, ...data[k] })));
                else setSubs([]);
            });
        }
    }, [user]);

    return (
        <div className="p-8 h-full overflow-y-auto max-w-3xl">
            <h2 className="text-3xl font-black text-white uppercase mb-6 flex items-center gap-3"><Users className="text-[#00FF41]" /> YOUR SUBSCRIPTIONS</h2>
            {subs.length === 0 ? <p className="text-white/50 font-mono">You haven't subscribed to any creators yet.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subs.map(sub => (
                        <div key={sub.id} onClick={() => goToChannel(sub.id, sub.streamerName)} className="bg-black/60 border-2 border-[#00FF41]/30 p-4 rounded-lg flex items-center gap-4 hover:border-[#00FF41] transition cursor-pointer group shadow-lg">
                            <div className="w-12 h-12 rounded-full bg-[#00FF41]/20 flex items-center justify-center group-hover:bg-[#00FF41] transition">
                                <User size={24} className="text-[#00FF41] group-hover:text-black"/>
                            </div>
                            <div>
                                <h3 className="text-white font-bold uppercase group-hover:text-[#00FF41] transition">{sub.streamerName}</h3>
                                <p className="text-white/40 text-[10px] font-mono group-hover:text-white/70">Click to view channel</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 10. CHANNEL PAGE (Full Banner & About)
// ==========================================
const ChannelPage = ({ channelId, channelName, goBack, user }) => {
    const [activeChannelTab, setActiveChannelTab] = useState('vods');
    const [channelVods, setChannelVods] = useState([]); 
    const [playingVodId, setPlayingVodId] = useState(null); 
    const [channelPosts, setChannelPosts] = useState([]); 
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [streamerProfile, setStreamerProfile] = useState(null);

    useEffect(() => {
        if (!channelId) return;
        onValue(ref(db, 'streams'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allStreams = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
                setChannelVods(allStreams.filter(stream => stream.streamerId === channelId));
            } else setChannelVods([]);
        });
    }, [channelId]);

    useEffect(() => {
        if (!channelId) return;
        onValue(ref(db, 'posts'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allPosts = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
                setChannelPosts(allPosts.filter(post => post.userId === channelId));
            } else setChannelPosts([]);
        });
    }, [channelId]);

    useEffect(() => {
        if (user && channelId) {
            onValue(ref(db, `subscriptions/${user.uid}/${channelId}`), (snapshot) => setIsSubscribed(snapshot.exists()));
        }
    }, [user, channelId]);

    useEffect(() => {
        if (channelId) {
            get(ref(db, `users/${channelId}`)).then(snapshot => {
                if (snapshot.exists()) setStreamerProfile(snapshot.val());
            });
        }
    }, [channelId]);

    const handleChannelSubscribe = () => {
        if (!user) return alert("Please login to subscribe!");
        if (isSubscribed) {
            remove(ref(db, `subscriptions/${user.uid}/${channelId}`));
            push(ref(db, `notifications/${user.uid}`), { text: `Unsubscribed from ${channelName}.`, time: serverTimestamp(), read: false });
        } else {
            set(ref(db, `subscriptions/${user.uid}/${channelId}`), { streamerName: channelName, timestamp: serverTimestamp() });
            push(ref(db, `notifications/${user.uid}`), { text: `Successfully subscribed to ${channelName}!`, time: serverTimestamp(), read: false });
        }
    };

    if (playingVodId) {
        return (
            <div className="p-8 h-full flex flex-col bg-black">
                <button onClick={() => setPlayingVodId(null)} className="mb-4 text-[#FF00A6] font-bold uppercase flex items-center gap-2 hover:text-white transition w-fit">
                    <ArrowLeft size={18}/> BACK TO CHANNEL
                </button>
                <div className="flex-1 bg-black border-4 border-[#FF00A6]/70 rounded-lg overflow-hidden relative shadow-[0_0_20px_rgba(255,0,166,0.6)]">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${playingVodId}?autoplay=1&mute=0`} allowFullScreen frameBorder="0"></iframe>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-black custom-scrollbar pb-10">
            <div className="h-48 md:h-64 w-full bg-linear-to-r from-[#FF00A6]/40 via-purple-900/40 to-[#00FF41]/40 relative border-b-4 border-black">
                <button onClick={goBack} className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white font-bold uppercase flex items-center gap-2 hover:bg-[#FF00A6] transition z-10 border border-white/20">
                    <ArrowLeft size={18}/> BACK
                </button>
            </div>

            <div className="px-8 -mt-12 relative z-10">
                <div className="bg-black border-2 border-white/10 rounded-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="w-32 h-32 rounded-full bg-black border-4 border-[#00FF41] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.4)]">
                            <User size={64} className="text-[#00FF41]" />
                        </div>
                        <div className="text-center md:text-left mb-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{channelName || 'STREAMER CHANNEL'}</h1>
                            <p className="text-white/50 font-mono mt-1 font-bold">{channelVods.length} Videos • {channelPosts.length} Highlights</p>
                        </div>
                    </div>
                    {user?.uid !== channelId && (
                        <button onClick={handleChannelSubscribe} className={`w-full md:w-auto px-8 py-3 font-black uppercase tracking-widest rounded-lg transition shadow-lg ${isSubscribed ? 'bg-white/10 border border-white/30 text-white hover:bg-white/20' : 'bg-[#FF00A6] text-white hover:bg-[#FF00A6]/80 shadow-[0_0_15px_rgba(255,0,166,0.4)]'}`}>
                            {isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
                        </button>
                    )}
                </div>

                <div className="flex gap-8 border-b border-white/20 pb-4 mb-6 px-2 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setActiveChannelTab('vods')} className={`text-lg font-black uppercase whitespace-nowrap transition ${activeChannelTab === 'vods' ? 'text-[#00FF41] border-b-2 border-[#00FF41] pb-2 -mb-4' : 'text-white/50 hover:text-white'}`}>VIDEOS</button>
                    <button onClick={() => setActiveChannelTab('highlights')} className={`text-lg font-black uppercase whitespace-nowrap transition ${activeChannelTab === 'highlights' ? 'text-[#FF00A6] border-b-2 border-[#FF00A6] pb-2 -mb-4' : 'text-white/50 hover:text-white'}`}>HIGHLIGHTS</button>
                    <button onClick={() => setActiveChannelTab('about')} className={`text-lg font-black uppercase whitespace-nowrap transition ${activeChannelTab === 'about' ? 'text-white border-b-2 border-white pb-2 -mb-4' : 'text-white/50 hover:text-white'}`}>ABOUT</button>
                </div>

                {activeChannelTab === 'vods' && (
                    <div className="animate-fade-in">
                        {channelVods.length === 0 ? <div className="text-white/50 font-mono text-center p-10 bg-white/5 rounded-lg border border-white/10">This channel hasn't uploaded any videos yet.</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {channelVods.map(vod => (
                                    <div key={vod.id} className="bg-black border-2 border-white/10 rounded-lg overflow-hidden hover:border-[#00FF41] transition group shadow-lg">
                                        <div className="h-40 relative">
                                            <iframe className="w-full h-full pointer-events-none" src={`https://www.youtube.com/embed/${vod.videoId}?mute=1`} frameBorder="0"></iframe>
                                            <div className="absolute inset-0 bg-transparent z-10"></div>
                                        </div>
                                        <div className="p-4 bg-black/80 flex flex-col">
                                            <h3 className="text-white font-bold uppercase truncate">{vod.streamerName}'s Broadcast</h3>
                                            <span className="text-white/40 text-[10px] font-mono mb-3">{new Date(vod.timestamp).toLocaleDateString()}</span>
                                            <button onClick={() => setPlayingVodId(vod.videoId)} className="px-4 py-2 bg-[#00FF41]/10 text-[#00FF41] text-sm font-bold uppercase tracking-widest rounded border border-[#00FF41]/30 hover:bg-[#00FF41] hover:text-black transition text-center">Watch VOD</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeChannelTab === 'highlights' && (
                    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
                        {channelPosts.length === 0 ? <div className="text-white/50 font-mono text-center p-10 bg-white/5 rounded-lg border border-white/10">No highlights posted yet.</div> : (
                            channelPosts.map(post => {
                                const likeCount = post.likes ? Object.keys(post.likes).length - 1 : 0;
                                const commentCount = post.comments ? Object.keys(post.comments).length : 0;
                                return (
                                    <div key={post.id} className="bg-black/80 border-2 border-white/10 rounded-lg p-5 shadow-lg hover:border-[#FF00A6]/30 transition">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-[#00FF41]/20 border border-[#00FF41] flex items-center justify-center font-bold text-[#00FF41]">{post.userName.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <span className="font-bold text-[#00FF41] uppercase block">{post.userName}</span>
                                                <span className="text-white/40 text-[10px] font-mono">{new Date(post.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {post.content && <p className="text-white/90 mb-4 whitespace-pre-wrap">{post.content}</p>}
                                        {post.fileData && post.fileType === 'image' && <img src={post.fileData} className="w-full max-h-96 object-contain bg-black rounded-md mb-4 border border-white/10" />}
                                        {post.fileData && post.fileType === 'video' && <video src={post.fileData} controls className="w-full max-h-96 rounded-md mb-4 border border-white/10 bg-black" />}
                                        <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2 font-bold text-white/50"><Heart size={18} className="text-[#FF00A6]" /> {likeCount} Likes</div>
                                            <div className="flex items-center gap-2 font-bold text-white/50"><MessageSquare size={18} className="text-[#00FF41]" /> {commentCount} Comments</div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}

                {activeChannelTab === 'about' && (
                    <div className="animate-fade-in max-w-3xl mx-auto">
                        <div className="bg-black/60 border-2 border-white/10 rounded-lg p-8 shadow-lg">
                            <h2 className="text-2xl font-black text-white uppercase mb-6 border-b border-white/20 pb-4">About {channelName}</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-white/50 font-bold uppercase text-xs tracking-widest mb-1">Description</h3>
                                    <p className="text-white font-mono bg-white/5 p-4 rounded border border-white/10">Welcome to the official EsportRestream channel for {channelName}. Follow for the best gameplay, live tournaments, and community highlights!</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-white/50 font-bold uppercase text-xs tracking-widest mb-1">Joined Date</h3>
                                        <p className="text-[#00FF41] font-bold text-lg">{streamerProfile?.joinedDate ? new Date(streamerProfile.joinedDate).toLocaleDateString() : 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-white/50 font-bold uppercase text-xs tracking-widest mb-1">Creator Tier</h3>
                                        <p className="text-[#FF00A6] font-bold text-lg uppercase">{streamerProfile?.subscriptionPlan === 'premium' ? '★ Premium Streamer' : 'Standard Streamer'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 11. ABOUT & PACKAGES
// ==========================================
const AboutUsPage = () => {
    const [tab, setTab] = useState('about');
    return (
        <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8 border-b border-white/20 pb-4">
                <button onClick={()=>setTab('about')} className={`text-2xl font-black uppercase transition ${tab==='about'?'text-[#FF00A6]':'text-white/50 hover:text-white'}`}>ABOUT WEBSITE</button>
                <label className="text-white/50">|</label>    
                <button onClick={()=>setTab('packages')} className={`text-2xl font-black uppercase transition ${tab==='packages'?'text-[#00FF41]':'text-white/50 hover:text-white'}`}>PACKAGES</button>
            </div>
            {tab === 'about' && (
                <div className="bg-black/60 border border-white/10 p-6 rounded-lg text-white/80 font-mono space-y-4 leading-relaxed">
                    <p>Welcome to <span className="text-[#FF00A6] font-bold">ESPORTRESTREAM</span>, the ultimate third-party streaming aggregator built for gamers and esports enthusiasts. The EsportRestream platform is developed as a centralized hub to address the fragmentation of esports content across various titles like MLBB and PUBG. The system features a tournament timetable synchronized with real-world events, providing automated alarm notifications to prevent missed broadcasts. Key functionalities include a live chat module for audience interaction and a fan-support system for player engagement. A SQL database is integrated to maintain data integrity for schedules and user logs. Evaluation confirms the system's reliability in notification delivery and user interaction, offering a streamlined environment for esports audiences.</p>
                </div>
            )}
            {tab === 'packages' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/60 border-2 border-white/20 p-8 rounded-lg">
                        <h3 className="text-2xl font-black text-white uppercase mb-2">NORMAL PLAN</h3>
                        <p className="text-[#00FF41] font-bold mb-6">FREE WITH ADS</p>
                        <ul className="space-y-3 text-white/70 font-mono text-sm">
                            <li>- Watch all streams and VODs</li>
                            <li>- Pop-up ads during viewing</li>
                        </ul>
                    </div>
                    <div className="bg-black/80 border-2 border-[#FF00A6] p-8 rounded-lg shadow-[0_0_15px_rgba(255,0,166,0.3)]">
                        <h3 className="text-2xl font-black text-white uppercase mb-2">PREMIUM PLAN</h3>
                        <p className="text-[#FF00A6] font-bold mb-6">$9.99 / MONTH</p>
                        <ul className="space-y-3 text-white/70 font-mono text-sm">
                            <li>- 100% Ad-Free Experience</li>
                            <li>- High Quality & Premium Emotes</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
};


// ==========================================
// 12. MAIN APP COMPONENT (With Alarm, Tournaments & Nav)
// ==========================================
export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [userProfileData, setUserProfileData] = useState(null);
    const [selectedLive, setSelectedLive] = useState(null);
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const [selectedChannelName, setSelectedChannelName] = useState('');
    
    // Notifications State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const goToChannel = (streamerId, streamerName) => {
        setSelectedChannelId(streamerId);
        setSelectedChannelName(streamerName);
        setActiveTab('channel');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userRef = ref(db, `users/${currentUser.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setUserProfileData(snapshot.val());
                } else {
                    const newData = { name: currentUser.displayName, email: currentUser.email, role: 'audience', joinedDate: Date.now(), subscriptionPlan: 'free' };
                    await set(userRef, newData);
                    setUserProfileData(newData);
                    push(ref(db, `notifications/${currentUser.uid}`), { text: 'Welcome to ESPORTRESTREAM! Check out the TOURNAMENTS to set alarms.', time: serverTimestamp(), read: false });
                }
            } else setUserProfileData(null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            onValue(ref(db, `notifications/${user.uid}`), (snapshot) => {
                if (snapshot.exists()) setNotifications(Object.keys(snapshot.val()).map(k => ({ id: k, ...snapshot.val()[k] })).reverse());
                else setNotifications([]);
            });
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;
    const markAsRead = (notifId) => update(ref(db, `notifications/${user.uid}/${notifId}`), { read: true });
    const markAllAsRead = () => notifications.forEach(n => { if(!n.read) update(ref(db, `notifications/${user.uid}/${n.id}`), { read: true }); });

    const userRole = userProfileData?.role || 'audience';

    const navCategories = [
        {
            title: 'GENERAL',
            items: [
                { id: 'home', label: 'HOME (VODS)', icon: Home, show: true },
                { id: 'tournaments', label: 'TOURNAMENTS', icon: CalendarDays, show: true },
                { id: 'lives', label: 'LIVES', icon: MonitorPlay, show: true },
                { id: 'live', label: 'NOW STREAMING', icon: PlayCircle, show: true },
                { id: 'highlights', label: 'HIGHLIGHTS', icon: Zap, show: true },
            ]
        },
        {
            title: 'CREATOR',
            items: [
                { id: 'streamer_dash', label: 'CREATOR STUDIO', icon: Video, show: userRole === 'streamer' || userRole === 'admin' },
            ]
        },
        {
            title: 'SUBSCRIPTIONS',
            items: [
                { id: 'subs', label: 'FOLLOWING', icon: Users, show: user !== null },
            ]
        },
        {
            title: 'YOU',
            items: [
                { id: 'profile', label: 'PROFILE SETTINGS', icon: Settings, show: user !== null },
                { id: 'admin_panel', label: 'ADMIN PANEL', icon: Shield, show: userRole === 'admin' },
            ]
        },
        {
            title: 'ABOUT US',
            items: [
                { id: 'about', label: 'ABOUT & PACKAGES', icon: Info, show: true },
            ]
        }
    ];

    return (
        <div className="h-dvh w-screen overflow-hidden font-sans text-slate-200 bg-black flex flex-col selection:bg-[#FF00A6] selection:text-white">
            <header className="h-16 flex items-center justify-between px-4 bg-[#111111] border-b-2 border-[#00FF41]/50 shadow-md z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white/70 hover:text-[#00FF41] transition bg-white/5 rounded-md"><Menu size={24} /></button>
                    <div className="text-xl font-black uppercase tracking-tighter text-[#00FF41] flex items-center gap-2">
                        <img src="src/assets/logo14.png" alt="Logo" className="w-10 h-10 object-contain" onError={(e)=>{e.target.style.display='none'}}/>
                        ESPORTSRESTREAM
                    </div>
                </div>
                
                <div className="flex items-center gap-4 relative">
                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-white/70 hover:text-[#FF00A6] transition relative bg-white/5 rounded-full">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-black/95 backdrop-blur-xl border-2 border-[#00FF41]/50 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.4)] z-50 overflow-hidden flex flex-col animate-fade-in">
                                <div className="p-4 border-b border-[#00FF41]/30 flex justify-between items-center bg-black">
                                    <h3 className="text-[#00FF41] font-black uppercase tracking-widest text-sm flex items-center gap-2"><Bell size={16}/> ALARMS</h3>
                                    {unreadCount > 0 && <button onClick={markAllAsRead} className="text-[10px] text-white/50 hover:text-[#FF00A6] transition uppercase font-bold bg-white/5 px-2 py-1 rounded">Mark all read</button>}
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                    {notifications.length === 0 ? <p className="text-center text-white/40 text-xs py-6 font-mono">No new alarms.</p> : (
                                        notifications.map(n => (
                                            <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3 rounded-md cursor-pointer border-l-2 transition ${n.read ? 'bg-white/5 border-transparent opacity-60' : 'bg-[#00FF41]/10 border-[#00FF41] hover:bg-[#00FF41]/20 shadow-[0_0_10px_rgba(0,255,65,0.1)]'}`}>
                                                <p className={`text-sm ${n.read ? 'text-white/70' : 'text-white font-bold'}`}>{n.text}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative z-10">
                <aside className={`bg-[#111111] border-r border-white/10 transition-all duration-300 flex flex-col shrink-0 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
                    <div className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                        {navCategories.map((category, idx) => {
                            const visibleItems = category.items.filter(item => item.show);
                            if (visibleItems.length === 0) return null;
                            return (
                                <div key={idx} className="mb-4">
                                    {isSidebarOpen && <h4 className="px-5 mb-2 text-[10px] font-black uppercase text-white/40 tracking-widest">{category.title}</h4>}
                                    <div className="px-2 space-y-1">
                                        {visibleItems.map(item => (
                                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg font-bold transition whitespace-nowrap overflow-hidden ${activeTab === item.id ? 'bg-[#FF00A6]/20 text-[#FF00A6]' : 'text-white/60 hover:bg-white/5'}`}>
                                                <item.icon size={20} className="shrink-0" /><span className={`text-sm uppercase tracking-wider transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-2 border-t border-white/10">
                        {user ? (
                            <button onClick={() => {signOut(auth); setActiveTab('home');}} className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-white/50 hover:text-red-500 transition"><LogOut size={20} className="shrink-0" /><span className={`text-sm font-bold uppercase ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>LOGOUT</span></button>
                        ) : (
                            <button onClick={async () => await signInWithPopup(auth, provider)} className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-black bg-[#00FF41] hover:bg-[#00FF41]/80 transition"><LogIn size={20} className="shrink-0" /><span className={`text-sm font-black uppercase ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>LOGIN</span></button>
                        )}
                    </div>
                </aside>

                <main className="flex-1 h-full overflow-hidden relative bg-black">
                    <div className="absolute inset-0 z-10 h-full w-full">
                        {activeTab === 'home' && <HomePage />}
                        {activeTab === 'tournaments' && <TournamentsPage />}
                        {activeTab === 'lives' && <LivesPage setSelectedLive={setSelectedLive} setActiveTab={setActiveTab} />}
                        {activeTab === 'live' && <LiveStreamingPage selectedLive={selectedLive} setSelectedLive={setSelectedLive} user={user} />}
                        {activeTab === 'highlights' && <HighlightsPage user={user} />}
                        {activeTab === 'profile' && <UserProfilePage user={user} userProfileData={userProfileData} />}
                        {activeTab === 'streamer_dash' && <StreamerDashboard user={user} />}
                        {activeTab === 'about' && <AboutUsPage />}
                        {activeTab === 'admin_panel' && <AdminPanel />}
                        {activeTab === 'subs' && <SubscriptionsPage user={user} goToChannel={goToChannel} />}
                        {activeTab === 'channel' && <ChannelPage user={user} channelId={selectedChannelId} channelName={selectedChannelName} goBack={() => setActiveTab('subs')} />}
                    </div>
                </main>
            </div>
        </div>
    );
}