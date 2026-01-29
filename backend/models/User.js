import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    links: [String],
    skillsUsed: [String]
});

const workSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile Fields
    name: { type: String, required: true },
    education: String,
    skills: [String],
    projects: [projectSchema],
    work: [workSchema],
    links: {
        github: String,
        linkedin: String,
        portfolio: String
    },
    isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

// Index for search functionality
userSchema.index({
    name: 'text',
    education: 'text',
    'projects.title': 'text',
    'projects.description': 'text',
    skills: 'text'
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
