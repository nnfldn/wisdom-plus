<?php

namespace App\Database;

use Illuminate\Database\PostgresConnection;

/**
 * Custom PostgreSQL connection for PgBouncer (transaction pooling mode).
 *
 * PgBouncer in transaction mode doesn't support server-side prepared statements.
 * Using PDO::ATTR_EMULATE_PREPARES fixes this, but breaks boolean handling
 * because Laravel's parent prepareBindings() converts bool to int (1/0),
 * then PDO inlines the integer into SQL, causing PostgreSQL to reject
 * "boolean = integer" comparisons.
 *
 * This class intercepts bind values BEFORE the parent conversion and converts
 * PHP booleans to PostgreSQL-compatible string literals ('true'/'false').
 */
class PgBouncerConnection extends PostgresConnection
{
    /**
     * Prepare the query bindings for execution.
     *
     * We must convert booleans BEFORE calling parent::prepareBindings()
     * because the parent converts bool → int, which PostgreSQL rejects
     * when compared against boolean columns.
     *
     * @param  array  $bindings
     * @return array
     */
    public function prepareBindings(array $bindings)
    {
        // Convert booleans to PostgreSQL string literals BEFORE parent
        // can convert them to integers (0/1).
        foreach ($bindings as $key => $value) {
            if (is_bool($value)) {
                $bindings[$key] = $value ? 'true' : 'false';
            }
        }

        // Now call parent - it won't find any booleans to convert since
        // they're already strings. DateTimeInterface handling still works.
        return parent::prepareBindings($bindings);
    }
}
