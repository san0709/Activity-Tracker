import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { __app_id, GEMINI_API_KEY } from '../config';
import { startOfToday, formatDuration } from '../utils';
import WorkDetailModal from './WorkDetailModal';
import GenericActivityModal from './GenericActivityModal';
import ActivityLogTable from './ActivityLogTable';
import AICopyReport from './AICopyReport';
import NotificationModal from './NotificationModal';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';

function TimeTrackerView({ user, onLogout }) {
    const [entries, setEntries] = useState([]);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [currentEntryId, setCurrentEntryId] = useState(null);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [showWorkModal, setShowWorkModal] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);
    const [pendingActivity, setPendingActivity] = useState(null);
    const [notification, setNotification] = useState(null);

    const timerRef = useRef(null);

    // Firestore real‑time listener for today's entries
    useEffect(() => {
        const start = Timestamp.fromDate(startOfToday());
        const q = query(
            collection(db, 'artifacts', __app_id, 'users', user.id, 'timeEntries'),
            where('date', '>=', start),
            orderBy('date', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = [];
            snapshot.forEach((docSnap) => {
                const d = docSnap.data();
                d.id = docSnap.id;
                data.push(d);
            });
            setEntries(data);
            // Determine if there is a running activity
            const running = data.find((e) => e.type === 'START' && !e.endTime);
            if (running) {
                setCurrentActivity(running.activity);
                setCurrentEntryId(running.id);
            } else {
                setCurrentActivity(null);
                setCurrentEntryId(null);
            }
        });
        return () => unsubscribe();
    }, [user.id]);

    // Timer that updates every second while an activity is running
    useEffect(() => {
        if (currentEntryId) {
            timerRef.current = setInterval(() => {
                const startEntry = entries.find((e) => e.id === currentEntryId);
                if (startEntry && startEntry.date) {
                    const start = startEntry.date.toDate();
                    const now = new Date();
                    setCurrentDuration(Math.floor((now - start) / 1000));
                }
            }, 1000);
        } else {
            setCurrentDuration(0);
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [currentEntryId, entries]);

    const endCurrentActivity = async () => {
        if (!currentEntryId) return;
        const entryRef = doc(db, 'artifacts', __app_id, 'users', user.id, 'timeEntries', currentEntryId);
        await updateDoc(entryRef, {
            endTime: Timestamp.now(),
            type: 'END',
            duration: currentDuration,
        });
        setCurrentActivity(null);
        setCurrentEntryId(null);
        setCurrentDuration(0);
    };

    const startActivity = async (activity) => {
        // Work requires specific modal
        if (activity === 'Work') {
            setShowWorkModal(true);
            return;
        }
        // Break, Meeting, Downtime, Other require generic description modal
        if (['Break', 'Meeting', 'Downtime', 'Other'].includes(activity)) {
            setPendingActivity(activity);
            setShowGenericModal(true);
            return;
        }

        // Celebration (or any others not listed above) starts immediately
        if (currentEntryId) await endCurrentActivity();
        const docRef = await addDoc(collection(db, 'artifacts', __app_id, 'users', user.id, 'timeEntries'), {
            type: 'START',
            activity,
            date: Timestamp.now(),
            userId: user.id,
        });
        setCurrentActivity(activity);
        setCurrentEntryId(docRef.id);
    };

    const handleGenericConfirm = async ({ description }) => {
        setShowGenericModal(false);
        const activity = pendingActivity;
        if (currentEntryId) await endCurrentActivity();
        const docRef = await addDoc(collection(db, 'artifacts', __app_id, 'users', user.id, 'timeEntries'), {
            type: 'START',
            activity,
            date: Timestamp.now(),
            processDesc: description, // Storing description in the same field as Work processDesc for simplicity in table
            userId: user.id,
        });
        setCurrentActivity(activity);
        setCurrentEntryId(docRef.id);
        setPendingActivity(null);
    };

    const handleWorkConfirm = async ({ caseNumber, processDesc }) => {
        setShowWorkModal(false);
        if (currentEntryId) await endCurrentActivity();
        const docRef = await addDoc(collection(db, 'artifacts', __app_id, 'users', user.id, 'timeEntries'), {
            type: 'START',
            activity: 'Work',
            date: Timestamp.now(),
            caseNumber,
            processDesc,
            userId: user.id,
        });
        setCurrentActivity('Work');
        setCurrentEntryId(docRef.id);
    };

    // Summary metrics for the footer
    const totalWork = entries.reduce((sum, e) => (e.type === 'END' && e.activity === 'Work' && e.duration ? sum + e.duration : sum), 0);
    const totalBreak = entries.reduce((sum, e) => (e.type === 'END' && e.activity === 'Break' && e.duration ? sum + e.duration : sum), 0);
    const totalLogged = entries.reduce((sum, e) => (e.type === 'END' && e.duration ? sum + e.duration : sum), 0);

    return (
        <div className="row">
            {/* Header */}
            <div className="col-12 mb-3">
                <div className="header d-flex justify-content-between align-items-center">
                    <div>
                        <h4>{user.name}</h4>
                        <p className="mb-0">
                            ID: {user.id} | {user.designation} | {user.project} | Manager: {user.manager}
                        </p>
                    </div>
                    <button className="btn btn-light" onClick={onLogout}>Log Out</button>
                </div>
            </div>

            {/* Main area */}
            <div className="col-md-8">
                {/* Current activity & controls */}
                <div className="card p-3 mb-3 shadow-sm">
                    <h5>Current Activity: {currentActivity || 'None'}</h5>
                    {currentActivity && <p>Duration: {formatDuration(currentDuration)}</p>}
                    <div className="d-flex flex-wrap gap-2">
                        {['Work', 'Break', 'Meeting', 'Celebration', 'Downtime', 'Other'].map((act) => (
                            <button
                                key={act}
                                className="btn btn-primary activity-btn"
                                onClick={() => startActivity(act)}
                                disabled={currentActivity && act !== currentActivity}
                            >
                                {act}
                            </button>
                        ))}
                        {currentActivity && (
                            <button className="btn btn-danger activity-btn" onClick={endCurrentActivity}>Stop Activity</button>
                        )}
                    </div>
                </div>

                {/* Activity log table */}
                <div className="card p-3 shadow-sm">
                    <h5>Activity Log (Today)</h5>
                    <ActivityLogTable entries={entries} />
                </div>
            </div>

            {/* Footer AI report */}
            <div className="col-md-4">
                <AICopyReport
                    totalWork={totalWork}
                    totalBreak={totalBreak}
                    totalLogged={totalLogged}
                    dailyEntries={entries}
                    setNotification={setNotification}
                />
            </div>

            {/* Modals */}
            <WorkDetailModal show={showWorkModal} onClose={() => setShowWorkModal(false)} onConfirm={handleWorkConfirm} />
            <GenericActivityModal
                show={showGenericModal}
                activityName={pendingActivity}
                onClose={() => { setShowGenericModal(false); setPendingActivity(null); }}
                onConfirm={handleGenericConfirm}
            />
            {notification && <NotificationModal message={notification} onClose={() => setNotification(null)} />}
        </div>
    );
}

export default TimeTrackerView;
