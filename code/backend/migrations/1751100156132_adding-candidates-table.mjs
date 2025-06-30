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
  pgm.createTable("candidates", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    birthday: {
      type: "date",
      notNull: true,
    },
    address: {
      type: "text",
      notNull: true,
    },
    mobile_number: {
      type: "varchar(20)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
    },
    photo: {
      type: "varchar(500)",
      default: null,
    },
    party_id: {
      type: "integer",
      references: "parties",
      onDelete: "SET NULL",
    },
    vote_number: {
      type: "varchar(20)",
      notNull: true,
    },
    election_id: {
      type: "integer",
      references: "election",
      onDelete: "CASCADE",
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "active",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
  });

  // Add unique constraints
  pgm.addConstraint("candidates", "candidates_email_unique", {
    unique: ["email"],
  });

  pgm.addConstraint("candidates", "candidates_vote_number_unique", {
    unique: ["vote_number", "election_id"],
  });

  pgm.addConstraint("candidates", "candidates_mobile_unique", {
    unique: ["mobile_number"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("candidates", {
    ifExists: true,
    cascade: true,
  });
}; 