import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getProfileRest,
    addProjectRest, updateProjectRest, deleteProjectRest,
    addWorkRest, updateWorkRest, deleteWorkRest
} from '../api/restClient';

const ManagePortfolio: React.FC = () => {
    const { } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [modalType, setModalType] = useState<'project' | 'work' | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    const fetchProfile = async () => {
        try {
            const res = await getProfileRest();
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const openModal = (type: 'project' | 'work', item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            setFormData(item);
        } else {
            setFormData(type === 'project' ? { title: '', description: '', skillsUsed: '', links: '' } : { company: '', role: '', duration: '', description: '' });
        }
    };

    const closeModal = () => {
        setModalType(null);
        setEditingItem(null);
        setFormData({});
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                skillsUsed: typeof formData.skillsUsed === 'string' ? formData.skillsUsed.split(',').map((s: string) => s.trim()).filter((s: string) => s) : formData.skillsUsed,
                links: typeof formData.links === 'string' ? formData.links.split(',').map((s: string) => s.trim()).filter((s: string) => s) : formData.links
            };
            if (editingItem) await updateProjectRest(editingItem.id, payload);
            else await addProjectRest(payload);
            fetchProfile();
            closeModal();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleWorkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) await updateWorkRest(editingItem.id, formData);
            else await addWorkRest(formData);
            fetchProfile();
            closeModal();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (type: 'project' | 'work', id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            if (type === 'project') await deleteProjectRest(id);
            else await deleteWorkRest(id);
            fetchProfile();
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Fetching your details...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-12">
                <div className="space-y-2">
                    <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">Portfolio Manager<span className="text-brand">.</span></h2>
                    <p className="text-gray-500 text-lg max-w-lg">Manage your projects and work history in one beautiful interface.</p>
                </div>
            </header>

            {/* Projects Section */}
            <section className="space-y-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="w-2 h-6 bg-brand rounded-full"></span>
                            Projects Portfolio
                        </h3>
                    </div>
                    <button onClick={() => openModal('project')} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-brand transition-all active:scale-95 flex items-center gap-2">
                        <span>+ Add Project</span>
                    </button>
                </div>

                {profile?.projects.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-20 text-center rounded-[3rem]">
                        <p className="text-gray-400 font-medium italic">Empty space? Time to showcase your genius.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profile?.projects.map((p: any) => (
                            <div key={p.id} className="group bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-brand/5 transition-all flex flex-col relative border-b-4 hover:border-b-brand">
                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    <button onClick={() => openModal('project', p)} className="p-2.5 bg-white shadow-md rounded-xl text-gray-500 hover:text-brand hover:scale-110 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                    <button onClick={() => handleDelete('project', p.id)} className="p-2.5 bg-white shadow-md rounded-xl text-gray-500 hover:text-red-500 hover:scale-110 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </div>
                                <h4 className="text-xl font-extrabold text-gray-800 mb-3 group-hover:text-brand transition-colors">{p.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{p.description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {p.skillsUsed.slice(0, 4).map((s: string, i: number) => (
                                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-brand/5 group-hover:text-brand transition-colors">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Work Section */}
            <section className="space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                        Work History
                    </h3>
                    <button onClick={() => openModal('work')} className="px-6 py-3 bg-gray-100 text-gray-800 rounded-2xl font-bold hover:bg-indigo-500 hover:text-white transition-all active:scale-95 flex items-center gap-2">
                        <span>+ Add Experience</span>
                    </button>
                </div>
                <div className="space-y-4">
                    { profile?.work.length === 0 ? (
                         <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-20 text-center rounded-[3rem]">
                            <p className="text-gray-400 font-medium italic">No work history found.</p>
                        </div>
                    ) : profile?.work.map((w: any) => (
                        <div key={w.id} className="group bg-white border border-gray-100 p-8 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all uppercase">
                                    {w.company[0]}
                                </div>
                                <div>
                                    <h4 className="text-xl font-extrabold text-gray-800">{w.role}</h4>
                                    <p className="text-gray-500 font-bold text-sm">{w.company} <span className="mx-2 text-gray-200">|</span> <span className="text-gray-400 font-medium">{w.duration}</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal('work', w)} className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.242 19.242L19.242 16.242" /></svg></button>
                                <button onClick={() => handleDelete('work', w.id)} className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal */}
            {modalType && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {editingItem ? 'Edit' : 'New'} {modalType === 'project' ? 'Project' : 'Job'}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>

                            <form onSubmit={modalType === 'project' ? handleProjectSubmit : handleWorkSubmit} className="space-y-6">
                                {modalType === 'project' ? (
                                    <div className="space-y-4">
                                        <input placeholder="Project Name" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-gray-800 font-semibold" value={formData.title} required onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                        <textarea placeholder="Describe the impact..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand focus:bg-white transition-all h-32 text-gray-800 font-semibold resize-none" value={formData.description} required onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Stack (React, CSS)" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand transition-all font-semibold" value={formData.skillsUsed} onChange={e => setFormData({ ...formData, skillsUsed: e.target.value })} />
                                            <input placeholder="Links" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand transition-all font-semibold" value={formData.links} onChange={e => setFormData({ ...formData, links: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Company" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" value={formData.company} required onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                            <input placeholder="Role" className="px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" value={formData.role} required onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                        </div>
                                        <input placeholder="Duration (Jan 22 - Present)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" value={formData.duration} required onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                        <textarea placeholder="Your achievements..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 text-gray-800 font-semibold resize-none" value={formData.description} required onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button type="submit" className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-brand transition-all shadow-lg active:scale-95">
                                        {editingItem ? 'Update Portfolio' : 'Publish to Portfolio'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePortfolio;
