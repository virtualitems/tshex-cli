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

In the following example we model the entities of a course enrollment system.

```ts title="students/domain/students.ts"
import { Entity } from '../../shared/domain/entities.ts'
import { Email } from '../../shared/domain/value-objects.ts'

export class Student extends Entity {
    [property: string]: unknown

    public name: string
    public email: Email

    public constructor(name: string, email: Email) {
        super()

        this.name = name
        this.email = email
    }

    public override equals(other: Entity): boolean {
        if ((other instanceof Student) === false) return false

        const student = other as Student

        return this.email.equals(student.email)
    }

    public override toJSON() {
        return {
            name: this.name,
            email: this.email.value
        }
    }
}
```

```ts title="courses/domain/courses.ts"
import { Entity } from '../../shared/domain/entities.ts'

export class Course extends Entity {
    [property: string]: unknown

    public name: string
    public description: string
    public durationHours: number

    public constructor(name: string, description: string, durationHours: number) {
        super()

        this.name = name
        this.description = description
        this.durationHours = durationHours
    }

    public override equals(other: Entity): boolean {
        if ((other instanceof Course) === false) return false

        const course = other as Course

        return this.name === course.name
    }

    public override toJSON() {
        return {
            name: this.name,
            description: this.description,
            durationHours: this.durationHours
        }
    }
}
```

```ts title="enrollment/domain/inscriptions.ts"
import { Entity } from '../../shared/domain/entities.ts'
import { Course } from '../../courses/domain/courses.ts'
import { Student } from '../../students/domain/students.ts'

export class Inscription extends Entity {
    [property: string]: unknown

    public readonly student: Student
    public readonly course: Course
    public readonly enrolledAt: Date

    public constructor(student: Student, course: Course, enrolledAt: Date) {
        super()

        this.student = student
        this.course = course
        this.enrolledAt = enrolledAt
    }

    public override equals(other: Entity): boolean {
        if ((other instanceof Inscription) === false) return false

        const inscription = other as Inscription
        const hasSameStudent = this.student.equals(inscription.student)
        const hasSameCourse = this.course.equals(inscription.course)

        return hasSameStudent === true && hasSameCourse === true
    }

    public override toJSON() {
        return {
            student: this.student.toJSON(),
            course: this.course.toJSON(),
            enrolledAt: this.enrolledAt
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
