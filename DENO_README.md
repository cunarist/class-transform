# Class Transform - Deno Version

This project has been converted from Node.js/npm to Deno while maintaining the
ability to publish to NPM.

## Development with Deno

### Prerequisites

- [Deno](https://deno.land/) installed
- [Node.js and npm](https://nodejs.org/) (only needed for NPM publishing)

### Available Commands

```bash
# Format code
deno task fix

# Check formatting
deno task check

# Run tests
deno task test

# Build for NPM (requires Node.js/npm)
deno task build

# Run the sample
deno task dev
```

### Project Structure

- `lib/` - Source code (Deno-compatible ES modules)
- `scripts/` - Build and utility scripts
- `sample/` - Example usage
- `deno.json` - Deno configuration and tasks

### Usage

```javascript
import { Exposed, instanceToPlain, plainToInstance } from "./lib/index.js";

class Person {
  name = Exposed.string();
  age = Exposed.number();
}

// Transform plain object to class instance
const person = plainToInstance({ name: "John", age: 30 }, Person, []);

// Transform class instance back to plain object
const plain = instanceToPlain(person);
```

### Publishing

#### To JSR (JavaScript Registry) - Recommended for Deno projects

```bash
deno publish
```

#### To NPM - For Node.js compatibility

1. Ensure Node.js and npm are installed
2. Build the NPM package:
   ```bash
   deno task build
   ```
3. Publish to NPM:
   ```bash
   cd npm && npm publish
   ```

The NPM build will create a `npm/` directory with Node.js-compatible CommonJS
and ES module builds.

## Migration Notes

This project was migrated from package.json to deno.json:

- ✅ Source code already used ES modules with explicit extensions
  (Deno-compatible)
- ✅ No external dependencies to convert
- ✅ TypeScript configuration integrated into deno.json
- ✅ Build pipeline using @deno/dnt for NPM compatibility
- ✅ Formatting and linting now use Deno's built-in tools
