import React from 'react';
import { formatDuration, formatTimeIST } from '../utils';

function ActivityLogTable({ entries }) {
    return (
        <table className="table table-sm table-hover">
            <thead className="table-light">
                <tr>
                    <th>Activity</th>
                    <th>Case No.</th>
                    <th>Description</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((e) => (
                    <tr key={e.id} className={e.type === 'START' && !e.endTime ? 'table-success' : ''}>
                        <td>{e.activity}</td>
                        <td>{e.caseNumber || '-'}</td>
                        <td>{e.processDesc || '-'}</td>
                        <td>{formatTimeIST(e.date)}</td>
                        <td>{formatTimeIST(e.endTime)}</td>
                        <td>{e.duration ? formatDuration(e.duration) : '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ActivityLogTable;
