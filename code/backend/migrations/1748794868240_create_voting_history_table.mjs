/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("voting_history", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    voter_id: {
      type: "varchar(255)",
      notNull: true,
      references: "voters(voter_id)",
    },
    election_name: {
      type: "varchar(255)",
      notNull: true,
    },
    voted_at: {
      type: "timestamp with time zone",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
    status: {
      type: "varchar(50)",
      default: "'Voted'",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("voting_history");
}; 