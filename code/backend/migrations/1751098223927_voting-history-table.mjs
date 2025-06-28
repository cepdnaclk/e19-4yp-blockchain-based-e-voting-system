/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable('voting_history', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    voter_id: {
      type: 'varchar(255)',
      notNull: true,
      references: '"voters"(voter_id)',
      onDelete: 'CASCADE',
    },
    election_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    voted_at: {
      type: 'timestamp with time zone',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
    status: {
      type: 'varchar(50)',
      default: 'Voted',
      notNull: true,
    },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropTable('voting_history');
};

