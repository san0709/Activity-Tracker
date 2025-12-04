// WorkDetailModal.jsx
import React, { useState } from "react";

function WorkDetailModal({ show, onClose, onConfirm }) {
    const [caseNumber, setCaseNumber] = useState("");
    const [processDesc, setProcessDesc] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!caseNumber.trim() || !processDesc.trim()) {
            setError("Both fields are required");
            return;
        }
        onConfirm({ caseNumber, processDesc });
        // reset fields
        setCaseNumber("");
        setProcessDesc("");
        setError("");
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Work Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label className="form-label">Case Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={caseNumber}
                                onChange={(e) => setCaseNumber(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Process Description</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={processDesc}
                                onChange={(e) => setProcessDesc(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleConfirm}>Start</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkDetailModal;
