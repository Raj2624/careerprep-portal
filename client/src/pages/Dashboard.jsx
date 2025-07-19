import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  // Fetch user info from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserAndRoadmap = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);

        // Fetch roadmap only if roleTarget exists
        if (res.data.user.roleTarget) {
          const roadmapRes = await axios.get("/api/roadmap", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRoadmap(roadmapRes.data);
        }
      } catch (err) {
        console.error("Token invalid or expired", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndRoadmap();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to Dashboard</h2>

      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Target Role:</strong> {user.roleTarget || "Not set"}</p>
          <button onClick={handleLogout}>Logout</button>

          {roadmap ? (
            <div style={{ marginTop: "2rem" }}>
              <h3>📈 Personalized Learning Roadmap</h3>
              <p><strong>Role:</strong> {roadmap.role}</p>

              <div style={{ marginTop: "1rem" }}>
                <h4>✅ Completed Skills:</h4>
                <ul>
                  {roadmap.completedSkills.length > 0 ? (
                    roadmap.completedSkills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))
                  ) : (
                    <p>No completed skills found.</p>
                  )}
                </ul>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <h4>📚 Skills to Learn:</h4>
                <ul>
                  {roadmap.pendingSkills.length > 0 ? (
                    roadmap.pendingSkills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))
                  ) : (
                    <p>You’ve completed all skills for this role!</p>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p style={{ marginTop: "1rem" }}>Fetching roadmap...</p>
          )}
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

export default Dashboard;
