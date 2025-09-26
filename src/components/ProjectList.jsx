import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjects } from "../store/projectsSlice";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function ProjectList({ onSelect }) {
  const projects = useSelector(state => state.projects.projects);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      const userProjects = data
        ? Object.values(data).filter(
            p => p.members && Object.keys(p.members).includes(user.email)
          )
        : [];
      dispatch(setProjects(userProjects));
    });
    return () => unsubscribe();
  }, [dispatch, user.email]);

  // Filter projects by search
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{width:'100%'}}>
      {/* Search Bar */}
      <div style={{display:'flex', justifyContent:'center', marginBottom:'2rem'}}>
        <input
          type="text"
          className="input"
          style={{maxWidth:'400px'}}
          placeholder="Enter project name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* No Projects */}
      {filteredProjects.length === 0 ? (
        <div style={{textAlign:'center', padding:'3rem 0'}}>
          <h3 style={{fontSize:'1.25rem', fontWeight:600, color:'#6b7280', marginBottom:'0.5rem'}}>No Projects Found</h3>
          <p style={{color:'#9ca3af'}}>Try a different search or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredProjects.map(project => (
            <div key={project.id} className="card" style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
              <div>
                <h3 style={{fontSize:'1.25rem', fontWeight:700, color:'#22223b', marginBottom:'0.5rem'}}>{project.name}</h3>
                <p style={{color:'#6b7280', marginBottom:'1rem', minHeight:'2.5em'}}>{project.description}</p>
                <div style={{display:'flex', alignItems:'center', color:'#9ca3af', fontSize:'0.95em', marginBottom:'0.5em'}}>
                  <svg style={{width:'1em',height:'1em',marginRight:'0.25em'}} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  {project.members ? Object.keys(project.members).length : 1} member{project.members && Object.keys(project.members).length !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{display:'flex', gap:'0.5rem', marginTop:'1rem'}}>
                <button className="btn" onClick={() => onSelect && onSelect(project)}>View</button>
                <button className="btn btn-secondary" disabled>Edit</button>
                <button className="btn" style={{background:'#ef4444', color:'#fff', border:'1px solid #ef4444'}} disabled>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
