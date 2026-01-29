import React, { useState, useEffect } from 'react';
import { searchProfilesRest } from '../api/restClient';

const SearchView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 6;

    const performSearch = async (searchTerm: string, pageNum = 1) => {
        setLoading(true);
        try {
            const res = await searchProfilesRest(searchTerm, pageNum, LIMIT);
            if (res.success) {
                setResults(res.data || []);
                setTotalPages(res.pagination?.pages || 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            performSearch(query, 1);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (page > 1) {
            performSearch(query, page);
        }
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        performSearch(query, 1);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-24">
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black gradient-text tracking-tight">Discovery Port.</h2>
                <p className="text-gray-500 font-medium">Search across skills, education, and projects instantly.</p>
            </div>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
                <div className="absolute inset-0 bg-brand/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="What are you looking for?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-8 pr-32 py-5 text-xl glass-card rounded-[2rem] border border-gray-200 shadow-2xl focus:ring-4 focus:ring-brand/20 transition-all outline-none"
                    />
                    <button type="submit" className="absolute right-3 top-3 px-8 py-3 btn-primary rounded-full font-bold shadow-lg">
                        Find
                    </button>
                </div>
            </form>

            {loading && (
                <div className="flex justify-center">
                    <div className="animate-pulse text-brand font-black tracking-widest uppercase">Searching the database...</div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(results || []).map((profile, i) => (
                    <div key={profile.id || profile._id || i} className="glass-card p-8 rounded-3xl border-l-[6px] border-brand animate-fade-in hover:-translate-y-1 transition-all">
                        <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                        <p className="text-indigo-500 font-bold text-sm mb-4 uppercase tracking-tighter">{profile.education}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(profile.skills || []).slice(0, 8).map((s: string, j: number) => (
                                <span key={j} className="text-[10px] font-black uppercase px-2 py-1 bg-white border border-gray-100 rounded-md text-gray-500">{s}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {results.length === 0 && query && !loading && (
                <div className="glass-card p-10 text-center rounded-3xl">
                    <p className="text-gray-400 font-bold italic">No matches found for "{query}"</p>
                </div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-10">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-6 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-brand disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-gray-300 border border-gray-100 hover:bg-gray-50'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-6 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-brand disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchView;
