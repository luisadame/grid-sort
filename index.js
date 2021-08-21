export const getSortedKeys = (buckets) =>
  Object.keys(buckets).sort((a, z) => z - a);

const calculateItemsLeft = (buckets) =>
  Object.values(buckets).reduce((acc, bucket) => acc + bucket.length, 0);

const itemsInBucket = (buckets, key) => buckets[key].length > 0;

const rowQuantity = (row, accessor) =>
  row.reduce((acc, item) => {
    const value = accessor ? accessor(item) : item;
    return acc + value;
  }, 0);

export const rowsAreEqual = (rowA, rowB, accessor) =>
  rowA.every((value, index) => {
    let itemA = value;
    let itemB = rowB[index];

    if (accessor) {
      itemA = accessor(itemA);
      itemB = accessor(itemB);
    }

    return itemA === itemB;
  });

/**
 * @param {Array<*>} items
 * @param {(item) => * | undefined} accessor
 */
export function groupItemsByValue(items, accessor) {
  const groups = {};
  for (const item of items) {
    let key = item;
    if (accessor) {
      key = accessor(item);
    }
    groups[key] = groups[key] ? [...groups[key], item] : [item];
  }
  return groups;
}

export const getFillableItem = (buckets, maxKey) => {
  let currentBiggestKey = 0;
  const sortedKeys = getSortedKeys(buckets);
  for (const key of sortedKeys) {
    if (
      itemsInBucket(buckets, key) &&
      key > currentBiggestKey &&
      key <= maxKey
    ) {
      currentBiggestKey = key;
    }
  }
  return currentBiggestKey;
};

/**
 *
 * @param {Object<number, Array<*>>} buckets
 * @param {Number} columns
 * @param {(item) => *} accessor
 */
export function makeGrid(buckets, columns = 4, accessor) {
  const grid = [];
  let itemsLeft;

  while ((itemsLeft = calculateItemsLeft(buckets)) > 0) {
    const row = [];
    let key;
    while (
      (key = getFillableItem(buckets, columns - rowQuantity(row, accessor))) &&
      rowQuantity(row, accessor) < columns &&
      itemsLeft >= 1
    ) {
      row.push(buckets[key].shift());
    }

    // randomize current row if previous row has same layout
    const previousRow = grid[grid.length - 1];
    if (previousRow && rowsAreEqual(row, previousRow, accessor)) {
      row.reverse();
    }

    grid.push(row);
  }

  return grid;
}
