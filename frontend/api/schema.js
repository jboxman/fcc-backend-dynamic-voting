import { normalize, schema } from 'normalizr';

export const getPollSchema = () => {
  const user = new schema.Entity('users');
  const answers = new schema.Entity('answers', {createdBy: user});
  const poll = new schema.Entity('polls', {createdBy: user, answers: [answers]});
  return poll;
}

export default function(data) {
  // [] array of polls
  return normalize(data, [getPollSchema()]);
};
