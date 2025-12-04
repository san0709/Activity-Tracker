// GenericActivityModal.jsx
import React, { useState } from "react";

function GenericActivityModal({ show, activityName, onClose, onConfirm }) {
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!description.trim()) {
            setError("Description is required");
            return;
        }
        onConfirm({ description });
        setDescription("");
        setError("");
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{activityName} Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={`Enter details for ${activityName}...`}
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

export default GenericActivityModal;
