import { test } from "uvu";
import * as assert from "uvu/assert";
import { gridSort } from "../src/index.js";
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
