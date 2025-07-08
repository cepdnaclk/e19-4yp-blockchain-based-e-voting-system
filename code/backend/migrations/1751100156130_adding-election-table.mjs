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
  pgm.createTable("election", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    start_date_time: {
      type: "timestamp with time zone",
      notNull: true,
    },
    end_date_time: {
      type: "timestamp with time zone",
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
  pgm.dropTable("election", {
    ifExists: true,
    cascade: true,
  });
};
