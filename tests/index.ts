import { test } from "uvu";
import * as assert from "uvu/assert";
import type { Buckets } from "../src/gridSort.js";
import {
  buildGridFromBuckets,
  getFillableItem,
  getSortedKeys,
  gridSort,
  groupItemsByValue,
  rowsAreEqual,
} from "../src/gridSort.js";

test("sorts object keys numerically in descending order", () => {
  const buckets = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getSortedKeys(buckets), [3, 2, 1].map(String));
});

test("gets best candidate for filling a column", () => {
  const bucketsA = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getFillableItem(bucketsA, 4), "3");

  const bucketsB = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getFillableItem(bucketsB, 1), "1");

  const bucketsC = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getFillableItem(bucketsC, 2), "2");

  const bucketsD = { 1: [1, 1, 1], 2: [2, 2], 3: [] };
  assert.equal(getFillableItem(bucketsD, 4), "2");

  const bucketsE = { 1: [1, 1, 1], 2: [], 3: [] };
  assert.equal(getFillableItem(bucketsE, 4), "1");

  const bucketsF = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getFillableItem(bucketsF, 2), "2");

  const bucketsG = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getFillableItem(bucketsG, 1), "1");
});

test("rows equality", () => {
  const [rowA, rowB] = [
    [
      { id: "1", ratio: 3 },
      { id: "2", ratio: 1 },
    ],
    [
      { id: "8", ratio: 3 },
      { id: "5", ratio: 1 },
    ],
  ];
  const accessor = (item: typeof rowA[number]) => item.ratio;
  assert.ok(rowsAreEqual(rowA, rowB, accessor));
  assert.not.ok(rowsAreEqual(rowA, rowB.reverse(), accessor));
});

test("it sorts bucket of numbers", () => {
  const buckets = {
    1: [1, 1, 1, 1, 1],
    2: [2, 2],
    3: [3, 3],
  } as Buckets<number>;
  const sorted = buildGridFromBuckets({
    buckets,
    columns: 4,
    accessor: undefined,
  });
  const expected = [
    [3, 1],
    [1, 3],
    [2, 2],
    [1, 1, 1],
  ];
  assert.equal(sorted, expected);
});

test("it builds buckets from array of items", () => {
  const items = [
    { id: "1", ratio: 3 },
    { id: "2", ratio: 1 },
    { id: "3", ratio: 2 },
    { id: "4", ratio: 2 },
    { id: "5", ratio: 1 },
    { id: "7", ratio: 1 },
    { id: "8", ratio: 3 },
  ];
  const itemsByValue = groupItemsByValue(items, (item) => item.ratio);
  assert.equal(itemsByValue, {
    1: [
      { id: "2", ratio: 1 },
      { id: "5", ratio: 1 },
      { id: "7", ratio: 1 },
    ],
    2: [
      { id: "3", ratio: 2 },
      { id: "4", ratio: 2 },
    ],
    3: [
      { id: "1", ratio: 3 },
      { id: "8", ratio: 3 },
    ],
  });
});

test("it sorts bucket of objects", () => {
  const items = [
    { id: "1", ratio: 3 },
    { id: "2", ratio: 1 },
    { id: "3", ratio: 2 },
    { id: "4", ratio: 2 },
    { id: "5", ratio: 1 },
    { id: "7", ratio: 1 },
    { id: "8", ratio: 3 },
  ];
  const accessor = (item: typeof items[number]) => item.ratio;
  const itemsByValue = groupItemsByValue(items, accessor);
  const sorted = buildGridFromBuckets({
    buckets: itemsByValue,
    columns: 4,
    accessor,
  });
  const expected = [
    [
      { id: "1", ratio: 3 },
      { id: "2", ratio: 1 },
    ],
    [
      { id: "5", ratio: 1 },
      { id: "8", ratio: 3 },
    ],
    [
      { id: "3", ratio: 2 },
      { id: "4", ratio: 2 },
    ],
    [{ id: "7", ratio: 1 }],
  ];
  assert.equal(sorted, expected);
});

test("it sorts bucket of objects with different columns", () => {
  const items = [
    { id: "1", ratio: 3 },
    { id: "2", ratio: 1 },
    { id: "3", ratio: 2 },
    { id: "4", ratio: 2 },
    { id: "5", ratio: 1 },
    { id: "7", ratio: 1 },
    { id: "8", ratio: 3 },
  ];
  const accessor = (item: typeof items[number]) => item.ratio;
  const itemsByValue = groupItemsByValue(items, accessor);
  const sorted = buildGridFromBuckets({
    buckets: itemsByValue,
    columns: 5,
    accessor,
  });
  const expected = [
    [
      { id: "1", ratio: 3 },
      { id: "3", ratio: 2 },
    ],
    [
      { id: "4", ratio: 2 },
      { id: "8", ratio: 3 },
    ],
    [
      { id: "2", ratio: 1 },
      { id: "5", ratio: 1 },
      { id: "7", ratio: 1 },
    ],
  ];
  assert.equal(sorted, expected);
});

test("it sorts an array of items into a grid", () => {
  const items = [
    { id: "1", ratio: 3 },
    { id: "2", ratio: 1 },
    { id: "3", ratio: 2 },
    { id: "4", ratio: 2 },
    { id: "5", ratio: 1 },
    { id: "7", ratio: 1 },
    { id: "8", ratio: 3 },
  ];
  const accessor = (item: typeof items[number]) => item.ratio;
  const sorted = gridSort({
    items,
    columns: 5,
    accessor,
  });
  const expected = [
    [
      { id: "1", ratio: 3 },
      { id: "3", ratio: 2 },
    ],
    [
      { id: "4", ratio: 2 },
      { id: "8", ratio: 3 },
    ],
    [
      { id: "2", ratio: 1 },
      { id: "5", ratio: 1 },
      { id: "7", ratio: 1 },
    ],
  ];
  assert.equal(sorted, expected);
});

test.run();
