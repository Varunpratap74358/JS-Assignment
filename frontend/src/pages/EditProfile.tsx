import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProfileRest, updateProfileRest } from '../api/restClient';


const EditProfile: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        education: '',
        skills: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');

        getProfileRest().then(res => {
            if (res.data) {
                setFormData({
                    name: res.data.name,
                    email: res.data.email,
                    education: res.data.education,
                    skills: res.data.skills.join(', ')
                });
            }
        }).catch(err => console.error(err));
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await updateProfileRest({
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            });
            alert('Profile updated!');
            navigate('/');
        } catch (err: any) {
            alert(err.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (authLoading) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="glass-card p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-8 gradient-text">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 h-24"
                            value={formData.education}
                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex-1 py-3 btn-primary rounded-xl font-bold"
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
