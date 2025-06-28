/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable('votes', {
    votes_id: {
      type: 'serial',
      primaryKey: true,
    },
    voter_id: {
      type: 'varchar(255)',
      notNull: true,
      references: '"voters"(voter_id)',
      onDelete: 'CASCADE',
    },
    candidate_id: {
      type: 'integer',
      notNull: true,
      references: '"candidates"(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp with time zone',
      default: pgm.func('current_timestamp'),
    },
  });

  // Add unique constraint to ensure one vote per voter
  pgm.addConstraint('votes', 'unique_voter_vote', {
    unique: ['voter_id'],
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropTable('votes');
};
