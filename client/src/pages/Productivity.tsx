import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react'; 
import { 
	CheckCircle2, Circle, Plus, Trash2, Smile, 
	Brain, Timer, Play, Pause, RotateCcw 
} from 'lucide-react';
import type { 
	IPlannerEntry, 
	IEmotionalCheckin, 
	IBrainDumpEntry, 
	IFocusSession 
} from '../types/index.js';

// --- Define the Expected Local User Data Structure ---
interface ILocalUserData {
    plannerEntries: IPlannerEntry[];
    emotionalCheckins: IEmotionalCheckin[];
    brainDumpEntries: IBrainDumpEntry[];
    focusSessions: IFocusSession[];
    id: string;
    publicMetadata: Record<string, unknown>;
}

export const Productivity = () => {
    // --- 1. UNCONDITIONAL HOOK CALLS (MUST BE AT THE TOP) ---

    // Hook 1: Clerk Auth
    const { user, isLoaded } = useUser();
    
    // Hook 2: Local User State (Initialization relies on useEffect below)
    const [localUserData, setLocalUserData] = useState<ILocalUserData | null>(null);

    // Hooks 3 - 10: Component Local State (MOVED TO THE TOP)
    const [newTask, setNewTask] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('09:00');
    const [newMood, setNewMood] = useState<IEmotionalCheckin['checkinMood']>('calm');
    const [moodNotes, setMoodNotes] = useState('');
    const [brainDumpInput, setBrainDumpInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [isWorkMode, setIsWorkMode] = useState(true); // Work vs Break
    const [selectedTab, setSelectedTab] = useState<'planner' | 'habits' | 'mood' | 'brain-dump' | 'focus'>('planner');
    
    // --- 2. EFFECT HOOKS ---
    
    // Hook 11: Initialization Effect
    useEffect(() => {
        if (isLoaded) {
            if (user) {
                setLocalUserData({
                    id: user.id,
                    publicMetadata: user.publicMetadata,
                    plannerEntries: (user.publicMetadata.plannerEntries as IPlannerEntry[] || []),
                    emotionalCheckins: (user.publicMetadata.emotionalCheckins as IEmotionalCheckin[] || []),
                    brainDumpEntries: (user.publicMetadata.brainDumpEntries as IBrainDumpEntry[] || []),
                    focusSessions: (user.publicMetadata.focusSessions as IFocusSession[] || []),
                });
            } else {
                setLocalUserData(null);
            }
        }
    }, [isLoaded, user]);

    // Hook 12: Focus Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && localUserData) { // Check localUserData inside effect for safety
            setIsActive(false);
            if (isWorkMode) {
                const newSession: IFocusSession = {
                    _id: `focus_${Date.now()}`,
                    duration: 25,
                    completedAt: new Date()
                };
                const updatedSessions = [...localUserData.focusSessions, newSession];
                updateLocalUser({ focusSessions: updatedSessions });
                
                console.log("Focus session complete! Time for a break."); 
                setIsWorkMode(false);
                setTimeLeft(5 * 60);
            } else {
                console.log("Break over! Time to focus.");
                setIsWorkMode(true);
                setTimeLeft(25 * 60);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isWorkMode, localUserData]); // Added localUserData to dependency array

    // --- 3. HELPER FUNCTIONS (Non-hook) ---

    // Helper function to simulate updating the user data (to be replaced by API call)
    const updateLocalUser = (updatedData: Partial<ILocalUserData>) => {
        console.log("SIMULATING API CALL TO UPDATE USER DATA:", updatedData);
        setLocalUserData(prev => {
            if (!prev) return null;
            return ({ ...prev, ...updatedData } as ILocalUserData);
        });
    };
    
    const moods: IEmotionalCheckin['checkinMood'][] = ['happy', 'sad', 'anxious', 'calm', 'overwhelmed', 'focused'];

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(isWorkMode ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- 4. CONDITIONAL RETURN (Rendering the loader) ---

    if (!isLoaded || !localUserData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading productivity tools...</p>
            </div>
        );
    }
    
    // --- 5. RENDER LOGIC (localUserData is now guaranteed to be ILocalUserData) ---

    // --- Planner Handlers (Using localUserData) ---
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const newEntry: IPlannerEntry = {
            _id: `entry_${Date.now()}`,
            pEntryTime: newTaskTime,
            pEntryTask: newTask,
            pEntryStatus: 'pending',
            createdAt: new Date(),
        };

        const updatedEntries = [...localUserData.plannerEntries, newEntry];
        updateLocalUser({ plannerEntries: updatedEntries });
        setNewTask('');
        setNewTaskTime('09:00');
    };

    const handleToggleTask = (entryId: string | undefined) => {
        if (!entryId) return;
        const updatedEntries = localUserData.plannerEntries.map(entry =>
            entry._id === entryId
                ? { ...entry, pEntryStatus: entry.pEntryStatus === 'completed' ? 'pending' : 'completed' as const }
                : entry
        );
        updateLocalUser({ plannerEntries: updatedEntries });
    };

    const handleDeleteTask = (entryId: string | undefined) => {
        if (!entryId) return;
        const updatedEntries = localUserData.plannerEntries.filter(e => e._id !== entryId);
        updateLocalUser({ plannerEntries: updatedEntries });
    };

    // --- Mood Handlers (Using localUserData) ---
    const handleAddMoodCheckin = (e: React.FormEvent) => {
        e.preventDefault();
        const newCheckin: IEmotionalCheckin = {
            _id: `checkin_${Date.now()}`,
            checkinMood: newMood,
            checkinNotes: moodNotes,
            checkinDate: new Date(),
        };
        const updatedCheckins = [...localUserData.emotionalCheckins, newCheckin];
        updateLocalUser({ emotionalCheckins: updatedCheckins });
        setMoodNotes('');
    };

    // --- Brain Dump Handlers (Using localUserData) ---
    const handleAddBrainDump = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brainDumpInput.trim()) return;

        const newDump: IBrainDumpEntry = {
            _id: `dump_${Date.now()}`,
            content: brainDumpInput,
            createdAt: new Date(),
        };

        const updatedEntries = [newDump, ...localUserData.brainDumpEntries]; 
        updateLocalUser({ brainDumpEntries: updatedEntries });
        setBrainDumpInput('');
    };

    const handleDeleteBrainDump = (id: string) => {
        const updatedEntries = localUserData.brainDumpEntries.filter(b => b._id !== id);
        updateLocalUser({ brainDumpEntries: updatedEntries });
    };
    
    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Productivity Tools</h1>
                <p className="text-[#263A47] mb-8">Manage your tasks, habits, focus, and mind.</p>

                {/* Navigation Tabs */}
                <div className="flex space-x-2 mb-6 border-b border-[#D7E9ED] overflow-x-auto">
                    {([
                        { id: 'planner', label: 'Planner' },
                        { id: 'habits', label: 'Habits' },
                        { id: 'mood', label: 'Mood' },
                        { id: 'brain-dump', label: 'Brain Dump' },
                        { id: 'focus', label: 'Focus Timer' }
                    ] as const).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`px-4 py-2 font-medium border-b-2 transition whitespace-nowrap ${
                                selectedTab === tab.id
                                    ? 'text-[#30506C] border-[#469CA4]'
                                    : 'text-[#263A47] border-transparent hover:border-[#D7E9ED]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* PLANNER TAB */}
                {selectedTab === 'planner' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-[#30506C] mb-4">Today's Tasks</h2>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {localUserData.plannerEntries.length === 0 ? (
                                        <p className="text-[#263A47] text-center py-8">No tasks yet. Add one to get started!</p>
                                    ) : (
                                        localUserData.plannerEntries.map(entry => (
                                            <div key={entry._id} className="flex items-center justify-between p-3 bg-[#F5F0ED] rounded-lg hover:bg-[#D7E9ED] transition">
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <button onClick={() => handleToggleTask(entry._id)} className="text-[#469CA4] hover:text-[#30506C] transition">
                                                        {entry.pEntryStatus === 'completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                                    </button>
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${entry.pEntryStatus === 'completed' ? 'text-[#263A47] line-through' : 'text-[#30506C]'}`}>
                                                            {entry.pEntryTask}
                                                        </p>
                                                        <p className="text-sm text-[#263A47]">{entry.pEntryTime}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteTask(entry._id)} className="text-red-500 hover:text-red-700 transition ml-2">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Add Task</h2>
                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Time</label>
                                    <input type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Task</label>
                                    <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..." className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]" />
                                </div>
                                <button type="submit" className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition flex items-center justify-center space-x-2">
                                    <Plus size={20} />
                                    <span>Add Task</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* HABITS TAB */}
                {selectedTab === 'habits' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[#30506C] mb-4">Your Habits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#D7E9ED] rounded-lg p-4">
                                <p className="font-medium text-[#30506C] mb-2">Morning Exercise</p>
                                <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                                    <div className="bg-[#469CA4] h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-sm text-[#263A47]">75% Progress • Daily</p>
                            </div>
                            <div className="bg-[#D7E9ED] rounded-lg p-4">
                                <p className="font-medium text-[#30506C] mb-2">Meditation</p>
                                <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                                    <div className="bg-[#469CA4] h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <p className="text-sm text-[#263A47]">60% Progress • Daily</p>
                            </div>
                        </div>
                        <p className="text-[#263A47] text-center mt-6 text-sm">Habit tracking coming soon!</p>
                    </div>
                )}

                {/* MOOD TAB */}
                {selectedTab === 'mood' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Mood History</h2>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {localUserData.emotionalCheckins.length === 0 ? (
                                    <p className="text-[#263A47] text-center py-8">No mood check-ins yet. Start tracking today!</p>
                                ) : (
                                    localUserData.emotionalCheckins.slice().reverse().map(checkin => (
                                        <div key={checkin._id} className="p-4 bg-[#F5F0ED] rounded-lg border-l-4 border-[#469CA4]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-[#30506C] capitalize">{checkin.checkinMood}</span>
                                                <span className="text-sm text-[#263A47]">{new Date(checkin.checkinDate).toLocaleDateString()}</span>
                                            </div>
                                            {checkin.checkinNotes && <p className="text-[#263A47] text-sm">{checkin.checkinNotes}</p>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                                <Smile size={24} />
                                <span>Check In</span>
                            </h2>
                            <form onSubmit={handleAddMoodCheckin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">How are you feeling?</label>
                                    <select value={newMood} onChange={(e) => setNewMood(e.target.value as IEmotionalCheckin['checkinMood'])} className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]">
                                        {moods.map(mood => (
                                            <option key={mood} value={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Notes (optional)</label>
                                    <textarea value={moodNotes} onChange={(e) => setMoodNotes(e.target.value)} placeholder="How are you feeling today?..." rows={3} className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4] resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition">Save Check-in</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* BRAIN DUMP TAB (NEW) */}
                {selectedTab === 'brain-dump' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center gap-2">
                                    <Brain size={24} />
                                    <span>Thought Stream</span>
                                </h2>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {localUserData.brainDumpEntries.length === 0 ? (
                                        <p className="text-[#263A47] text-center py-8">Mind full? Pour it out here.</p>
                                    ) : (
                                        localUserData.brainDumpEntries.map(entry => (
                                            <div key={entry._id} className="p-4 bg-[#F5F0ED] rounded-lg group relative">
                                                <p className="text-[#30506C] whitespace-pre-wrap">{entry.content}</p>
                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#D7E9ED]">
                                                    <span className="text-xs text-[#263A47]">{new Date(entry.createdAt).toLocaleString()}</span>
                                                    <button onClick={() => handleDeleteBrainDump(entry._id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Clear Your Mind</h2>
                            <form onSubmit={handleAddBrainDump} className="space-y-4">
                                <textarea 
                                    value={brainDumpInput} 
                                    onChange={(e) => setBrainDumpInput(e.target.value)} 
                                    placeholder="What's on your mind? Don't judge, just type..." 
                                    rows={6} 
                                    className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4] resize-none" 
                                />
                                <button type="submit" className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition">
                                    Dump Thoughts
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* FOCUS TIMER TAB (NEW) */}
                {selectedTab === 'focus' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="flex justify-center items-center gap-2 mb-6">
                                <Timer size={32} className="text-[#469CA4]" />
                                <h2 className="text-2xl font-bold text-[#30506C]">
                                    {isWorkMode ? 'Focus Session' : 'Break Time'}
                                </h2>
                            </div>
                            
                            <div className="mb-8">
                                <div className="text-8xl font-bold text-[#30506C] font-mono tracking-wider">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="flex justify-center space-x-6 mb-8">
                                <button 
                                    onClick={toggleTimer}
                                    className={`p-4 rounded-full transition ${
                                        isActive 
                                            ? 'bg-[#F5F0ED] text-[#30506C] hover:bg-[#D7E9ED]' 
                                            : 'bg-[#469CA4] text-white hover:bg-[#3a7f8a]'
                                    }`}
                                >
                                    {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                </button>
                                <button 
                                    onClick={resetTimer}
                                    className="p-4 rounded-full bg-[#F5F0ED] text-[#30506C] hover:bg-[#D7E9ED] transition"
                                >
                                    <RotateCcw size={32} />
                                </button>
                            </div>

                            <div className="border-t border-[#D7E9ED] pt-6">
                                <p className="text-[#263A47] mb-2 font-medium">Sessions Completed</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {/* Displays today's sessions as dots */}
                                    {localUserData.focusSessions
                                        .filter((s: IFocusSession) => new Date(s.completedAt).toDateString() === new Date().toDateString())
                                        .map((_, i) => (
                                        <div key={i} className="w-4 h-4 bg-[#469CA4] rounded-full" title="25 min session" />
                                    ))}
                                    {localUserData.focusSessions.filter((s: IFocusSession) => new Date(s.completedAt).toDateString() === new Date().toDateString()).length === 0 && (
                                        <span className="text-sm text-gray-400">No sessions yet today</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};