import { normalize, schema } from 'normalizr';

const getPollSchema = () => {
  const user = new schema.Entity('users');
  const answers = new schema.Entity('answers', {createdBy: user});
  const poll = new schema.Entity('polls', {createdBy: user, answers: [answers]});
  return [poll];
}

export default function(result) {
  return normalize(result.data, getPollSchema());
};
