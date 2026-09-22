### `lib/shared/domain/aggregates.ts`

An aggregate defines a unit of domain behavior that involves multiple entities.
It contains the operations and rules required to coordinate those entities and
complete one domain operation. An aggregate does not represent a domain entity.

#### Current implementation

The following code is the current `Aggregate` implementation.

```ts
export abstract class Aggregate {
    [property: string]: unknown
}
```

#### Example

Use an aggregate when a student and a course must be coordinated to create an
enrollment. The aggregate receives both entities and returns the enrollment
that represents their relationship.

```ts
class EnrollmentAggregate extends Aggregate {
  public enroll(student: Student, course: Course): Enrollment {}
}
```
