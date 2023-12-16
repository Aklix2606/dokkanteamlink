import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
   name: String,
   members: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
});

const Team = model('Team', teamSchema);

export default Team;