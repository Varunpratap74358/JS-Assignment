import express from 'express';
import User from '../models/User.js';
import { protectRest } from '../middleware/auth.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'OK' });
});

// Complete user profile
// POST /api/profile
router.post('/profile', protectRest, async (req, res) => {
    try {
        const { name, education, skills, links } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name,
                education,
                skills,
                links,
                isProfileComplete: true
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get profile (authenticated or public fallback)
// GET /api/profile
router.get('/profile', async (req, res) => {
    try {
        // We check for token manually if protectRest is not used
        const authHeader = req.headers.authorization;
        let userId;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = (await import('jsonwebtoken')).default.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            } catch (err) {
                console.log(err)
            }
        }

        if (userId) {
            const user = await User.findById(userId);
            if (user) return res.json({ success: true, data: user });
        }

        // Public Fallback
        const publicUser = await User.findOne({ isProfileComplete: true });
        if (!publicUser) return res.status(404).json({ success: false, message: 'No profiles found' });

        res.json({ success: true, data: publicUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- Project CRUD ---

// Add Project
router.post('/projects', protectRest, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.projects.push(req.body);
        await user.save();
        res.status(201).json({ success: true, data: user.projects[user.projects.length - 1] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Project
router.put('/projects/:id', protectRest, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const project = user.projects.id(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        Object.assign(project, req.body);
        await user.save();
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Project
router.delete('/projects/:id', protectRest, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.projects.pull({ _id: req.params.id });
        await user.save();
        res.json({ success: true, message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- Work Experience CRUD ---

// Add Work
router.post('/work', protectRest, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.work.push(req.body);
        await user.save();
        res.status(201).json({ success: true, data: user.work[user.work.length - 1] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Work
router.put('/work/:id', protectRest, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const workItem = user.work.id(req.params.id);
        if (!workItem) return res.status(404).json({ success: false, message: 'Work item not found' });

        Object.assign(workItem, req.body);
        await user.save();
        res.json({ success: true, data: workItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Work
router.delete('/work/:id', protectRest, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.work.pull({ _id: req.params.id });
        await user.save();
        res.json({ success: true, message: 'Work item removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /projects?skill=react&page=1&limit=5
router.get('/projects', async (req, res) => {
    try {
        const { skill, page = 1, limit = 6 } = req.query;
        const query = { isProfileComplete: true };

        const users = await User.find(query);
        let allProjects = [];
        users.forEach(u => {
            if (u.projects) allProjects.push(...u.projects);
        });

        // Filter projects by skill if necessary
        if (skill) {
            allProjects = allProjects.filter(p =>
                p.skillsUsed && p.skillsUsed.some(s => s.toLowerCase().includes(skill.toLowerCase()))
            );
        }

        // Sort by createdAt descending (Newest first)
        allProjects.sort((a, b) => new Date(b.createdAt || b._id.getTimestamp()).getTime() - new Date(a.createdAt || a._id.getTimestamp()).getTime());

        const total = allProjects.length;
        const startIndex = (page - 1) * limit;
        const paginatedProjects = allProjects.slice(startIndex, startIndex + Number(limit));

        res.json({
            success: true,
            data: paginatedProjects,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// GET /search?q=backend&page=1&limit=6
router.get('/search', async (req, res) => {
    try {
        const { q, page = 1, limit = 6 } = req.query;

        let query = { isProfileComplete: true };
        if (q && q.trim() !== '') {
            const searchRegex = new RegExp(q, 'i');
            query = {
                isProfileComplete: true,
                $or: [
                    { name: searchRegex },
                    { email: searchRegex },
                    { education: searchRegex },
                    { skills: searchRegex }
                ]
            };
        }

        const total = await User.countDocuments(query);
        const results = await User.find(query)
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            success: true,
            data: results,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
