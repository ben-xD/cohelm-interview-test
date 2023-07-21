# Mytos TypeScript Express Server Challenge

This challenge is to write an Express server using TypeScript. This server will
be used as a very simple cell data storage service.

## Challenge overview

We are looking to create a service which can be used to store and search for
cells which are commonly used by the bio team.

### Cell storage

Cells can be characterized by a number of key factors.

-   Every cell has a name field which should be unique
-   Every cell has a numeric doubling time field
-   Cells might have a numeric max confluence field

Here is an example of the curl request used to create a new cell.

```
curl --request POST \
  --url /api/cells \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "HEK",
	"doublingTime": 2,
	"maxConfluence": 0.8
}'
```

If creating a cell with a name which already exists then the endpoint should
return an appropriate HTTP error code.

### Cell retrieval

It should be possible to find cells by name.

```
curl --request GET \
  --url 'http:///api/cells?name=hek'
```

It should be possible to find cells by searching by name.

```
curl --request GET \
  --url 'http:///api/cells?name:like=he'
```

It should be possible to find cells using doubling time.

```
curl --request GET \
  --url 'http:///api/cells?doublingTime:max=3,maxConfluence:min=1'
```

If there are no matching cells then the endpoint should return an empty list.

## Assessment criteria

There are a number of factors on which you will be assessed. It is important to
consider these factors when working through the solution with the interviewer.

### Correctness of solution

You will be assessed on the correctness of the solution. A correct solution will
implement the specification. This includes conditions not assessed in the
automated test suites. During development discuss with the interviewer about
what you consider could be edge cases and considering protecting against them.

### Use of TypeScript types

Types can be used to aid development, ensure that the solution meets the
specification and to help subsequent developers when they come to work on your
code. Ensure that you make appropriate use of types when implementing the code.

### Collaboration and communication

When working on the solution it is important to communicate your thought process
with the interviewer. They are there to discuss the solution with, provide
guidance and assess how well you are implementing the solution.

## Getting started

### Install dependencies

```
pnpm install
```

### Run automated tests

```
pnpm test
```

## Licence

This starter gist is the property of Mytos, this code or any derivatives should
not be shared with others.
