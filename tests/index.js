import { test } from "uvu";
import * as assert from "uvu/assert";
import {
  getFillableItem,
  getSortedKeys,
  groupItemsByValue,
  makeGrid,
  rowsAreEqual,
} from "../index.js";

test("getSortedKeys", () => {
  const buckets = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getSortedKeys(buckets), [3, 2, 1].map(String));
});

test("getFillableItem", () => {
  const buckets = { 1: [1, 1, 1], 2: [2, 2], 3: [3, 3] };
  assert.equal(getFillableItem(buckets, 4), "3");
});

test("rowsAreEqual", () => {
  let rowA = [
    { id: "1", ratio: 3 },
    { id: "2", ratio: 1 },
  ];
  let rowB = [
    { id: "8", ratio: 3 },
    { id: "5", ratio: 1 },
  ];
  const accessor = (item) => item.ratio;
  assert.ok(rowsAreEqual(rowA, rowB, accessor));

  rowA = [
    { id: "1", ratio: 3 },
    { id: "2", ratio: 1 },
  ];
  rowB = [
    { id: "5", ratio: 1 },
    { id: "8", ratio: 3 },
  ];
  assert.not.ok(rowsAreEqual(rowA, rowB, accessor));
});

test("it sorts bucket of numbers", () => {
  const buckets = { 1: [1, 1, 1, 1, 1], 2: [2, 2], 3: [3, 3] };
  const sorted = makeGrid(buckets);
  const expected = [
    [3, 1],
    [1, 3],
    [2, 2],
    [1, 1, 1],
  ];
  assert.equal(sorted, expected);
});

test("groupItemsByValue", () => {
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
  const accessor = (item) => item.ratio;
  const itemsByValue = groupItemsByValue(items, accessor);
  const sorted = makeGrid(itemsByValue, 4, accessor);
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

test.run();
