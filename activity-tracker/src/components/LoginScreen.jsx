import React, { useState } from 'react';

// Mock employee data (20 entries)
const EMPLOYEE_DATA = [
    { id: "EMP001", name: "Aarav Sharma", designation: "Senior Developer", project: "Alpha Pay", manager: "Vikram Singh" },
    { id: "EMP002", name: "Vivaan Gupta", designation: "UI/UX Designer", project: "Beta Health", manager: "Anjali Desai" },
    { id: "EMP003", name: "Aditya Kumar", designation: "QA Engineer", project: "Gamma Logistics", manager: "Rohan Mehta" },
    { id: "EMP004", name: "Vihaan Singh", designation: "Data Analyst", project: "Delta FinTech", manager: "Vikram Singh" },
    { id: "EMP005", name: "Arjun Mishra", designation: "Backend Developer", project: "Alpha Pay", manager: "Anjali Desai" },
    { id: "EMP006", name: "Sai Iyer", designation: "Frontend Developer", project: "Beta Health", manager: "Rohan Mehta" },
    { id: "EMP007", name: "Reyansh Reddy", designation: "DevOps Engineer", project: "Gamma Logistics", manager: "Vikram Singh" },
    { id: "EMP008", name: "Krishna Das", designation: "Product Manager", project: "Delta FinTech", manager: "Anjali Desai" },
    { id: "EMP009", name: "Ishaan Nair", designation: "Business Analyst", project: "Alpha Pay", manager: "Rohan Mehta" },
    { id: "EMP010", name: "Shaurya Patel", designation: "Full Stack Developer", project: "Beta Health", manager: "Vikram Singh" },
    { id: "EMP011", name: "Ayan Khan", designation: "Mobile Developer", project: "Gamma Logistics", manager: "Anjali Desai" },
    { id: "EMP012", name: "Dhruv Joshi", designation: "Cloud Architect", project: "Delta FinTech", manager: "Rohan Mehta" },
    { id: "EMP013", name: "Kabir Malhotra", designation: "Security Analyst", project: "Alpha Pay", manager: "Vikram Singh" },
    { id: "EMP014", name: "Ritvik Jain", designation: "Database Administrator", project: "Beta Health", manager: "Anjali Desai" },
    { id: "EMP015", name: "Riaan Saxena", designation: "Network Engineer", project: "Gamma Logistics", manager: "Rohan Mehta" },
    { id: "EMP016", name: "Ananya Verma", designation: "Content Strategist", project: "Delta FinTech", manager: "Vikram Singh" },
    { id: "EMP017", name: "Diya Kaur", designation: "HR Specialist", project: "Alpha Pay", manager: "Anjali Desai" },
    { id: "EMP018", name: "Myra Choudhury", designation: "Marketing Lead", project: "Beta Health", manager: "Rohan Mehta" },
    { id: "EMP019", name: "Saanvi Roy", designation: "Sales Executive", project: "Gamma Logistics", manager: "Vikram Singh" },
    { id: "EMP020", name: "Pari Agarwal", designation: "Customer Support", project: "Delta FinTech", manager: "Anjali Desai" }
];

function LoginScreen({ onLogin }) {
    const [empId, setEmpId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = EMPLOYEE_DATA.find((u) => u.id === empId);
        if (user && 'pass' === 'pass') {
            onLogin(user);
        } else {
            setError('Invalid Employee ID or password');
        }
    };

    return (
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="login-card card p-4 shadow-sm">
            <h3
              className="text-center text-primary fw-bold fs-3

 mb-3"
            >
              Login
            </h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  placeholder="EMP001
                  className="form-label text-secondary"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control"
                  defaultValue="pass"
                  readOnly
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}

export default LoginScreen;
