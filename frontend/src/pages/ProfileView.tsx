import React, { useEffect, useState } from 'react';
import { getProfileRest } from '../api/restClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Profile {
    name: string;
    email: string;
    education: string;
    skills: string[];
    isProfileComplete: boolean;
    links: {
        github: string;
        linkedin: string;
        portfolio: string;
    };
    work: Array<{
        company: string;
        role: string;
        duration: string;
        description: string;
    }>;
}

const ProfileView: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        getProfileRest()
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
        </div>
    );

    if (!profile) return <div className="text-center p-20 glass-card rounded-2xl">No profile found.</div>;

    return (
        <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
            <header className="glass-card p-10 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-5xl font-black tracking-tight mb-2 gradient-text">{profile.name}</h2>
                            <p className="text-gray-500 font-medium text-lg">{profile.email}</p>
                        </div>
                        {user && (
                            <Link to="/edit-profile" className="px-6 py-2 bg-white/50 border border-indigo-100 rounded-full text-sm font-bold text-brand hover:bg-brand hover:text-white transition-all shadow-sm">
                                Edit Profile
                            </Link>
                        )}
                    </div>
                    <div className="flex space-x-6 text-sm font-bold uppercase tracking-widest">
                        <a href={profile.links.github} target="_blank" className="text-gray-400 hover:text-brand transition-colors">GitHub</a>
                        <a href={profile.links.linkedin} target="_blank" className="text-gray-400 hover:text-brand transition-colors">LinkedIn</a>
                        <a href={profile.links.portfolio} target="_blank" className="text-gray-400 hover:text-brand transition-colors">Portfolio</a>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <section className="col-span-1 space-y-8">
                    <div className="glass-card p-8 rounded-3xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 border-b pb-4">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold shadow-sm border border-gray-50">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-3xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-4">Education</h3>
                        <p className="text-gray-700 font-medium leading-relaxed">{profile.education}</p>
                    </div>
                </section>

                <section className="md:col-span-2 glass-card p-8 rounded-3xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 border-b pb-4">Experience</h3>
                    <div className="space-y-10">
                        { profile.work.length > 0 ? profile.work.map((job: any, i: number) => (
                            <div key={i} className="relative pl-6 border-l-2 border-indigo-50">
                                <div className="absolute w-3 h-3 bg-brand rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">{job.role}</h4>
                                <p className="text-brand font-bold text-sm mb-4">{job.company} • {job.duration}</p>
                                <p className="text-gray-600 leading-relaxed">{job.description}</p>
                            </div>
                        )) : <Link to={'/manage-portfolio'} className="text-brand font-bold text-sm mb-4 border border-brand rounded-full px-6 py-2 hover:bg-brand hover:text-white transition-all">Add Experience</Link>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfileView;
