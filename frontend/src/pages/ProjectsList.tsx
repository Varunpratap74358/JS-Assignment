import React, { useEffect, useState } from 'react';
import { getProjectsRest, deleteProjectRest } from '../api/restClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

interface Project {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    links: string[];
    skillsUsed: string[];
}

const ProjectsList: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [skill, setSkill] = useState('');
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 6;

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const fetchProjects = (skillFilter = '', pageNum = 1) => {
        setLoading(true);
        getProjectsRest(skillFilter, pageNum, LIMIT)
            .then(res => {
                if (res.success) {
                    setProjects(res.data || []);
                    setTotalPages(res.pagination?.pages || 1);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchProjects(skill, 1);
        }, 300);

        return () => clearTimeout(timer);
    }, [skill]);

    useEffect(() => {
        if (page > 1) {
            fetchProjects(skill, page);
        }
    }, [page]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProjects(skill, 1);
    };

    const handleDeleteClick = (id: string) => {
        setProjectToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;
        try {
            await deleteProjectRest(projectToDelete);
            fetchProjects(skill, page);
            setIsDeleteModalOpen(false);
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-4xl font-black gradient-text">Projects.</h2>
                <form onSubmit={handleFilter} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Filter by skill (e.g. React)"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="flex-1 md:w-64 px-4 py-2 bg-white rounded-full border border-gray-200 focus:ring-2 focus:ring-brand shadow-sm transition-all"
                    />
                    <button type="submit" className="px-6 py-2 btn-primary rounded-full font-bold shadow-lg">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(projects || []).map((project: Project) => {
                        const isOwner = user && (project.ownerId === user._id || project.ownerId === (user as any).id);
                        return (
                            <div key={project.id || (project as any)._id} className="glass-card p-8 rounded-[2rem] hover:-translate-y-1 transition-all group relative">
                                {isOwner && (
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => navigate('/manage-portfolio')}
                                            className="p-2.5 bg-white shadow-md rounded-xl text-gray-500 hover:text-brand transition-all hover:scale-110"
                                            title="Edit in Portfolio"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(project.id || (project as any)._id)}
                                            className="p-2.5 bg-white shadow-md rounded-xl text-gray-500 hover:text-red-500 transition-all hover:scale-110"
                                            title="Delete Project"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors line-clamp-2 pr-12 flex items-center gap-2">{project?.title}{project?.ownerId === user?._id && <span className='border rounded-md bg-red-100 px-2 py-1 text-red-500 text-sm'>{'You'}</span>} </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {(project.skillsUsed || []).map((s: string, i: number) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider font-black px-3 py-1 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-brand transition-all">
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                                    {(project.links || []).map((link: string, i: number) => (
                                        <a
                                            key={i}
                                            href={link}
                                            target="_blank"
                                            className="text-sm font-bold text-indigo-500 hover:text-brand relative"
                                        >
                                            View Project →
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {projects.length === 0 && !loading && (
                <div className="glass-card p-20 text-center rounded-3xl text-gray-400 font-bold italic">
                    No projects found matching that skill.
                </div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-10">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-brand disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        Prev
                    </button>
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-brand disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Custom Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Remove Project?"
                message="This will permanently delete this project from your portfolio. Are you sure?"
                confirmText="Yes, Delete"
                cancelText="Keep it"
                isDanger={true}
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default ProjectsList;
