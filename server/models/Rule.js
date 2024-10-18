import mongoose from 'mongoose';

// Define the rule schema
const ruleSchema = new mongoose.Schema({
    ruleName: {
        type: String,
        required: true,
        unique: true,  // Ensure that the rule name is unique
        trim: true
    },
    ruleString: {
        type: String,
        required: true
    },
    ruleAST: {
        type: Object,  // Store the AST as a JSON object
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // Auto-generate the creation date
    }
});

// Create and export the Rule model
const Rule = mongoose.model('Rule', ruleSchema);

export default Rule;
