### `lib/shared/application/data/managers.ts`

This module defines the data managers that work directly with a data source.
Data managers contain the operations that read or modify data, including
complex queries that combine, filter, or aggregate records for a data context.
Repositories use data managers for source access and translate the returned
records into domain entities.

#### Current implementation

The following code is the current module implementation.

```ts
export interface Executable<ResultShape extends unknown = boolean> {
    execute(sql: string, params?: unknown[]): ResultShape
}

export interface Queryable<ResultShape extends unknown = null> {
    query(sql: string, params?: unknown[]): ResultShape
}

export abstract class DataManager {
    [property: string]: unknown
}

export abstract class DatasetManager<DataShape = Record<string, unknown>>
    extends DataManager {
    [property: string]: unknown

    public abstract union(other: Array<DataShape>): Array<DataShape>

    public abstract intersection(other: Array<DataShape>): Array<DataShape>

    public abstract difference(other: Array<DataShape>): Array<DataShape>

    public abstract symmetricDifference(other: Array<DataShape>): Array<DataShape>

    public abstract complement(other: Array<DataShape>): Array<DataShape>
}
```

#### Example

A user manager can define a complex query that combines enrollment records and
groups them by user. A concrete implementation defines how the query accesses
and handles the resulting records.

```ts
class UsersManager extends DataManager implements Queryable<void> {
  public query(
    sql: string,
    params?: unknown[]
  ): void {}

  public findEnrollmentSummaryForCourse(
    courseId: number
  ): void {
    const sql = `
      SELECT users.id, COUNT(enrollments.id) AS enrollment_count
      FROM users
      INNER JOIN enrollments ON enrollments.user_id = users.id
      WHERE enrollments.course_id = ?
      GROUP BY users.id
    `
    const params = [courseId]

    this.query(sql, params)
  }
}
```
