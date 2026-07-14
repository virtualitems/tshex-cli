# `tshex-cli`

`tshex-cli` crea la estructura base de una librería organizada por contextos. La estructura reúne contratos compartidos, conceptos de dominio, casos de uso y adaptadores en directorios con responsabilidades definidas.

En esta guía construiremos una librería llamada `core` con un contexto llamado `users`. El recorrido comienza con el CLI y continúa con la implementación de cada pieza generada.

Los ejemplos de esta guía son intencionalmente simples. Buscan mostrar la responsabilidad de cada pieza, no cubrir infraestructura real ni casos de producción.

## Primeros pasos

### Instalación

Instala el paquete dentro de tu proyecto Node.js:

```bash
npm install tshex-cli
```

El paquete registra el ejecutable `tshex`. Puedes invocarlo con `npx` desde el directorio del proyecto.

### Ayuda

Consulta los comandos y opciones disponibles con:

```bash
npx tshex --help
```

### Crear una librería

La opción `--lib` recibe el nombre del directorio raíz de la librería:

```bash
npx tshex --lib core
```

En este ejemplo, `core` será el espacio que contendrá el código compartido, los contextos y la implementación principal de la librería.

### Crear un contexto

La opción `--ctx` recibe el nombre del contexto:

```bash
npx tshex --ctx users
```

Un contexto agrupa las reglas y operaciones de una capacidad de la aplicación. `users`, `sales`, `billing` e `inventory` son ejemplos de contextos.

### Crear la librería y el primer contexto

Puedes generar ambas piezas en una sola ejecución:

```bash
npx tshex --lib core --ctx users
```

El comando crea esta estructura:

```text
core/
├── index.d.ts
├── main.ts
├── shared/
│   ├── application/
│   │   ├── data-sources.ts
│   │   ├── events.ts
│   │   ├── http.ts
│   │   ├── loggers.ts
│   │   ├── services.ts
│   │   └── validations.ts
│   └── domain/
│       ├── aggregates.ts
│       ├── entities.ts
│       ├── errors.ts
│       └── value-objects.ts
└── users/
    ├── adapters/
    ├── application/
    ├── domain/
    ├── example-ports.ts
    └── index.ts
```

### Elegir el directorio de destino

La opción `--dir` indica el directorio desde el cual se crea la estructura:

```bash
npx tshex --dir ./src --lib core --ctx users
```

La librería del ejemplo queda ubicada en `src/core`.

Para agregar un contexto a una librería existente, utiliza la librería como directorio de destino:

```bash
npx tshex --dir ./core --ctx billing
```

El contexto queda ubicado en `core/billing`.

### Crear un contexto para React

La opción `--react` crea un contexto con directorios orientados a una aplicación React:

```bash
npx tshex --ctx users --react
```

También puedes usar su forma corta:

```bash
npx tshex --ctx users -R
```

La estructura del contexto contiene adaptadores para API, hooks y schemas, junto con aplicación, dominio y recursos de idioma:

```text
users/
├── adapters/
│   ├── api/
│   ├── hooks/
│   └── schemas/
├── application/
├── domain/
└── languages/
```

## Estructura de la librería

La librería se divide en una raíz, un directorio compartido y uno o más contextos. Cada nivel tiene una función dentro de la implementación.

### Raíz

La raíz contiene `index.d.ts` y `main.ts`.

`index.d.ts` declara tipos disponibles para la librería. `main.ts` contiene la implementación principal y las piezas públicas que pertenecen directamente a esa entrada.

### Código compartido

El directorio `shared` contiene código utilizado por varios contextos. Aquí se ubican abstracciones, interfaces, contratos, tipos base e implementaciones puntuales con significado común dentro de la librería.

```text
shared/
├── domain/
└── application/
```

`shared/domain` contiene bases para modelar conceptos del negocio. `shared/application` contiene contratos para coordinar casos de uso, fuentes de datos, eventos, validaciones, respuestas HTTP y logs.

### Contextos

Un contexto representa una capacidad de la aplicación y agrupa su vocabulario, sus reglas y sus operaciones.

```text
users/
billing/
sales/
inventory/
```

La separación por contextos organiza una aplicación alrededor de sus capacidades. Varios contextos pueden formar parte del mismo proyecto, del mismo proceso y de la misma fuente de datos. Cada contexto conserva sus propias reglas mientras comparte las abstracciones generales de `shared`.

Cada contexto generado contiene tres directorios:

```text
domain/
application/
adapters/
```

#### `domain`

Contiene las capacidades del contexto. Una capacidad reúne conocimiento del negocio que puede utilizarse en distintos procesos: validar un correo, identificar una entidad, calcular un precio, cambiar el estado de una orden o agrupar las partes de una venta.

Los objetos de valor, las entidades y los agregados materializan estas capacidades mediante datos, reglas y comportamiento.

#### `application`

Contiene la aplicación de las capacidades del dominio en procesos que cumplen propósitos del sistema.

Un servicio de aplicación combina capacidades para completar una operación. Por ejemplo, el proceso de registrar un usuario puede validar el correo, construir la entidad, guardar sus datos, publicar un evento y registrar el resultado.

#### Raíz del contexto

La raíz contiene `index.ts` y otros archivos `.ts` destinados a los puertos del contexto.

Un puerto describe una forma de comunicación entre el contexto y otro sistema. Define los datos recibidos, los datos entregados y la operación disponible en esa frontera.

#### `adapters`

Contiene las integraciones que comunican el contexto con otros sistemas. Un adaptador importa un puerto, implementa la comunicación definida por ese puerto y conecta la entrada o salida externa con un proceso de aplicación.

Un adaptador puede integrar un controlador HTTP, un consumidor de mensajes, un SDK, un driver, un cliente remoto, un event bus o un proveedor de logs.

### Arquitectura por capas

La estructura se organiza en tres niveles: capacidades, procesos y comunicación.

```text
Sistema externo
      ↕
Puerto + adaptador
      ↓
  Aplicación
      ↓
    Dominio
```

El dominio ocupa la capa interior y reúne las capacidades del contexto.

La aplicación ocupa la capa intermedia y utiliza esas capacidades para construir procesos que cumplen propósitos del sistema.

Los puertos y adaptadores ocupan la capa exterior y resuelven la comunicación entre sistemas.

Un puerto declara la comunicación disponible en la frontera del contexto: qué datos entran, qué datos salen y qué operación se expone. Los puertos se declaran en `index.ts` o en módulos `.ts` ubicados en la raíz del contexto.

Un adaptador implementa esa comunicación. Importa el puerto correspondiente, traduce la entrada o salida externa al formato del proceso de aplicación y delega el trabajo al servicio de aplicación.

La dirección de imports sigue este recorrido:

```text
adapter → port
adapter → application
application → domain
```

Por ejemplo, `users/index.ts` declara el puerto `CreateUserPort`. `users/adapters/create-user-adapter.ts` importa ese puerto y conecta una solicitud externa con `users/application/create-user-service.ts`. El servicio aplica las capacidades de `Email` y `User` para completar el registro.

> **Consejo:** empieza la implementación dentro del contexto y mueve una pieza a `shared` cuando su significado y su uso pertenecen a varios contextos.

## Tipos de la librería

### `index.d.ts`

El archivo declara el tipo genérico:

```ts
type Generic<T = unknown> = Record<string, T>
```

`Generic<T>` representa un objeto con claves de tipo `string` y valores de un tipo común.

```ts
const filters: Generic<string> = {
    status: 'active'
}
```

Cuando el tipo se omite, los valores utilizan `unknown`:

```ts
const metadata: Generic = {
    retries: 2
}
```

Los contratos de fuentes de datos utilizan esta forma para representar objetos planos cuya estructura concreta será definida por cada implementación.

## Dominio compartido

El dominio comienza con conceptos pequeños y avanza hacia estructuras que reúnen varias identidades. Comenzaremos con los objetos de valor, continuaremos con las entidades y terminaremos con los agregados.

### Objetos de valor

Un objeto de valor representa un concepto que posee reglas, semántica o comportamiento propios. Su identidad está determinada por su valor.

El archivo `shared/domain/value-objects.ts` genera la clase base `ValueObject<T>` y las implementaciones `Email` y `NullableBoolean`.

#### Crear un correo electrónico

`Email` convierte un texto en un concepto de dominio con validación y operaciones propias:

```ts
import { Email } from './core/shared/domain/value-objects.js'

const email = Email.from('alejandro@example.com')

email.value
email.domain
```

La creación se realiza con `Email.from()`. Este método ejecuta `Email.isValid()` antes de construir la instancia.

```ts
Email.isValid('alejandro@example.com')
```

Toda creación pasa por la misma regla de validez:

```text
valor recibido
    ↓
isValid(value)
    ↓
from(value)
    ↓
instancia válida
```

Cuando la validación falla, `from()` lanza `ValueError`.

> **Consejo:** utiliza un tipo nativo cuando expresa completamente el dato. Crea un objeto de valor cuando el concepto aporta reglas u operaciones propias. Un identificador textual puede representarse con `string`; un correo electrónico se beneficia de `Email` porque incorpora validación y comportamiento.

#### Representar un estado booleano nullable

`NullableBoolean` modela los valores `true`, `false` y `null`:

```ts
import { NullableBoolean } from './core/shared/domain/value-objects.js'

const status = NullableBoolean.from(null)

status.value
status.isIndeterminate()
```

El método `isIndeterminate()` expresa una operación propia del concepto y permite consultar el estado `null` con una intención explícita.

#### Implementar un objeto de valor

Crearemos un porcentaje de descuento. El ejemplo solo tiene una regla y una operación para que el foco quede en la idea del objeto de valor.

**`sales/domain/discount-percentage.ts`**

```ts
import { ValueError } from '../../shared/domain/errors.js'
import { ValueObject } from '../../shared/domain/value-objects.js'

export class DiscountPercentage extends ValueObject<number> {
    public override readonly value: number

    protected constructor(value: number) {
        super()
        this.value = value
    }

    public override equals(
        other: DiscountPercentage | null | undefined
    ): boolean {
        return other instanceof DiscountPercentage &&
            this.value === other.value
    }

    public applyTo(amount: number): number {
        return amount - amount * (this.value / 100)
    }

    public static override isValid(value: unknown): boolean {
        return typeof value === 'number' &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
    }

    public static from(value: number): DiscountPercentage {
        if (this.isValid(value) === false) {
            throw new ValueError(String(value), this.name)
        }

        return new this(value)
    }
}
```

Ahora podemos crear y utilizar el concepto:

```ts
const discount = DiscountPercentage.from(15)
const finalPrice = discount.applyTo(100)
```

`isValid()` concentra la regla. `from()` crea la instancia válida. `applyTo()` agrega el comportamiento propio del concepto.

### Entidades

Una entidad representa un concepto con identidad propia. Dos instancias representan el mismo elemento cuando comparten esa identidad.

El archivo `shared/domain/entities.ts` genera la clase base `Entity`. Cada entidad implementa `equals()` y `toJSON()`.

Crearemos una entidad para el contexto `users`.

**`users/domain/user.ts`**

```ts
import { Entity } from '../../shared/domain/entities.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

export class User extends Entity {
    public constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly active: NullableBoolean
    ) {
        super()
    }

    public override equals(other: Entity): boolean {
        return other instanceof User && other.id === this.id
    }

    public override toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            email: this.email.value,
            active: this.active.value
        }
    }
}
```

La propiedad `id` define la identidad. El método `equals()` compara entidades a partir de esa propiedad.

`toJSON()` produce una representación plana de la entidad:

```ts
const user = new User(
    'user-1',
    Email.from('alejandro@example.com'),
    NullableBoolean.from(true)
)

const json = user.toJSON()
```

El resultado utiliza los valores internos de `Email` y `NullableBoolean`.

### Agregados

Un agregado reúne varias entidades en una unidad lógica. Las operaciones del agregado dependen de todas las identidades que lo componen.

Un equipo puede reunir a una persona líder y a varias integrantes:

```text
Team
├── leader
└── members
```

Cada elemento conserva su propia identidad dentro de la unidad.

**`users/domain/team.ts`**

```ts
import { Aggregate } from '../../shared/domain/aggregates.js'
import type { User } from './user.js'

export class Team extends Aggregate {
    public constructor(
        public readonly leader: User,
        public readonly members: User[]
    ) {
        super()
    }

    public size(): number {
        return this.members.length + 1
    }
}
```

`Team` agrupa varias entidades `User` en una sola unidad lógica. El método `size()` opera sobre ese conjunto.

### Errores del dominio

El archivo `shared/domain/errors.ts` genera `ValueError`. Este error representa un valor recibido que incumple la regla esperada.

```ts
import { ValueError } from '../../shared/domain/errors.js'

if (quantity <= 0) {
    throw new ValueError(String(quantity), 'PositiveQuantity')
}
```

Al estar en `shared`, `ValueError` puede utilizarse desde cualquier contexto y desde cualquier concepto del dominio que valide valores.

## Aplicación compartida

La capa de aplicación coordina los casos de uso. Sus contratos conectan el dominio con validaciones, fuentes de datos, respuestas HTTP, logs y eventos.

### Validaciones

El archivo `shared/application/validations.ts` declara el contrato `Validatable`:

```ts
isValid(): boolean
validate(): unknown
```

`isValid()` consulta el estado de la validación. `validate()` ejecuta la validación y devuelve el resultado definido por la implementación.

Crearemos una validación para el caso de uso que registra usuarios.

**`users/application/create-user-validation.ts`**

```ts
import type { Validatable } from '../../shared/application/validations.js'
import { Email } from '../../shared/domain/value-objects.js'

export class CreateUserValidation implements Validatable {
    public constructor(private readonly email: string) {}

    public isValid(): boolean {
        return Email.isValid(this.email)
    }

    public validate(): string[] {
        return this.isValid()
            ? []
            : ['The email is invalid.']
    }
}
```

El servicio de aplicación puede ejecutar esta validación antes de construir la entidad `User`.

### Servicios

Los servicios representan los casos de uso de la aplicación. Cada servicio aplica capacidades del dominio en un proceso que cumple un propósito, como crear un usuario, confirmar una orden o registrar un pago.

El archivo `shared/application/services.ts` genera la clase base `Service`. Una implementación concreta define sus entradas, sus dependencias y el método que ejecuta el proceso.

Comenzaremos con un servicio que crea un usuario.

**`users/application/create-user-service.ts`**

```ts
import { Service } from '../../shared/application/services.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'
import { User } from '../domain/user.js'
import { CreateUserValidation } from './create-user-validation.js'

export interface UserWriter {
    save(user: User): Promise<void>
}

export type CreateUserCommand = {
    id: string
    email: string
}

export type CreatedUser = {
    id: string
    email: string
    active: boolean | null
}

export class CreateUserService extends Service {
    public constructor(private readonly users: UserWriter) {
        super()
    }

    public async execute(
        command: CreateUserCommand
    ): Promise<CreatedUser> {
        const validation = new CreateUserValidation(command.email)
        const errors = validation.validate()

        if (errors.length !== 0) {
            throw new Error(errors.join(', '))
        }

        const user = new User(
            command.id,
            Email.from(command.email),
            NullableBoolean.from(true)
        )

        await this.users.save(user)

        return {
            id: user.id,
            email: user.email.value,
            active: user.active.value
        }
    }
}
```

El servicio recibe un comando, valida la entrada, construye la entidad y delega el guardado. `CreateUserCommand` expresa la entrada del proceso. `CreatedUser` expresa la salida.

### Respuestas HTTP

El archivo `shared/application/http.ts` genera `HttpResponseBody`, un cuerpo de respuesta diseñado para API REST.

La clase organiza la respuesta en tres propiedades:

```ts
new HttpResponseBody(data, errors, links)
```

`data` contiene los datos de la operación y acepta `null` cuando la respuesta carece de datos:

```ts
const body = new HttpResponseBody({ id: 'user-1' })
```

`errors` contiene una lista de mensajes:

```ts
const body = new HttpResponseBody(
    null,
    ['The email is invalid.']
)
```

`links` contiene enlaces HATEOAS relacionados con el recurso y sus operaciones disponibles:

```ts
const body = new HttpResponseBody(
    { id: 'user-1' },
    null,
    {
        self: new URL('https://api.example.com/users/user-1')
    }
)
```

La salida plana de una entidad puede utilizarse como `data`:

```ts
const body = new HttpResponseBody(user.toJSON())
```

### Logs

El archivo `shared/application/loggers.ts` declara el contrato `Logger`. La aplicación utiliza esta abstracción para producir logs que un adaptador envía a servicios externos.

El contrato incluye los niveles `debug`, `info`, `warning`, `error` y `critical`, junto con las constantes numéricas `DEBUG`, `INFO`, `WARNING`, `ERROR` y `CRITICAL`.

Crearemos un adaptador sencillo que conecta el contrato con la consola.

**`users/adapters/console-logger-adapter.ts`**

```ts
import { Logger } from '../../shared/application/loggers.js'

export class ConsoleLoggerAdapter extends Logger {
    public debug(data: unknown): void {
        console.debug(data)
    }

    public info(data: unknown): void {
        console.info(data)
    }

    public warning(data: unknown): void {
        console.warn(data)
    }

    public error(data: unknown): void {
        console.error(data)
    }

    public critical(data: unknown): void {
        console.error(data)
    }
}
```

El servicio recibe `Logger` como dependencia. El adaptador decide adónde enviar cada nivel.

### Eventos

El archivo `shared/application/events.ts` contiene los contratos que conectan la aplicación con un event bus.

El flujo comienza con un evento, continúa con el dispatcher y termina en uno o más handlers:

```text
Service
    ↓ crea
Event
    ↓ entrega a
EventDispatcher
    ↓ publica en
Event bus
    ↓ ejecuta
EventHandler
```

#### Evento

`Event` representa un hecho ocurrido en la aplicación. Contiene el momento del evento y sus detalles planos.

**`users/application/user-created.ts`**

```ts
import { Event } from '../../shared/application/events.js'

export class UserCreated extends Event {
    public constructor(userId: string) {
        super(Date.now(), { userId })
    }
}
```

#### Handler

`EventHandler` representa una reacción al evento.

**`users/application/log-user-created.ts`**

```ts
import {
    Event,
    EventHandler
} from '../../shared/application/events.js'
import { Logger } from '../../shared/application/loggers.js'

export class LogUserCreated extends EventHandler {
    public constructor(private readonly logger: Logger) {
        super()
    }

    public async handle(event: Event): Promise<void> {
        this.logger.info(event.details)
    }
}
```

#### Dispatcher

`EventDispatcher` representa el contrato de interacción con el event bus. Su implementación concreta suscribe handlers, retira suscripciones y despacha eventos.

```ts
subscribe(key, handler)
unsubscribe(key, handler)
dispatch(event)
```

El servicio puede recibir `EventDispatcher` y publicar `UserCreated` al completar el caso de uso.

## Fuentes de datos

El archivo `shared/application/data-sources.ts` organiza el acceso a una fuente de datos en cuatro piezas: `DriverManager`, `DataManager`, `DatasetManager` y `Repository`.

El flujo completo se ve así:

```text
DriverManager
    ↓ conecta y habilita
DataManager o DatasetManager
    ↓ entrega datos planos a
Repository
    ↓ transforma
Objetos de dominio
    ↓ utiliza
Service
```

Comenzaremos en la conexión y avanzaremos hasta el caso de uso.

### Driver manager

`DriverManager` conecta y desconecta la fuente mediante un driver. Cuando la conexión está disponible, `connect()` devuelve un data manager habilitado.

```ts
connect(...args): Promise<DataManager>
disconnect(): Promise<unknown>
```

Crearemos un manager para una colección de personas en memoria. El ejemplo evita una base de datos para que el foco quede en la responsabilidad del manager.

**`users/adapters/people-driver-manager.ts`**

```ts
import { DriverManager } from '../../shared/application/data-sources.js'
import { PeopleDataManager } from './people-data-manager.js'

export type PersonRecord = {
    id: string
    name: string
}

export class PeopleDriverManager
    extends DriverManager<PeopleDataManager> {

    public constructor(private readonly records: PersonRecord[]) {
        super()
    }

    public async connect(): Promise<PeopleDataManager> {
        return new PeopleDataManager(this.records)
    }

    public async disconnect(): Promise<void> {
    }
}
```

La implementación concreta puede encapsular un driver de base de datos, un cliente HTTP, un sistema de archivos u otra fuente.

### Data manager

`DataManager` actúa sobre la fuente y trabaja con objetos planos y arrays. Su forma base define dos operaciones:

```ts
all(): Promise<Array<T>>
none(): Array<T>
```

`all()` obtiene los registros disponibles. `none()` crea una colección vacía tipada.

Primero definiremos la forma que utiliza la fuente:

```ts
type PersonRecord = {
    id: string
    name: string
}
```

Ahora implementaremos el data manager.

**`users/adapters/people-data-manager.ts`**

```ts
import { DataManager } from '../../shared/application/data-sources.js'

export type PersonRecord = {
    id: string
    name: string
}

export class PeopleDataManager
    extends DataManager<PersonRecord> {

    public constructor(private readonly records: PersonRecord[]) {
        super()
    }

    public async all(): Promise<PersonRecord[]> {
        return this.records
    }

    public none(): PersonRecord[] {
        return []
    }
}
```

El data manager refleja la estructura de la fuente. En este ejemplo solo entrega registros planos.

#### Operaciones de la fuente

El archivo también declara interfaces para ampliar las capacidades de un data manager:

| Interfaz | Operación |
| --- | --- |
| `Filterable` | Filtra registros. |
| `Sortable` | Ordena registros. |
| `Creatable` | Crea registros. |
| `Updatable` | Actualiza registros. |
| `Deletable` | Elimina registros. |
| `Aggregatable` | Ejecuta agregaciones. |
| `Relatable` | Selecciona o precarga relaciones. |

Un data manager puede implementar las interfaces que necesita su fuente:

```ts
import {
    Creatable,
    DataManager,
    Filterable
} from '../../shared/application/data-sources.js'

export class PeopleDataManager
    extends DataManager<PersonRecord>
    implements
        Filterable<Partial<PersonRecord>>,
        Creatable<PersonRecord> {

    public constructor(private readonly records: PersonRecord[]) {
        super()
    }

    public async all(): Promise<PersonRecord[]> {
        return this.records
    }

    public none(): PersonRecord[] {
        return []
    }

    public async filter(
        selector: Partial<PersonRecord>
    ): Promise<PersonRecord[]> {
        return this.records.filter((record) =>
            (selector.id === undefined || record.id === selector.id) &&
            (selector.name === undefined || record.name === selector.name)
        )
    }

    public async create(data: PersonRecord): Promise<void> {
        this.records.push(data)
    }
}
```

También puede declarar operaciones específicas para consultas de la fuente:

```ts
public async findByName(name: string): Promise<PersonRecord[]> {
    return this.filter({ name })
}
```

La capa de aplicación decide cuándo ejecutar estas operaciones, combina sus resultados y captura los errores producidos por la fuente.

### Dataset manager

`DatasetManager` extiende `DataManager` con operaciones de conjuntos:

```ts
union()
intersection()
difference()
symmetric_difference()
complement()
```

Esta implementación resulta útil cuando una operación trabaja con uniones, intersecciones, diferencias y complementos entre colecciones de datos.

### Repository

`Repository` actúa como intermediario entre los datos planos y los objetos de dominio.

```text
PersonRecord
    ↓ transform
Person

Person
    ↓ toRecord
PersonRecord
```

En este ejemplo la fuente y el dominio comparten casi la misma forma para que el foco quede en el rol del repositorio: traducir entre datos planos y objetos de dominio.

**`users/domain/person.ts`**

```ts
import { Entity } from '../../shared/domain/entities.js'

export class Person extends Entity {
    public constructor(
        public readonly id: string,
        public readonly name: string
    ) {
        super()
    }

    public override equals(other: Entity): boolean {
        return other instanceof Person && other.id === this.id
    }

    public override toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name
        }
    }
}
```

Ahora implementaremos el repositorio.

**`users/adapters/people-repository.ts`**

```ts
import { Repository } from '../../shared/application/data-sources.js'
import type { PeopleReader } from '../application/list-people-service.js'
import { Person } from '../domain/person.js'
import type { PersonRecord } from './people-data-manager.js'
import { PeopleDriverManager } from './people-driver-manager.js'

export class PeopleRepository
    extends Repository<PeopleDriverManager>
    implements PeopleReader {

    protected transform<T = Person>(data: Generic): T {
        const record = data as PersonRecord

        return new Person(record.id, record.name) as T
    }

    private toRecord(person: Person): PersonRecord {
        return {
            id: person.id,
            name: person.name
        }
    }

    public async findAll(): Promise<Person[]> {
        const dataManager = await this.manager.connect()
        const records = await dataManager.all()

        return records.map((record) =>
            this.transform<Person>(record)
        )
    }

    public async save(person: Person): Promise<void> {
        const dataManager = await this.manager.connect()

        await dataManager.create(this.toRecord(person))
    }
}
```

`transform()` convierte el registro en una entidad. `toRecord()` hace el camino inverso.

### Consultas y errores en la aplicación

Los servicios de aplicación coordinan las consultas y capturan los errores de las fuentes de datos. El proceso expresa las capacidades de colaboración que necesita mediante contratos propios de la aplicación. Los adaptadores materializan esos contratos.

**`users/application/list-people-service.ts`**

```ts
import { Service } from '../../shared/application/services.js'
import type { Person } from '../domain/person.js'

export interface PeopleReader {
    findAll(): Promise<Person[]>
}

export class ListPeopleService extends Service {
    public constructor(private readonly people: PeopleReader) {
        super()
    }

    public async execute(): Promise<Person[]> {
        try {
            return await this.people.findAll()
        } catch {
            throw new Error('Could not list people.')
        }
    }
}
```

`PeopleReader` expresa la colaboración que necesita el proceso. `PeopleRepository`, ubicado en `adapters`, implementa esa colaboración y transforma los datos de la fuente en entidades `Person`.

## Puertos del contexto

Los puertos describen la comunicación entre el contexto y otros sistemas. Cada puerto define la forma de una interacción en la frontera: datos de entrada, datos de salida y operación disponible.

El contexto genera `index.ts` como archivo principal de puertos y `example-ports.ts` como ejemplo de un archivo adicional. Los puertos son importados por los adaptadores que materializan esa comunicación.

### Puerto principal

Declararemos la comunicación para crear un usuario directamente en `users/index.ts`.

**`users/index.ts`**

```ts
export type CreateUserRequest = {
    id: string
    email: string
}

export type CreateUserResponse = {
    id: string
    email: string
    active: boolean | null
}

export interface CreateUserPort {
    create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse>
}
```

`CreateUserRequest` representa la información recibida desde otro sistema. `CreateUserResponse` representa la respuesta entregada. `CreateUserPort` define la operación disponible en la frontera del contexto.

### Adaptar el puerto al proceso de aplicación

El adaptador importa el puerto y el servicio. Su responsabilidad consiste en traducir la solicitud externa al comando de aplicación y transformar el resultado en la respuesta del puerto.

**`users/adapters/create-user-adapter.ts`**

```ts
import type {
    CreateUserPort,
    CreateUserRequest,
    CreateUserResponse
} from '../index.js'
import {
    CreateUserService,
    type CreateUserCommand
} from '../application/create-user-service.js'

export class CreateUserAdapter implements CreateUserPort {
    public constructor(
        private readonly service: CreateUserService
    ) {}

    public async create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse> {
        const command: CreateUserCommand = {
            id: request.id,
            email: request.email
        }

        const result = await this.service.execute(command)

        return {
            id: result.id,
            email: result.email,
            active: result.active
        }
    }
}
```

El puerto expresa la comunicación. El adaptador la implementa. El servicio ejecuta el proceso. El dominio aporta las capacidades utilizadas por ese proceso.

### Puertos adicionales

Un contexto puede organizar sus comunicaciones en varios archivos de la raíz. Cada archivo declara los puertos de un grupo de interacciones.

**`users/example-ports.ts`**

```ts
export type FindUserRequest = {
    id: string
}

export type FindUserResponse = {
    id: string
    email: string
} | null

export interface FindUserPort {
    find(
        request: FindUserRequest
    ): Promise<FindUserResponse>
}
```

El adaptador correspondiente importa el contrato desde el archivo donde está declarado:

```ts
import type {
    FindUserPort,
    FindUserRequest,
    FindUserResponse
} from '../example-ports.js'
```

> **Consejo:** agrupa en un mismo archivo los puertos que forman una comunicación coherente. Usa archivos adicionales cuando el contexto crece y aparecen grupos de interacciones con responsabilidades propias.

## Implementar un contexto

Ahora recorreremos una implementación completa de `users` siguiendo el orden de las capas: capacidades, proceso y comunicación.

### 1. Modelar las capacidades del dominio

Comenzamos con los conceptos que poseen reglas y comportamiento. Para el correo utilizamos `Email`; para la identidad utilizamos `string`; para el usuario creamos una entidad.

**`users/domain/user.ts`**

```ts
import { Entity } from '../../shared/domain/entities.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

export class User extends Entity {
    public constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly active: NullableBoolean
    ) {
        super()
    }

    public override equals(other: Entity): boolean {
        return other instanceof User && other.id === this.id
    }

    public override toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            email: this.email.value,
            active: this.active.value
        }
    }
}
```

`Email` aporta la capacidad de validar y representar el correo. `User` aporta identidad y representación del usuario.

### 2. Implementar la validación del proceso

La validación prepara la entrada utilizada por el caso de uso.

**`users/application/create-user-validation.ts`**

```ts
import type { Validatable } from '../../shared/application/validations.js'
import { Email } from '../../shared/domain/value-objects.js'

export class CreateUserValidation implements Validatable {
    public constructor(private readonly email: string) {}

    public isValid(): boolean {
        return Email.isValid(this.email)
    }

    public validate(): string[] {
        return this.isValid()
            ? []
            : ['The email is invalid.']
    }
}
```

### 3. Implementar el proceso de aplicación

El servicio recibe sus colaboradores como dependencias y aplica las capacidades del dominio para completar el registro.

**`users/application/create-user-service.ts`**

```ts
import { Service } from '../../shared/application/services.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'
import { User } from '../domain/user.js'
import { CreateUserValidation } from './create-user-validation.js'

export interface UserWriter {
    save(user: User): Promise<void>
}

export type CreateUserCommand = {
    id: string
    email: string
}

export type CreatedUser = {
    id: string
    email: string
    active: boolean | null
}

export class CreateUserService extends Service {
    public constructor(private readonly users: UserWriter) {
        super()
    }

    public async execute(
        command: CreateUserCommand
    ): Promise<CreatedUser> {
        const validation = new CreateUserValidation(command.email)
        const errors = validation.validate()

        if (errors.length !== 0) {
            throw new Error(errors.join(', '))
        }

        const user = new User(
            command.id,
            Email.from(command.email),
            NullableBoolean.from(true)
        )

        await this.users.save(user)

        return {
            id: user.id,
            email: user.email.value,
            active: user.active.value
        }
    }
}
```

`UserWriter` declara la operación que el servicio necesita del adaptador. El flujo queda en cuatro pasos: validar, construir la entidad, guardar y responder.

### 4. Declarar el puerto de comunicación

El puerto define cómo otro sistema solicita la creación de un usuario.

**`users/index.ts`**

```ts
export type CreateUserRequest = {
    id: string
    email: string
}

export type CreateUserResponse = {
    id: string
    email: string
    active: boolean | null
}

export interface CreateUserPort {
    create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse>
}
```

### 5. Implementar el adaptador

El adaptador importa el puerto, recibe la solicitud externa y ejecuta el proceso de aplicación.

**`users/adapters/create-user-adapter.ts`**

```ts
import type {
    CreateUserPort,
    CreateUserRequest,
    CreateUserResponse
} from '../index.js'
import {
    CreateUserService,
    type CreateUserCommand
} from '../application/create-user-service.js'

export class CreateUserAdapter implements CreateUserPort {
    public constructor(
        private readonly service: CreateUserService
    ) {}

    public async create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse> {
        const command: CreateUserCommand = {
            id: request.id,
            email: request.email
        }

        const result = await this.service.execute(command)

        return {
            id: result.id,
            email: result.email,
            active: result.active
        }
    }
}
```

La comunicación completa sigue este recorrido:

```text
Solicitud externa
      ↓
CreateUserAdapter
      ↓
CreateUserService
      ↓
Validación + Email + User
      ↓
     UserWriter
      ↓
Respuesta externa
```

### 6. Componer la implementación en `main.ts`

`main.ts` reúne las implementaciones principales de la librería. La composición crea el servicio y lo entrega al adaptador.

**`core/main.ts`**

```ts
import { CreateUserService } from './users/application/create-user-service.js'
import { CreateUserAdapter } from './users/adapters/create-user-adapter.js'
import { InMemoryUserRepository } from './users/adapters/in-memory-user-repository.js'

export class CoreApplication {
    public readonly users: CreateUserAdapter

    public constructor() {
        const users = new InMemoryUserRepository()
        const createUserService = new CreateUserService(users)

        this.users = new CreateUserAdapter(createUserService)
    }
}
```

`CoreApplication` ofrece una composición mínima: un repositorio concreto, un servicio y un adaptador.

### 7. Utilizar la implementación

El consumidor utiliza la entrada principal de la librería y accede al adaptador preparado en `main.ts`.

```ts
import { CoreApplication } from './core/main.js'

const core = new CoreApplication()

const result = await core.users.create({
    id: 'user-1',
    email: 'alejandro@example.com'
})
```

El adaptador recibe la solicitud, aplica el puerto, ejecuta el servicio y entrega la respuesta.

## Referencia de archivos generados

| Archivo | Propósito |
| --- | --- |
| `core/index.d.ts` | Declara `Generic<T>` para objetos planos. |
| `core/main.ts` | Contiene la implementación principal de la librería. |
| `shared/domain/value-objects.ts` | Declara `ValueObject<T>` e implementa `Email` y `NullableBoolean`. |
| `shared/domain/entities.ts` | Declara la base `Entity`. |
| `shared/domain/aggregates.ts` | Declara la base `Aggregate`. |
| `shared/domain/errors.ts` | Implementa `ValueError`. |
| `shared/application/validations.ts` | Declara `Validatable`. |
| `shared/application/services.ts` | Declara `Service` como base de los casos de uso. |
| `shared/application/http.ts` | Implementa `HttpResponseBody` para respuestas REST y enlaces HATEOAS. |
| `shared/application/loggers.ts` | Declara niveles de log y el contrato `Logger`. |
| `shared/application/events.ts` | Declara `Event`, `EventHandler` y `EventDispatcher`. |
| `shared/application/data-sources.ts` | Declara operaciones de fuentes, managers y repositorios. |
| `users/index.ts` | Declara los puertos principales de comunicación del contexto. |
| `users/example-ports.ts` | Muestra un archivo adicional de puertos de comunicación. |
| `users/domain/` | Contiene las capacidades del contexto. |
| `users/application/` | Contiene procesos que aplican las capacidades del dominio para cumplir propósitos. |
| `users/adapters/` | Contiene integraciones que importan puertos y comunican el contexto con otros sistemas. |
