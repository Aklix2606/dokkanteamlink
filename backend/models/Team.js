import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // Array of characters, assuming you have a Character model
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Character'
    }],
    // Reference to the User model
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Team = model('Team', teamSchema);

export default Team;