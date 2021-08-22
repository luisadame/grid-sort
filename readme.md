<div align="center">
  <br />
  <img src="static/grid-sort.png" alt="grid sort" height="150">
  <h1>Grid sort</h1>
  <p>Sort array of objects or numbers into a grid where items are sorted from biggest to lowest</p>
  <a href="https://npmjs.org/package/grid-sort">
    <img src="https://badgen.net/npm/v/grid-sort" alt="version" />
  </a>
  <a href="https://github.com/luisadame/grid-sort/tree/main/tests">
    <img src="https://img.shields.io/codecov/c/github/luisadame/grid-sort" alt="coverage" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=grid-sort">
    <img src="https://packagephobia.now.sh/badge?p=grid-sort" alt="install size" />
  </a>
</div>

## Introduction

In CSS there are multiple ways to achieve stunning layouts, the most populare systems to achieve this are Grid and Flex layout systems. These systems provide you with a set of properties to define layouts, however they depend on the order of the elements in the dom.

For simple binary choices this is great, however we may want a grid layout where elements fill the horizontal space based on items size. The ideal concept would be that grid or flex had properties to lay out items respecting their intrinsic size from greatest to lowest size, and filling out the gaps with items with smaller size.
I've tried to achieve this with only css but haven't come up with a way, so I decided to reach out to JavsScript and sort the items in that same manner,

### Visualization

Given a list of numbers:

```javascript
const list = [3, 2, 1, 2, 3, 1, 1, 1];
```

In a 4 column grid I'd like to have them sorted like this:

```javascript
const sortedList = [
  [3, 1],
  [1, 3],
  [2, 2],
  [1, 1],
];
```

Rows are filled with items that fill the 4 column rule, they are filled with biggest items first, and the space left with the next biggest item.
Rows compared themselves to the previous one to achieve a varied visual composition.

## Installation

This module is distributed via [npm](https://www.npmjs.com/) and should be installed as one of your project's `dependencies`:

```bash
# with yarn
yarn add grid-sort

# with npm
npm install grid-sort
```

## Usage

With a list of primitive numbers

```typescript
import { gridSort } from "grid-sort";

const items = [1, 1, 1, 2, 3, 3];

const sortedItems = gridSort({ items });

/*
  sortedItems -> [
    [3, 1],
    [1, 3],
    [2, 1]
  ]
*/
```

With a list of objects

```typescript
import { gridSort } from "grid-sort";

const images = [
  { id: 1, columns: 3 },
  { id: 2, columns: 2 },
  { id: 3, columns: 1 },
  { id: 4, columns: 1 },
  { id: 5, columns: 1 },
];

// define an accessor to get the property to check against
const accessor = (image: typeof items[number]) => image.columns;

const sortedItems = gridSort({ items, accessor });

/*
  sortedItems -> [
    [
      { id: 1, columns: 3 },
      { id: 3, columns: 1 }
    ],
    [
      { id: 2, columns: 2 },
      { id: 4, columns: 1 }
      { id: 5, columns: 1 }
    ]
  ]
*/
```
