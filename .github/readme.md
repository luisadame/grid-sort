<div align="center">
  <br />
  <img src="/static/grid-sort.png" alt="grid sort" height="150" />
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

In CSS there are multiple ways to achieve stunning layouts, the most popular systems to achieve this are Grid and Flex layout systems. These systems provide you with a set of properties to define layouts, however they depend on the order of the elements in the dom.

For simple binary choices this is great, however we may want a grid layout where elements fill the horizontal space based on their item size. The ideal concept would be that grid or flex had properties to lay out items respecting their intrinsic size from greatest to lowest size, and filling out the gaps with items with smaller size.
I've tried to achieve this with only css but haven't come up with a way, so I decided to reach out to JavsScript and sort the items in that same manner.

### Visualization

To better understand the case above let's introduce an example.
Imagine a list of numbers which represent the columns they would take in a grid of four columns:

<div align="center">
  <img alt="Unsorted list of rectangles that contain a number representing the column space" src="/static/unsorted-grid.png" />
</div>

```javascript
const list = [3, 2, 1, 2, 3, 1, 1, 1];
```

The numbers are totally random, because they may come from any dataset you'd have and these may not be sorted for a grid, perhaps they are sorted by insertion order in your database, size, date created, or whatever.
Therefore to have them sorted for a grid the sorting algorithm should respect a few rules:

1. Move largest objects to the top of the grid
2. Fill the gaps they leave in the current row with whatever largest object we can take
3. Always respect the number of columns
4. If two rows are visually the same swap position of items to create a better space distribution

<div align="center">
  <img alt="Sorted list of rectangles that contain a number representing the column space they take on a grid, and they are layed out based on the algorithm above" src="/static/sorted-grid.png"/>
</div>

```javascript
const sortedList = [
  [3, 1],
  [1, 3],
  [2, 2],
  [1, 1],
];
```

The sorted list is a two dimensional array that represents a grid where rows are filled using the rules above. The fourth rule can be seen on the second row, where if the second row didn't follow the fourth rule it would have the 3 column item first and the 1 column item last, but as we have an identical row before this one lets swap the items.

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

With a list of objects we need to provide another option to our `gridSort` function. An `accessor` option is required for list of objects because we can compare objects we need you to provide a way to access a number within the objects that represents the column an object would take.

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

### Options

The exported function `gridSort` accepts an object that has three properties which represent required data or options.

#### items (required)

It represents the list of items you want to sort

#### accessor

If you give an array of objects as items you'll have to pass this option too, as I described above, this option is necessary to obtain a number that represents the number of columns an item in your list might take

#### columns

Defines the number of columns your grid would have

## Contributions

You are more than welcome to report any issues or suggest new features.
Just create an issue with the bug or enhancement label and we'll discuss further actions. Thank you in advance for even considering contributing to this.

## License

MIT
