import React, { useState, useEffect } from 'react';
import { db, auth, provider } from '../firebase';
import { ref, push, onValue, serverTimestamp, get, set, update, remove } from 'firebase/database';
import { signInWithPopup, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import {
    PlayCircle, Mic2, Repeat, Trophy, Settings, Search, MessageSquare, Heart, Send, Gamepad2, Bell, User, PanelRightClose, PanelRightOpen, Maximize2, Volume2, ArrowLeft, ArrowRight, Twitter, Twitch, ArrowRight as ArrowIcon, Calendar, MapPin, Zap, Star, DollarSign, Lock, CheckCircle, Image, Menu, Home, CalendarDays, Hash, LogOut, History, CreditCard, Video, Shield, LogIn, MonitorPlay, Users, Info, Box, TrendingUp, Edit3, Trash2, StopCircle
} from 'lucide-react';

const NEON_GREEN = 'text-[#00FF41]';
const NEON_PINK = 'text-[#FF00A6]';


// ==========================================
// 7. CHANNEL PAGE (Part 3: Dynamic VODs Integration)
// ==========================================
const ChannelPage = ({ channelId, channelName, goBack }) => {
    const [activeChannelTab, setActiveChannelTab] = useState('vods');
    const [channelVods, setChannelVods] = useState([]); // Streamer ၏ VOD များကို သိမ်းရန်
    const [playingVodId, setPlayingVodId] = useState(null); // Video ဖွင့်ကြည့်ရန် State
    const [channelPosts, setChannelPosts] = useState([]); // Streamer ၏ ပို့စ်များကို သိမ်းရန်
    const [isSubscribed, setIsSubscribed] = useState(false);

    // လက်ရှိ User က ဒီ Channel ကို Subscribe လုပ်ထားခြင်း ရှိ/မရှိ စစ်ဆေးခြင်း
    useEffect(() => {
        if (user && channelId) {
            const subRef = ref(db, `subscriptions/${user.uid}/${channelId}`);
            onValue(subRef, (snapshot) => {
                setIsSubscribed(snapshot.exists());
            });
        }
    }, [user, channelId]);

    // Subscribe / Unsubscribe လုပ်မည့် Function
    const handleChannelSubscribe = () => {
        if (!user) return alert("Please login to subscribe!");
        if (isSubscribed) {
            // Unsubscribe လုပ်ခြင်း
            remove(ref(db, `subscriptions/${user.uid}/${channelId}`));
        } else {
            // Subscribe လုပ်ခြင်း
            set(ref(db, `subscriptions/${user.uid}/${channelId}`), {
                streamerName: channelName,
                timestamp: serverTimestamp()
            });
        }
    };

    // Firebase မှ ဒီ Streamer တင်ထားသော ပို့စ်များကိုသာ Filter စစ်ပြီး ဆွဲထုတ်ခြင်း
    useEffect(() => {
        if (!channelId) return;
        const postsRef = ref(db, 'posts');
        onValue(postsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allPosts = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
                // ဒီ Streamer ရဲ့ ID နဲ့ တူတဲ့ ပို့စ်တွေကိုပဲ ရွေးထုတ်မယ်
                const filteredPosts = allPosts.filter(post => post.userId === channelId);
                setChannelPosts(filteredPosts);
            } else {
                setChannelPosts([]);
            }
        });
    }, [channelId]);

    // Firebase မှ ဒီ Channel (Streamer) ရဲ့ VOD များကိုသာ Filter စစ်ပြီး ဆွဲထုတ်ခြင်း
    useEffect(() => {
        if (!channelId) return;
        const streamsRef = ref(db, 'streams');
        onValue(streamsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allStreams = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
                // ဒီ Streamer ရဲ့ ID နဲ့ တူတဲ့ Video တွေကိုပဲ ရွေးထုတ်မယ်
                const filteredVods = allStreams.filter(stream => stream.streamerId === channelId);
                setChannelVods(filteredVods);
            } else {
                setChannelVods([]);
            }
        });
    }, [channelId]);

    // Video ကို နှိပ်လိုက်လျှင် ပေါ်လာမည့် Full Screen VOD Player
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
        <div className="p-8 h-full overflow-y-auto bg-black custom-scrollbar">
            {/* Back Button */}
            <button onClick={goBack} className="mb-6 text-[#FF00A6] font-bold uppercase flex items-center gap-2 hover:text-white transition w-fit">
                <ArrowLeft size={18}/> BACK TO PREVIOUS
            </button>

           {/* Channel Header (Updated for Part 5) */}
            <div className="bg-black/60 border-2 border-[#00FF41]/50 rounded-xl p-8 mb-8 flex justify-between items-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#00FF41]/20 border-4 border-[#00FF41] flex items-center justify-center shadow-lg">
                        <User size={48} className="text-[#00FF41]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                            {channelName || 'STREAMER CHANNEL'}
                        </h1>
                        <p className="text-[#00FF41] font-mono mt-2 font-bold">{channelVods.length} Uploaded Videos</p>
                    </div>
                </div>
                
                {/* Dynamic Subscribe Button */}
                {user?.uid !== channelId && (
                    <button 
                        onClick={handleChannelSubscribe} 
                        className={`px-8 py-3 font-black uppercase tracking-widest rounded-lg transition shadow-lg ${isSubscribed ? 'bg-white/10 border border-white/30 text-white hover:bg-white/20' : 'bg-[#FF00A6] text-white hover:bg-[#FF00A6]/80 shadow-[0_0_15px_rgba(255,0,166,0.4)]'}`}
                    >
                        {isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
                    </button>
                )}
            </div>

            {/* Channel Content Tabs */}
            <div className="flex gap-8 border-b border-white/20 pb-4 mb-6">
                <button onClick={() => setActiveChannelTab('vods')} className={`text-xl font-black uppercase transition ${activeChannelTab === 'vods' ? 'text-[#00FF41]' : 'text-white/50 hover:text-white'}`}>
                    VIDEOS (VODS)
                </button>
                <button onClick={() => setActiveChannelTab('highlights')} className={`text-xl font-black uppercase transition ${activeChannelTab === 'highlights' ? 'text-[#FF00A6]' : 'text-white/50 hover:text-white'}`}>
                    COMMUNITY HIGHLIGHTS
                </button>
            </div>

            {/* =======================
                VIDEOS (VODS) TAB
            ======================= */}
            {activeChannelTab === 'vods' && (
                <div className="animate-fade-in">
                    {channelVods.length === 0 ? (
                        <div className="text-white/50 font-mono text-center p-10 bg-white/5 rounded-lg border border-white/10">
                            This channel hasn't uploaded any VODs yet.
                        </div>
                    ) : (
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
                                        <button onClick={() => setPlayingVodId(vod.videoId)} className="px-4 py-2 bg-[#00FF41]/20 text-[#00FF41] text-sm font-bold uppercase tracking-widest rounded border border-[#00FF41]/50 hover:bg-[#00FF41] hover:text-black transition text-center">
                                            Watch VOD
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* =======================
                HIGHLIGHTS TAB
            ======================= */}
            {activeChannelTab === 'highlights' && (
                <div className="animate-fade-in space-y-6 max-w-3xl">
                    {channelPosts.length === 0 ? (
                        <div className="text-white/50 font-mono text-center p-10 bg-white/5 rounded-lg border border-white/10">
                            This channel hasn't posted any highlights yet.
                        </div>
                    ) : (
                        channelPosts.map(post => {
                            // Like နဲ့ Comment အရေအတွက်ကို တွက်ချက်ခြင်း
                            const likeCount = post.likes ? Object.keys(post.likes).length - 1 : 0;
                            const commentCount = post.comments ? Object.keys(post.comments).length : 0;

                            return (
                                <div key={post.id} className="bg-black/80 border-2 border-white/10 rounded-lg p-5 shadow-lg hover:border-[#FF00A6]/30 transition">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[#00FF41]/20 border border-[#00FF41] flex items-center justify-center font-bold text-[#00FF41]">
                                            {post.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-bold text-[#00FF41] uppercase block">{post.userName}</span>
                                            <span className="text-white/40 text-[10px] font-mono">{new Date(post.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    {post.content && <p className="text-white/90 mb-4 whitespace-pre-wrap">{post.content}</p>}
                                    
                                    {post.fileData && post.fileType === 'image' && (
                                        <img src={post.fileData} alt="Post Media" className="w-full max-h-96 object-contain bg-black rounded-md mb-4 border border-white/10" />
                                    )}
                                    {post.fileData && post.fileType === 'video' && (
                                        <video src={post.fileData} controls className="w-full max-h-96 rounded-md mb-4 border border-white/10 bg-black" />
                                    )}
                                    
                                    <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 font-bold text-white/50">
                                            <Heart size={18} className="text-[#FF00A6]" /> {likeCount} Likes
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-white/50">
                                            <MessageSquare size={18} className="text-[#00FF41]" /> {commentCount} Comments
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    );
};
// ==========================================
// 2. LIVES PAGE (All Active Streams)
// ==========================================
const LivesPage = ({ setSelectedLive, setActiveTab }) => {
    const [activeStreams, setActiveStreams] = useState([]);

    useEffect(() => {
        onValue(ref(db, 'activeStreams'), (snapshot) => {
            if (snapshot.exists()) {
                setActiveStreams(Object.values(snapshot.val()));
            } else {
                setActiveStreams([]);
            }
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
// 3. HOME PAGE (VODs Player Implementation)
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

    // Full Screen VOD Player
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
// 4. CREATOR STUDIO
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
                videoId: videoId,
                streamerId: user.uid,
                streamerName: user.displayName || 'Creator',
                timestamp: serverTimestamp()
            };
            // 1. Add to Active Lives
            set(ref(db, `activeStreams/${user.uid}`), streamData);
            // 2. Add to VODs History
            push(ref(db, 'streams'), streamData)
                .then(() => {
                    setStatusMsg('SUCCESS: STREAM IS NOW LIVE!');
                    setStreamLink('');
                    setTimeout(() => setStatusMsg(''), 5000);
                });
        } else {
            setStatusMsg('ERROR: INVALID YOUTUBE LINK.');
        }
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
                    <div className="col-span-2 bg-white/5 p-4 rounded text-center text-white/40 text-xs font-mono border border-white/10">
                        *Note: Earnings are dynamically tracked but withdrawal is disabled in this platform.
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
                            <p className="text-white/50 text-sm font-mono mt-1">You are earning extra income from normal users watching popup ads during your streams.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 5. PROFILE SETTINGS & CLIPS
// ==========================================
const UserProfilePage = ({ user, userProfileData }) => {
    const [activeSubTab, setActiveSubTab] = useState('customize');
    const [newUsername, setNewUsername] = useState(user?.displayName || '');
    const [feedback, setFeedback] = useState('');
    const [myClips, setMyClips] = useState([]);

    // Fetch Your Clips dynamically
    useEffect(() => {
        if(user) {
            onValue(ref(db, 'posts'), (snapshot) => {
                const data = snapshot.val();
                if(data) {
                    const allPosts = Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse();
                    setMyClips(allPosts.filter(p => p.userId === user.uid));
                } else {
                    setMyClips([]);
                }
            });
        }
    }, [user]);

    const handleUpdateProfile = () => {
        if(user) {
            updateProfile(user, { displayName: newUsername }).then(()=>alert("Username updated successfully!"));
        }
    };

    const handleUpgrade = () => {
        if(user) {
            update(ref(db, `users/${user.uid}`), { subscriptionPlan: 'premium' }).then(()=>alert("Upgraded to Premium successfully!"));
        }
    };

    const handleFeedback = () => {
        if(feedback) {
            push(ref(db, 'feedbacks'), { userId: user.uid, text: feedback, time: serverTimestamp() }).then(()=>{
                alert("Feedback sent!"); setFeedback('');
            });
        }
    };

    const handleDeleteClip = (postId) => {
        if(window.confirm("Delete this clip permanently?")) {
            remove(ref(db, `posts/${postId}`));
        }
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
                        <button className="w-full py-4 bg-white/10 text-white/50 font-bold rounded-lg uppercase tracking-widest cursor-not-allowed flex justify-center items-center gap-2 border border-white/20"><Star size={20} /> ENHANCE SUBSCRIPTION (COMING SOON)</button>
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
                        <label className="text-[#FF00A6] text-xs font-bold uppercase tracking-widest mb-2 block">Joined Date</label>
                        <p className="text-white font-mono bg-black/50 p-3 rounded border border-white/10">{userProfileData?.joinedDate ? new Date(userProfileData.joinedDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-[#FF00A6] text-xs font-bold uppercase tracking-widest mb-2 block">Display Username</label>
                        <div className="flex gap-2">
                            <input type="text" value={newUsername} onChange={(e)=>setNewUsername(e.target.value)} className="flex-1 bg-black/50 border border-white/30 p-3 rounded text-white outline-none focus:border-[#00FF41] transition"/>
                            <button onClick={handleUpdateProfile} className="bg-[#00FF41] px-6 rounded text-black font-black uppercase hover:bg-[#FF00A6] hover:text-white transition shadow-lg flex items-center gap-2"><Edit3 size={18}/> SAVE</button>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                        <label className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 block">Send Feedback to Devs</label>
                        <textarea value={feedback} onChange={(e)=>setFeedback(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 rounded text-white outline-none mb-3 resize-none focus:border-[#FF00A6]" rows="3" placeholder="Found a bug? Tell us..."></textarea>
                        <button onClick={handleFeedback} className="bg-white/10 text-white px-6 py-2 font-bold uppercase tracking-widest rounded hover:bg-white/20 transition border border-white/30">Submit Feedback</button>
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

// ... (HighlightsPage, SubscriptionsPage, AboutUsPage and other components remain exactly the same as previously defined)
// Since HighlightsPage was fully implemented in the previous step, here is its direct inclusion to complete the file:

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
                        <div 
                            key={sub.id} 
                            onClick={() => goToChannel(sub.id, sub.streamerName)}
                            className="bg-black/60 border-2 border-[#00FF41]/30 p-4 rounded-lg flex items-center gap-4 hover:border-[#00FF41] transition cursor-pointer group shadow-lg"
                        >
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
// 7. CHANNEL PAGE (Part 1: Skeleton & UI Layout)
// ==========================================
const ChannelPage = ({ channelId, channelName, goBack }) => {
    // 'vods' သို့မဟုတ် 'highlights' Tab ကို မှတ်သားထားမည့် State
    const [activeChannelTab, setActiveChannelTab] = useState('vods'); 

    return (
        <div className="p-8 h-full overflow-y-auto bg-black custom-scrollbar">
            {/* Back Button (နောက်သို့ ပြန်ဆုတ်ရန်) */}
            <button 
                onClick={goBack} 
                className="mb-6 text-[#FF00A6] font-bold uppercase flex items-center gap-2 hover:text-white transition w-fit"
            >
                <ArrowLeft size={18}/> BACK TO PREVIOUS
            </button>

            {/* Channel Header (ပရိုဖိုင်ပုံ၊ နာမည် နှင့် Subscribe ခလုတ်) */}
            <div className="bg-black/60 border-2 border-[#00FF41]/50 rounded-xl p-8 mb-8 flex justify-between items-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#00FF41]/20 border-4 border-[#00FF41] flex items-center justify-center shadow-lg">
                        <User size={48} className="text-[#00FF41]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                            {channelName || 'STREAMER CHANNEL'}
                        </h1>
                        <p className="text-white/50 font-mono mt-2">Loading channel statistics...</p>
                    </div>
                </div>
                
                {/* Subscribe Button Placeholder */}
                <button className="px-8 py-3 bg-[#FF00A6] text-white font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(255,0,166,0.4)] hover:bg-[#FF00A6]/80 transition">
                    SUBSCRIBE
                </button>
            </div>

            {/* Channel Content Tabs (VODs နှင့် Highlights) */}
            <div className="flex gap-8 border-b border-white/20 pb-4 mb-6">
                <button 
                    onClick={() => setActiveChannelTab('vods')} 
                    className={`text-xl font-black uppercase transition ${activeChannelTab === 'vods' ? 'text-[#00FF41]' : 'text-white/50 hover:text-white'}`}
                >
                    VIDEOS (VODS)
                </button>
                <button 
                    onClick={() => setActiveChannelTab('highlights')} 
                    className={`text-xl font-black uppercase transition ${activeChannelTab === 'highlights' ? 'text-[#FF00A6]' : 'text-white/50 hover:text-white'}`}
                >
                    COMMUNITY HIGHLIGHTS
                </button>
            </div>

            {/* Content Area Placeholder (နောက်အပိုင်းများတွင် Data များ ထည့်သွင်းမည်) */}
            <div className="text-white/50 font-mono text-center p-10 bg-white/5 rounded-lg border border-white/10">
                {activeChannelTab === 'vods' 
                    ? "Streamer's uploaded VODs will be loaded here dynamically." 
                    : "Streamer's images, clips, and posts will appear here."}
            </div>
        </div>
    );
};

const AboutUsPage = () => {
    const [tab, setTab] = useState('about');
    return (
        <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8 border-b border-white/20 pb-4">
                <button onClick={()=>setTab('about')} className={`text-2xl font-black uppercase transition ${tab==='about'?'text-[#FF00A6]':'text-white/50 hover:text-white'}`}>ABOUT WEBSITE</button><label className="text-white">|</label>    
                <button onClick={()=>setTab('packages')} className={`text-2xl font-black uppercase transition ${tab==='packages'?'text-[#00FF41]':'text-white/50 hover:text-white'}`}>PACKAGES</button>
            </div>
            {tab === 'about' && (
                <div className="bg-black/60 border border-white/10 p-6 rounded-lg text-white/80 font-mono space-y-4 leading-relaxed">
                    <p>Welcome to <span className="text-[#FF00A6] font-bold">ESPORTRESTREAM</span>, the ultimate third-party streaming aggregator built for gamers and esports enthusiasts.</p>
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

const AdminPanel = () => (
    <div className="p-8 h-full overflow-y-auto">
        <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3"><Shield className="text-red-500" /> SYSTEM ADMIN PANEL</h2>
        <div className="bg-black/60 border-2 border-red-500/50 p-6 rounded-lg"><button className="px-6 py-3 bg-red-600 text-white font-black uppercase rounded">Manage Users</button></div>
    </div>
);

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [userProfileData, setUserProfileData] = useState(null);
    const [selectedLive, setSelectedLive] = useState(null);
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const [selectedChannelName, setSelectedChannelName] = useState('');

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
                }
            } else setUserProfileData(null);
        });
        return () => unsubscribe();
    }, []);

    const userRole = userProfileData?.role || 'audience';

    const navCategories = [
        {
            title: 'GENERAL',
            items: [
                { id: 'home', label: 'HOME (VODS)', icon: Home, show: true },
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
                                    {isSidebarOpen && <div className="h-px bg-white/10 mx-4 mb-2"></div>}
                                    <div className="px-2 space-y-1">
                                        {visibleItems.map(item => (
                                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg font-bold transition whitespace-nowrap overflow-hidden ${activeTab === item.id ? 'bg-[#FF00A6]/20 text-[#FF00A6]' : 'text-white/60 hover:bg-white/5'}`}>
                                                <item.icon size={20} className="shrink-0" />
                                                <span className={`text-sm uppercase tracking-wider transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-2 border-t border-white/10">
                        {user ? (
                            <button onClick={() => {signOut(auth); setActiveTab('home');}} className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-white/50 hover:text-red-500 transition">
                                <LogOut size={20} className="shrink-0" /><span className={`text-sm font-bold uppercase ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>LOGOUT</span>
                            </button>
                        ) : (
                            <button onClick={async () => await signInWithPopup(auth, provider)} className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-black bg-[#00FF41] hover:bg-[#00FF41]/80 transition">
                                <LogIn size={20} className="shrink-0" /><span className={`text-sm font-black uppercase ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>LOGIN</span>
                            </button>
                        )}
                    </div>
                </aside>

                <main className="flex-1 h-full overflow-hidden relative bg-black">
                    <div className="absolute inset-0 z-10 h-full w-full">
                        {activeTab === 'home' && <HomePage />}
                        {activeTab === 'lives' && <LivesPage setSelectedLive={setSelectedLive} setActiveTab={setActiveTab} />}
                        {activeTab === 'live' && <LiveStreamingPage selectedLive={selectedLive} setSelectedLive={setSelectedLive} user={user} />}
                        {activeTab === 'highlights' && <HighlightsPage user={user} />}
                        {activeTab === 'subs' && <SubscriptionsPage user={user} goToChannel={goToChannel} />}
                        {activeTab === 'profile' && <UserProfilePage user={user} userProfileData={userProfileData} />}
                        {activeTab === 'streamer_dash' && <StreamerDashboard user={user} />}
                        {activeTab === 'about' && <AboutUsPage />}
                        {activeTab === 'admin_panel' && <AdminPanel />}
                       {activeTab === 'channel' && <ChannelPage user={user} channelId={selectedChannelId} channelName={selectedChannelName} goBack={() => setActiveTab('subs')} />}
                    </div>
                </main>
            </div>
        </div>
    );
}