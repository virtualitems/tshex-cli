### Entities

An entity is responsible for representing a domain concept with its own
identity. Two entity instances refer to the same conceptual element when they
share that identity, even if other attributes change over time.

The generated template provides `Entity` as a base class for this pattern.

#### Base Class

`Entity` requires one operation and already provides two helper methods.

```ts title="shared/domain/entities.ts"
export abstract class Entity {
    [property: string]: unknown

    public abstract equals(other: Entity): boolean

    public toJSON(): Record<string, unknown> {
        return this
    }

    public toString(): string {
        return this.constructor.name
    }
}
```

Every concrete entity must implement `equals()`. Override `toJSON()` to control
the plain representation returned when the entity is serialized.

#### Usage

In the following example we model the entities of a course enrollment context.

```ts title="enrollment/domain/students.ts"
import { Entity } from '../shared/domain/entities.ts'
import { Email } from '../shared/domain/value-objects.ts'

export class Student extends Entity {
    [property: string]: unknown

    constructor(
        public name: string,
        public email: Email
    ) {
        super()
    }

    public equals(other: Student): boolean {
        return this.email.equals(other.email)
    }

    public override toJSON() {
        return {
            name: this.name,
            email: this.email.value
        }
    }
}
```

```ts title="enrollment/domain/courses.ts"
import { Entity } from '../shared/domain/entities.ts'

export class Course extends Entity {
    [property: string]: unknown

    constructor(
        public name: string,
        public description: string,
        public duration_hours: number
    ) {
        super()
    }

    public equals(other: Course): boolean {
        return this.name === other.name
    }

    public override toJSON() {
        return {
            name: this.name,
            description: this.description,
            duration_hours: this.duration_hours
        }
    }
}
```

```ts title="enrollment/domain/inscriptions.ts"
import { Entity } from '../shared/domain/entities.ts'
import { Course } from './courses.ts'
import { Student } from './students.ts'

export class Inscription extends Entity {
    [property: string]: unknown

    constructor(
        public readonly student: Student,
        public readonly course: Course,
        public readonly enrolled_at: Date
    ) {
        super()
    }

    public equals(other: Inscription): boolean {
        return this.student.equals(other.student) && this.course.equals(other.course)
    }

    public override toJSON() {
        return {
            student: this.student.toJSON(),
            course: this.course.toJSON(),
            enrolled_at: this.enrolled_at
        }
    }
}
```

#### Equality Rules

The most important design decision in an entity is the identity comparison.

`Student` uses `Email` as the identity because two students with the same
address represent the same person. `equals()` delegates to `Email.equals()` so
the comparison rule lives in the value object. `Course` uses `name`.
`Inscription` combines the student and course identities — two inscriptions are
the same when both the student and the course match.

> **Hint**
> Keep `equals()` explicit and small. If the comparison starts depending on many
> mutable fields, the model may be closer to a value object than to an entity.

#### Next Step

When the identity of a concept is determined entirely by its value, use a value
object instead. The generated abstraction is documented in `value-objects.md`.
