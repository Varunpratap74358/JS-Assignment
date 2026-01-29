import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfileRest } from '../api/restClient';

const CompleteProfile: React.FC = () => {
    const { user, loading: authLoading, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        education: '',
        skills: '',
        github: '',
        linkedin: '',
        portfolio: ''
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (!authLoading) {
            if (!user) navigate('/login');
            else if (user.isProfileComplete) navigate('/');
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfileRest({
                name: formData.name,
                education: formData.education,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                links: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    portfolio: formData.portfolio
                }
            });
            await checkAuth(); // Refresh user state
            navigate('/');
        } catch (err: any) {
            alert(err.message || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 animate-fade-in">
            <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-4xl font-black mb-2 gradient-text">Almost there!</h2>
                <p className="text-gray-500 mb-8 font-medium">Please complete your profile to showcase your awesome skills.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-brand">Basic Info</h3>
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Education (e.g. B.Tech in CS)"
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-brand/10 transition-all outline-none h-24"
                            value={formData.education}
                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-brand">Tech Stack</h3>
                        <input
                            type="text"
                            placeholder="Skills (e.g. React, Node.js, Python)"
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-brand">Public Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="url"
                                placeholder="GitHub URL"
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            />
                            <input
                                type="url"
                                placeholder="LinkedIn URL"
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                        </div>
                        <input
                            type="url"
                            placeholder="Portfolio/Website URL"
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 btn-primary rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                    >
                        {loading ? 'Saving your profile...' : 'Complete Onboarding'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
