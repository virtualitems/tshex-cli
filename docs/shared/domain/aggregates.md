### Aggregates

An aggregate groups multiple entities into one logical domain unit.
It is useful when the behavior of a concept depends on the collaboration of
several entities working together.

The generated template provides `Aggregate` as a semantic base class.

#### Base Class

`Aggregate` is an abstract class with no concrete methods.

```ts title="shared/domain/aggregates.ts"
export abstract class Aggregate {
    [property: string]: unknown
}
```

The class is intentionally empty. Its role is to provide the semantic base for
an aggregate whose concrete implementation gathers the involved entities and
exposes operations that span more than one of them.

#### Usage

In the following example we model an enrollment aggregate that groups a
student and a course to produce an inscription with the current date.

```ts title="enrollment/domain/inscriptions.ts"
import { Aggregate } from '../shared/domain/aggregates.ts'
import { Course } from './courses.ts'
import { Student } from './students.ts'
import { Inscription } from './inscriptions.ts'

export class InscriptionAggregate extends Aggregate {
    [property: string]: unknown

    public static enroll(student: Student, course: Course): Inscription {
        const currentDate = new Date()
        return new Inscription(student, course, currentDate)
    }
}
```

`InscriptionAggregate` centralizes the rule for creating an inscription. The
enrollment date is set automatically, so callers do not pass it directly and
the rule stays in one place.

#### Responsibility Boundary

An aggregate should own rules that require several internal parts to work
together.

Examples include:

1. checking whether the aggregate can change status;
2. keeping related entities in a consistent state;
3. exposing operations that depend on the collaboration of those entities.

The generated `Aggregate` base class provides the semantic place where those
rules belong. The concrete aggregate defines and coordinates the rules that
keep the domain unit consistent.

> **Warning**
> Extend `Aggregate` when the concept represents one domain unit composed of
> several related parts and shared rules.

#### Next Step

Aggregates usually collaborate with entities and value objects. The base entity
behavior is documented in `entities.md`.
