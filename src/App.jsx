import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

// Brand Icon Components
const LinkedInIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const FacebookIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

// User provided Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjs8qFGZXHzu9uMZGTANuazS7Btm23w8U",
    authDomain: "n8n-6a7ad.firebaseapp.com",
    projectId: "n8n-6a7ad",
    storageBucket: "n8n-6a7ad.firebasestorage.app",
    messagingSenderId: "1077824737616",
    appId: "1:1077824737616:web:a79d373961155c312b1c55",
    measurementId: "G-HWVKXWV0Z4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = typeof __app_id !== 'undefined' ? __app_id : 'social-demo-v1';

const App = () => {
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState('linkedin');
    const [errorMsg, setErrorMsg] = useState(null);
    const [postData, setPostData] = useState({
        content: "Waiting for n8n push...",
        linkedin_content: "",
        facebook_content: "",
        instagram_content: "",
        linkedin_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        facebook_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        instagram_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        timestamp: new Date().toISOString()
    });

    useEffect(() => {
        const initAuth = async () => {
            try {
                await signInAnonymously(auth);
            } catch (err) {
                setErrorMsg("Auth Error: Enable Anonymous login in Firebase.");
            }
        };
        initAuth();
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const postRef = doc(db, 'artifacts', appId, 'public', 'data', 'posts', 'latest');
        const unsubscribe = onSnapshot(postRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setPostData(prev => ({
                    ...prev,
                    ...data,
                    content: data.content || prev.content,
                    linkedin_content: data.linkedin_content !== undefined ? data.linkedin_content : prev.linkedin_content,
                    facebook_content: data.facebook_content !== undefined ? data.facebook_content : prev.facebook_content,
                    instagram_content: data.instagram_content !== undefined ? data.instagram_content : prev.instagram_content,
                    linkedin_image: data.linkedin_image || prev.linkedin_image,
                    facebook_image: data.facebook_image || prev.facebook_image,
                    instagram_image: data.instagram_image || prev.instagram_image,
                    timestamp: data.timestamp || prev.timestamp
                }));
                setErrorMsg(null);
            }
        }, (error) => {
            setErrorMsg("Permission Denied. Check Firestore Rules.");
        });
        return () => unsubscribe();
    }, [user]);

    const endpointUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/artifacts/${appId}/public/data/posts/latest`;

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <aside className="w-64 bg-white border-r flex flex-col p-6 gap-8 fixed h-full z-10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="bg-blue-600 p-1.5 rounded text-white shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    Auto-Preview
                </div>
                <nav className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Platforms</p>
                    <button onClick={() => setActivePage('linkedin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activePage === 'linkedin' ? 'bg-[#0a66c2] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                        <LinkedInIcon className="w-5 h-5" /> LinkedIn
                    </button>
                    <button onClick={() => setActivePage('facebook')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activePage === 'facebook' ? 'bg-[#1877f2] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                        <FacebookIcon className="w-5 h-5" /> Facebook
                    </button>
                    <button onClick={() => setActivePage('instagram')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activePage === 'instagram' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                        <InstagramIcon className="w-5 h-5" /> Instagram
                    </button>
                    <div className="my-4 border-t pt-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Setup</p>
                        <button onClick={() => setActivePage('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activePage === 'config' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                            n8n Config
                        </button>
                    </div>
                </nav>
                <div className="mt-auto">
                    {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 mb-4">{errorMsg}</div>}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">Status: {user ? 'Connected ✓' : 'Connecting...'}</p>
                    </div>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8 flex flex-col items-center justify-center min-h-screen">
                {activePage === 'linkedin' && (
                    <div className="w-full max-w-[552px] animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden font-sans">
                            <div className="p-4 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-slate-200 mr-3 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-[15px] text-gray-900 leading-tight hover:text-blue-600 hover:underline cursor-pointer">Your Brand Name</h4>
                                    <p className="text-xs text-gray-500">Premium Brand Identity</p>
                                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                        Just now • <span className="ml-1 text-gray-400 text-[10px]">🌐</span>
                                    </p>
                                </div>
                            </div>
                            <div className="px-4 pb-3">
                                <p className="text-[14px] text-gray-800 leading-normal break-words whitespace-pre-wrap">
                                    {postData.linkedin_content || postData.content}
                                </p>
                            </div>
                            <div className="w-full bg-gray-100 relative pt-[100%] border-y border-gray-100">
                                <img src={postData.linkedin_image} alt="LinkedIn Post" className="absolute top-0 left-0 w-full h-full object-cover" />
                            </div>
                            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center -mr-1 z-10 border border-white text-[10px] text-white">👍</div>
                                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border border-white text-[10px] text-white">❤️</div>
                                    <span className="text-xs text-gray-500 ml-1 hover:text-blue-600 cursor-pointer">42</span>
                                </div>
                                <span className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer">5 comments • 2 reposts</span>
                            </div>
                            <div className="flex items-center justify-between px-2 py-1">
                                <button className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-500 hover:bg-gray-100 rounded transition-colors text-[14px] font-semibold">
                                    <span className="text-[18px]">👍</span>
                                    <span>Like</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-500 hover:bg-gray-100 rounded transition-colors text-[14px] font-semibold">
                                    <span className="text-[18px]">💬</span>
                                    <span>Comment</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-500 hover:bg-gray-100 rounded transition-colors text-[14px] font-semibold">
                                    <span className="text-[18px]">🔁</span>
                                    <span>Repost</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-500 hover:bg-gray-100 rounded transition-colors text-[14px] font-semibold">
                                    <span className="text-[18px]">✈️</span>
                                    <span>Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'facebook' && (
                    <div className="w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
                            <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 mr-2 border border-black/10"></div>
                                    <div>
                                        <h4 className="font-semibold text-[15px] text-gray-900 leading-tight hover:underline cursor-pointer">Your Brand Name</h4>
                                        <p className="text-[13px] text-gray-500 flex items-center hover:underline cursor-pointer">
                                            Just now · <span className="ml-1 text-gray-400 text-xs">🌍</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-gray-500 text-xl pb-2 font-bold select-none cursor-pointer hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">⋯</div>
                            </div>
                            <div className="px-4 pb-3">
                                <p className="text-[15px] text-gray-900 break-words whitespace-pre-wrap">
                                    {postData.facebook_content || postData.content}
                                </p>
                            </div>
                            <div className="w-full bg-gray-100 border-y border-gray-100">
                                <img src={postData.facebook_image} alt="Facebook Post" className="w-full h-auto object-contain max-h-[500px]" />
                            </div>
                            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] z-10 border-2 border-white shadow-sm">👍</div>
                                    <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] -ml-1 border-2 border-white shadow-sm">❤️</div>
                                    <span className="text-[14px] text-gray-500 ml-2 hover:underline cursor-pointer">128</span>
                                </div>
                                <div className="text-[14px] text-gray-500 flex space-x-3">
                                    <span className="hover:underline cursor-pointer">12 Comments</span>
                                    <span className="hover:underline cursor-pointer">4 Shares</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1">
                                <button className="flex-1 flex items-center justify-center space-x-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-[15px] font-medium mx-1">
                                    <span className="text-[18px]">👍</span>
                                    <span>Like</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-[15px] font-medium mx-1">
                                    <span className="text-[18px]">💬</span>
                                    <span>Comment</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-[15px] font-medium mx-1">
                                    <span className="text-[18px]">➦</span>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'instagram' && (
                    <div className="w-full max-w-[470px] animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white border border-gray-200 rounded-[3px] font-sans pb-3 shadow-sm">
                            <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] cursor-pointer">
                                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                                            <div className="w-full h-full rounded-full bg-slate-200"></div>
                                        </div>
                                    </div>
                                    <span className="ml-3 font-semibold text-[14px] text-gray-900 cursor-pointer">yourbrand.official</span>
                                </div>
                                <div className="text-gray-900 font-bold select-none cursor-pointer px-2">•••</div>
                            </div>
                            <div className="w-full bg-gray-100">
                                <img src={postData.instagram_image} alt="Instagram Post" className="w-full h-auto aspect-square object-cover" />
                            </div>
                            <div className="px-3 pt-3">
                                <div className="flex justify-between items-center mb-2 text-2xl">
                                    <div className="flex space-x-4 items-center">
                                        <span className="cursor-pointer hover:opacity-50 transition-opacity">❤️</span>
                                        <span className="cursor-pointer hover:opacity-50 transition-opacity">💬</span>
                                        <span className="cursor-pointer hover:opacity-50 transition-opacity text-[26px]">✈️</span>
                                    </div>
                                    <div>
                                        <span className="cursor-pointer hover:opacity-50 transition-opacity text-xl">🔖</span>
                                    </div>
                                </div>
                                <div className="font-semibold text-[14px] text-gray-900 mb-1 cursor-pointer">2,451 likes</div>
                                <div className="text-[14px] leading-tight break-words whitespace-pre-wrap">
                                    <span className="font-semibold mr-1 cursor-pointer">yourbrand.official</span>
                                    {postData.instagram_content || postData.content}
                                </div>
                                <div className="text-[13px] text-gray-500 mt-1 cursor-pointer">View all 34 comments</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-2">2 HOURS AGO</div>
                            </div>
                            <div className="px-3 pt-3 mt-3 border-t border-gray-100 flex items-center text-[14px]">
                                <span className="text-[20px] mr-3">☺</span>
                                <input type="text" placeholder="Add a comment..." className="flex-1 outline-none font-sans" />
                                <button className="text-blue-500 font-semibold opacity-50 cursor-default">Post</button>
                            </div>
                        </div>
                    </div>
                )}
                {activePage === 'config' && (
                    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-white p-10 rounded-2xl border shadow-sm">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-800">Final n8n Setup</h2>
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-sm">
                                    <p><strong>Step 1:</strong> Set Method to <code>PATCH</code></p>
                                    <p className="mt-2"><strong>Step 2:</strong> Use this URL (it has your key):</p>
                                    <div className="bg-slate-900 rounded p-4 text-green-400 font-mono text-xs mt-1 break-all select-all">
                                        {endpointUrl}?key={firebaseConfig.apiKey}&updateMask.fieldPaths=linkedin_content&updateMask.fieldPaths=facebook_content&updateMask.fieldPaths=instagram_content&updateMask.fieldPaths=linkedin_image&updateMask.fieldPaths=facebook_image&updateMask.fieldPaths=instagram_image&updateMask.fieldPaths=timestamp
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-900 rounded-xl text-blue-300 font-mono text-xs leading-relaxed overflow-x-auto">
                                    <p className="text-slate-500 mb-2">// Because your captions come from Supabase and contain newlines/quotes, you MUST use an Expression for the ENTIRE body field in n8n to make it valid JSON.</p>
                                    <pre className="select-all">
                                        {`{{
  JSON.stringify({
    fields: {
      linkedin_content: { stringValue: $json.linkedin },
      facebook_content: { stringValue: $json.facebook },
      instagram_content: { stringValue: $json.instagram },
      linkedin_image: { stringValue: $json.image_url },
      facebook_image: { stringValue: $json.image_url },
      instagram_image: { stringValue: $json.image_url },
      timestamp: { stringValue: new Date().toISOString() }
    }
  })
}}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
