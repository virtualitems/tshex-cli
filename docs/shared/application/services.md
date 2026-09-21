### Services

`shared/application/services.ts` exports an empty abstract `Service` base
class. Extend it when a context needs a named type for an application operation.
The template does not impose method names, dependencies, transactions, or
return types.

```ts
import { Service } from '../../shared/application/services.ts'
import { Email } from '../../shared/domain/value-objects/strings.ts'

export class RegisterUser extends Service {
    public execute(address: string): Email {
        return Email.from(address)
    }
}

const service = new RegisterUser()
const email = service.execute('ada@example.com')

email.value
// 'ada@example.com'
```

`RegisterUser` coordinates input and the domain value. Add a repository,
session, event dispatcher, or logger only when the operation requires that
collaborator.
