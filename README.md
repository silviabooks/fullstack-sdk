# FullStack-SDK

This repository collects a few components that help you build a modern Web Application with the following core values in mind:

- The Developer Experience matters
- The Development Environment is automated
- The Development Environment is stateless
- The Development Environment is reproducible
- We follow Test Driven Development principles
- We maximize parallel work streams

## Table of Contents

- [Docker & DockerCompose](#docker--dockercompose)
  - [Types of Containers](#types-of-containers)
  - [Dependencies Between Services](#dependencies-between-services)
  - [Ports Mapping](#ports-mapping)
  - [Volumes Mapping](#volumes-mapping)
  - [Environmental Variables & Secret](#environmental-variables--secrets)
- [The Make Interface](#the-make-interface)
  - [make start](#make-start)
  - [make stop](#make-stop)
  - [make test](#make-test)
  - [make restart](#make-restart)
  - [make reset](#make-reset)
  - [make build](#make-build)
  - [make clean](#make-clean)
- [PostgreSQL](#postgresql)
  - [Schema Management & Migrations](#schema-management--migrations)
  - [Serverless Functions with TDD](#serverless-functions)
  - [TDD on PostgreSQL](#tdd-on-postgresql)
- [Hasura.io](#hasuraio)
  - [The Architectural Role of Hasura](#the-architectural-role-of-hasura)
  - [Point & Click Configuration](#point--click-configuration)
  - [Migrations & State Management](#migrations--state-management)
- [State Management Utilities](#state-management-utilities)
  - [make hasura-console](#make-hasura-console)
  - [make hasura-apply](#make-hasura-apply)
  - [make hasura-export](#make-hasura-export)
- [TDD](#tdd)

---

## Docker & DockerCompose

The Development Environment is a composition of **containerized services**. Each service should expose a `Dockerfile` for development and production that is used by a `docker-compose.yml`.

Dependencies resolutions, building steps, development servers, etc **SHOULD BE ABSTRACTED AWAY** from the developer.

Docker & DockerCompose should be the only strict dependency on the Developer's machine. (they are free on Linux)

### Types of Containers

The `docker-compose.yml` for development should be divided in four sections:

- SERVICES: those are the Apps built by the developers
- TESTS: run tests agains the Services
- UTILITIES: stuff like Adminer or similar that would not run in production
- INFRASTRUCTURE: anything that we would buy in production  
  <small>(Databases, Redis, ...)</small>

### Dependencies Between Services

We rely on the `depends_on` and `healthcheck` declarations to create a booting tree that will reliably boot and instrument the entire Development Environment right after the first `git clone`.

> This is intended as a development facilitation and should have no impact in production.

EXPLANATION: 

A **production** environment implements a **eager crash** approach where a service that fails a precondition (eg. the db is not ready) will simply crash. The runner will apply a failover policy and probably restart it.

In a **development** environment the service is likely wrapped by a File System monitoring mechanism that will rebuild/restart the service once its source code chages. In case of a crash, such event will be catched by the FS monitor and not by the runner.

> Hence, in development we must be sure that the infrastructural preconditions are met BEFORE attempting to star a service.

### Ports Mapping

All the ports that need to be exposed to the host machine should be defaulted using the host's environmental variables:

```
postgres:
  ports:
    - "${POSTGRES_PORT:-5432}:5432"
```

### Volumes Mapping

[[ TO BE COMPLETED ]]

### Environmental Variables & Secrets

[[ TO BE COMPLETED ]]

---

## The Make Interface

We aim to simplify the Developer Experience by suggestig a seamless way to interact with any project which is based on a `Makefile`, hence native to virtually any Linux distributions.

### make start

- build Development Containers
- pulls project's dependencies
- boot the entire Development Environment
- prepare the initial state 
- show relevant logs

### make stop

- gracefully tears down the Development Environment

### make restart

[Have you tried to turn it off, then on again?](https://www.youtube.com/watch?v=nn2FB1P_Mn8)

- stop
- start

### make reset

Like `make restart`, but it also clean up the state.  
It's a fresh start over.

### make build

- build Development Containers ignoring any cache layer
- pulls project's dependencies

### make clean

- stop the system
- removes any kind of local state

### make test

- run all Unit Tests
- reset or prepare the Application State for the tests
- run all E2E Tests

---

## PostgreSQL

PostgreSQL is an Open Source dbms made by the Aliens to prove their mental superiority. They did it.

PostgreSQL can:

- handle relational data
- handle binary JSON documents
- handle geospatial data
- run server side functions in multiple languages
- provide additional features via extensions
- partition tables boosting big-data performances
- route tables to different disks
- handle push notifications
- **PERFORM UNIT TESTS AND TDD ON POSTGRES**

With the amount of data that we manage in an average size project / service we could use only PG as data management solution and live happily ever after.

Most engineers go through life learning a little bit of many things. My challenge for you is to become a deep expert on this powerful tool and see where it take us.

Suggested materials:

- [PostgreSQL Bootcamp: Go From Beginner to Advanced, 60+hours](https://www.udemy.com/course/postgresqlmasterclass/)
- [AmazingPostgres: a personal notebook](https://github.com/marcopeg/amazing-postgresql)
- [Tips for Tuning PostgreSQL 12 like a Pro | Learn how to prevent Postgres performance problems](https://www.udemy.com/course/postgresql-high-performance-tuning-guide/)

### Schema Management & Migrations

Please refer to the [State Management & Migrations](#state-management--migrations) section.

### Serverless Functions

**Serverless Functions** seem to be a cool new tech.  
Or is it?

You hand over a piece of logic - possibly stateless logic - and ask a third party entity to run it for you in connection with API events or Data Events. Simple.

[👉 Well, it's about 40 years that we have this tech.](https://lostechies.com/chadmyers/2010/09/08/a-brief-history-of-programming/)  
We - as Industry - simply forgot about it.

Since the ´80s, it is possible to deploy serverless functions into most _DBMS_ such as MSSQL, MySQL, and of course, PostgreSQL.

> The **main argument against** this practice is the difficulty to debug and maintain some logic that becomes part of the state of the App.

But somehow, today we do exactly that with pieces of code (Node, .NET, Java) that we persist into Cloud Provider's state and trust them to execute it for us.

👉 SO IT SEEMS WE OVERCAME THAT NEGATIVITY TOWARDS SERVERLESS 👈

There are two tools that build confidence with Serverless:

- versioning
- testing

When it comes to Serverless on PostgreSQL we can leverage those tools:

- [State Management & Migrations](#state-management--migrations)
- [Unit Testing on PostgreSQL](#tdd-on-postgresql)

Logical reliability is NOT a problem - and it's never been!

**👉 SCALABILITY IS ANOTHER IMPORTANT SUBJECT TO DISCUSS 👈**

When we put logic on the Application Layer (aka: Servers or Cloud provided Serverless Functions) we can leverage on **HORIZONTAL SCALING**.

> When we deploy Serverless Functions in a DBMS we simply CAN NOT SCALE HORIZONTALLY. Period. 

Is it a problem?  
Maybe yes, maybe no.

Up until approximately 10 years (~2010s), **VERTICAL SCALING WAS BOTH DIFFICULT AND LIMITED**. Not to mention expensive. It wasn't such a good idea to keep scaling up a DBMS Server. Too much work. And the [VERTICAL LIMIT](https://www.imdb.com/title/tt0190865/) wasn't as high as K2.

> Take me to the magic of the moment  
> On a glory night  
> Where the children of tomorrow share their dreams  
>
> [The Wind of Change by Scorpions](https://www.youtube.com/watch?v=n4RjJKxsamQ)

Today (~2020s), the vertical limit is high. Very high. Changing virtual hardware is a highly automated procedure that we delegate to Terraform and similar infra-as-code tools.

A single (or replicated) DBMS machine has the possibility to scale up and match requirements that is simply mind-blowing.

**👉 TODAY WE CAN MOVE OUR LOGIC (BACK) TO WHERE IT BELONGS 👈**

After all, business logic has born into DBMS (AS400), then it move out for economical reasons.

**NOT EVERYTHING BELONGS TO THE DBMS**

Of course, we have a SOlid (pun inteded) responsibility in choosing what belongs to the DBMS and what not:

- ✅ joining related data deefinitely belongs to the DBMS.
- 🚫 rendering a PDF definitely doesn't belong to he DBMS.
- 🚧 validating a login and releasing a JWT? Maybe.

One thing is certain: the only real argument agains Database Serverless was MONEY, and it is not a valid argument today.

### TDD on PostgreSQL

As we move logic into the Database Layer we must keep reliability up. Luckily, there is no easier place to do so.

[PGTap](https://pgtap.org/) is a testing framework for Postgres that is:

- easy to learn and use
- can run in Docker
- can be part of our CI/CD

We can achieve 100% code-coverage for all the business critical data centric logic that we write.

👉 **PLUS:** Tests run in transactions so they are **stateless by design!** 👈

---

## Hasura.io

[Hasura.io](https://hasura.io/) is a super-charged ORM-like layer that **maps a database schema to a GraphQL API**.

> Do you remember all the code we used to write to expose APIs, validate tokens, match authorization claims and sanitize parameters?
>
> It's all gone with the wind.

Hasura Engine can:

- map multiple PostgreSQL or MSSQL databases and schemas to a GraphQL APIs effectively federating data access
- manage live data subscriptions via sockets (and fallback)
- provide **fine-grained data access control** implementing declarative rules
- manage authentication / authorization via JWT claims or custom authentication services
- provide a GraphQL API proxy to custom backend services effectively providing **static data-type validation** on REST APIs input/output
- federate multiple custom backends into a single self-documented GraphQL API
- federate remote GraphQL schemas
- manage side effects by forwarding data events to custom backends with safe failover strategies
- manage cron-jobs
- manage migrations

Suggested materials:

- [Performant GraphQL Backend in 1 Day by Using Hasura Engine](https://www.udemy.com/course/develop-graphql-backend-faster-with-hasura/)
- [Getting started docs](https://hasura.io/docs/latest/graphql/core/index.html)
- [The Hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/index.html)
- [Migrations & Metadata](https://hasura.io/docs/latest/graphql/core/migrations/index.html)
- [Hasura License (Apache2)](https://github.com/hasura/graphql-engine/blob/master/LICENSE)

### The Architectural Role of Hasura

We can use Hasura as our **backend-for-frontend** as so unify how our React App makes server calls.

Most of the **CRUD operations will be described as Hasura rules** effectively removing (or postponing) to write boring and error-prone code.

We can **proxy any custom service** through Hasura with simple declarative rules that can be automatically propagated to any environment.

We can **describe maintenance jobs** as Hasura Events and keep the knowledge of those stuff in the Git codebase along with any custom logic. 

> Hasura's medatata is Git-controlled.

### Migrations & State Management

Using Hasura.io as backend-for-frontend implies that the Application State is composed by:

1. database(s) schema(s)
2. Hasura(s)' metadata
2. data seeding scripts
4. data snapshots

Points n 1, 2 and 3 are managed by the [Hasura CLI](https://hasura.io/docs/latest/graphql/core/migrations/index.html#how-is-hasura-state-managed) via:

- migrations
- metadata
- seeding

Point n.4 is slightly more complicated and is usually delegated to the DevOps management realm. Long story short, the full state should be restored to a newly supplied environment. The classic name for such a huge responsibility is **Disaster Recovery**.

🔥 You can run this on your host machine after [installing the Hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html):

```bash
cd services/migrations
hasura apply migrations
hasura apply metadata
hasura apply seeds
```

🔥 [Or you can use the dockerized state management utilities](#state-management-utilities) 🤟

### Point & Click Configuration

Hasura.io offers a visual management tool called [Hasura Console](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_console.html) that can **synchronize point&click actions with the local codebase** for metadata and migrations.

1. our Engineers can operate the Declarative ACL rules, Proxy Actions, setup side-effects and Events using the Visual Console
2. the resulting State Mutation is recorded as [database migrations](#migrations--state-management) and code-changes in a set of YAML files
3. the Team can support the change by offering Code Reviews and testing the branch in [dispsable environments](#disposable-environments--gitpodio)
4. approved changes are automatically distributed to any running environment including the Developer's

> 🔥 You can run this on your host machine after [installing the Hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html):

```bash
cd services/migrations
hasura console
```

🔥 [Or you can use the dockerized state management utilities](#state-management-utilities) 🤟

---

## State Management Utilities

This project setup offers a few utilities that you can use via `docker-compose` and the relative `make` interface. 

### make hasura-console

It runs a conteinerized version of the [Hasura Console](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_console.html) that will be available at port `9695` and `9693`.

> By default it is configured to apply (at boot time):
> 
> - migrations
> - metadata
> - seeds.

👉 **Use this console to keep your local metadata in sync with your clickings.** 👈

> Use the console at:  
> http://localhost:9695

### make hasura-apply

It runs a coneinerized version of the `hasura ** apply` command.

> By default it is configured to apply:
> 
> - migrations
> - metadata
> - seeds.

### make hasura-export

It runs a coneinerized version of the `hasura ** export` command.

> By default it is configured to export only metadata, but you can also use it to generate a full initial migration.

---

## TDD

[[ TO BE COMPLETED ]]

---

## Disposable Environments & GitPod.io

[[ TO BE COMPLETED ]]