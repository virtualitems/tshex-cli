### `lib/shared/application/services.ts`

An application service groups operations that belong to the same application
boundary. Consumers use the service as one operational identity when they need
that group of related operations.

#### Current implementation

The following code is the current `Service` implementation.

```ts
export abstract class Service {
    [property: string]: unknown
}
```

The base service declares no methods. Each concrete service defines the methods
that execute the use-case operations within its operational boundary.

#### Example

The following service groups the CRUD operations for students

```ts
abstract class StudentsService extends Service {

  public abstract create(student: Student): Student

  public abstract list(): Student[]

  public abstract update(student: Student, data: Partial<Student>): Student

  public abstract delete(student: Student): Student

}
```
