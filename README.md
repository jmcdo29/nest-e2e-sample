# NestJS E2E Test Sample

This is a semi-decent fully fledged test example using [NestJS](https://github.com/nestjs/nest), [uvu](https://github.com/lukeed/uvu), and [PactumJS](https://github.com/pactumjs/pactum) as the means of testing in an E2E environment. [Kysely](https://github.com/koskimas/kysely) is used as the query runner/database connection manager, and I've added in my [ogma](https://github.com/jmcdo29/ogma) logger to show that the requests are being made to the server. 

## The Goal

So we all kind aof know that [Jest](https://github.com/facebook/jest) and [Supertest](https://github.com/visionmedia/supertest) have been the defacto go tos when it comes to running tests and testing your API server, but I wanted something that has a little more oomph and usability, which is where `pactum` comes in.

Pactum is an HTTP request runner with way more capabilities than I'm about to mention here, but the big ones are data storage, dependent HTTP calls, response validation, and e2e step management, to the extent of also having the ability to run cleanup commands in a last in, first out manner. 

uvu is an _extremely_ performant test runner, to the point of almost being unreal. Now, running uvu in a programmatic manner is a bit difficult and unwieldy, but not completely impossible. The API is also a bit different than Jest's so keep that in mind. 

So the goal here is to show that we're able to spin up a Nest server once, have migrations run once, and have all of the tests run from a single file while being written in a common pattern, grouped by feature rather than by file type. I feel this comes into play especially when making use of pactum's features.

## The Set Up

I'm using [swc](https://github.com/swc-project/swc) to run uvu and migrations to let the typescript compile and run in memory. If you don't care for this, you can use `ts-node` or compile the code first.

All of the test code is kicked off from the [`test/index.spec.ts`](./test/index.spec.ts) file. From there we call some `docker` commands to check if `docker compose` is running and Postgres is up, run the migrations runner file using the `test` environment, and start our Nest server, before running the tests. If all you're looking to do is run the tests and see it all works, just run `node -r @swc/register test/index.spec.ts`. The logs are a little messy due to `uvu`'s output using `process.stdout` just like `ogma` does, but that's the only problem I've really run into here.

Other than that, I've created a database schema like so

```ts
import { Generated } from 'kysely';

export enum Location {
  N = 'N',
  S = 'S',
  W = 'W',
  E = 'E',
}

export enum FamilyRole {
  mother = 'mother',
  father = 'father',
  child = 'child',
}

export interface Neighborhood {
  name: string;
  id: Generated<string>;
  location: Location;
}

export interface Family {
  name: string;
  id: Generated<string>;
  neighborhood_id: string;
}

export interface Person {
  name: string;
  id: Generated<string>;
  role: FamilyRole;
  family_id: string;
}

export interface Database {
  neighborhood: Neighborhood;
  family: Family;
  person: Person;
}
```

A very simple database with three tables all relating to the one that came before it just to show it all works out and to get some nice experience with kysely.

For the most part the code is all pretty straightforward and easy to read through.

## Fun things to point out

Around line 53 of the `test/index.spec.ts` file:

```ts
const setupApplication = async (): Promise<INestApplication> => {
  ogma.debug('Creating Nest application');
  const modRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getKyselyOptionsToken())
    .useValue({
      port: 35432,
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'test',
    })
    .compile();
  return modRef.createNestApplication();
};
```

By making the kysely options an injectable token, it made it easy to change what database we're pointing at for the test environment.

Both the `family.step.ts` and the `person.step.ts` files show just how easy and powerful the pactum data templates can be in terms of working with re-usable template data while also providing overrides for particular values, and show off some of the stash capabilities of pactum as well.

The neighborhood.spec.ts file shows off a nice use of the `expectJsonLike` handler so that you don't need a perfect JSON match (like if you have tests running parallel) and the `person.spec.ts` file shows how you can use the stash data inside an `expectJsonLike` to provide it's usable practically anywhere.

## Generating Coverage

If you want to see the coverage outcome you can use [c8](https://github.com/bcoe/c8) which is installed in this application. Just run

```sh
pnpm exec c8 node -r @swc/register test/index.spec.ts
```