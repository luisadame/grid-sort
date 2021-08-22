export type Bucket<T> = T[];
export type Buckets<T> = { [key: number]: Bucket<T> };
export type Accessor<T extends object> = (item: T) => number;

const keysOf = <T extends object>(object: T) =>
  Object.keys(object) as (keyof typeof object)[];

const itemsInBucket = <T extends unknown>(
  buckets: Buckets<T>,
  key: keyof Buckets<T>
) => buckets[key]?.length || 0 > 0;

const rowQuantity = <T extends object | number>(
  row: T[],
  accessor: T extends object ? Accessor<T> : undefined
) =>
  row.reduce((acc, item) => {
    if (accessor && typeof item === "object") {
      const value = accessor(item);
      return acc + value;
    }

    if (typeof item === "number") {
      return acc + item;
    }

    return acc;
  }, 0);

export function getSortedKeys<T>(buckets: Buckets<T>) {
  return keysOf(buckets).sort((a, z) => z - a);
}

export function calculateItemsLeft<T>(buckets: Buckets<T>) {
  return Object.values(buckets).reduce((acc, bucket) => acc + bucket.length, 0);
}

export function rowsAreEqual<T extends object | number>(
  rowA: T[],
  rowB: T[],
  accessor: T extends object ? Accessor<T> : undefined
) {
  return rowA.every((value, index) => {
    let itemA = value;
    let itemB = rowB[index] as T;

    if (accessor && typeof itemA === "object" && typeof itemB === "object") {
      return accessor(itemA) === accessor(itemB);
    }

    return itemA === itemB;
  });
}

export function groupItemsByValue<T extends object | number>(
  items: T[],
  accessor: T extends object ? Accessor<T> : undefined
) {
  const groups: Buckets<T> = {};
  for (const item of items) {
    let key: number | undefined;

    if (accessor && typeof item === "object") {
      key = accessor(item);
    } else if (typeof item === "number") {
      key = item;
    }

    if (key === undefined) continue;

    const group = groups[key];

    if (group && Array.isArray(group)) {
      group.push(item);
    } else {
      groups[key] = [item];
    }
  }
  return groups;
}

export function getFillableItem<T>(buckets: Buckets<T>, maxKey: number) {
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
}

export function buildGridFromBuckets<T extends object | number>({
  buckets,
  columns,
  accessor,
}: {
  buckets: Buckets<T>;
  columns: number;
  accessor: T extends object ? Accessor<T> : undefined;
}) {
  const grid = [];
  let itemsLeft: number;

  while ((itemsLeft = calculateItemsLeft(buckets)) > 0) {
    const row: T[] = [];
    let key: number;

    while (
      (key = getFillableItem(buckets, columns - rowQuantity(row, accessor))) &&
      rowQuantity(row, accessor) < columns &&
      itemsLeft >= 1
    ) {
      const bucket = buckets[key];
      if (!bucket) continue;
      const item = bucket.shift();
      if (!item) break;
      row.push(item);
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

export function gridSort<T extends object | number>({
  items,
  columns = 4,
  accessor,
}: {
  items: T[];
  columns?: number;
  accessor: T extends object ? Accessor<T> : never;
}) {
  const buckets = groupItemsByValue(items, accessor);
  return buildGridFromBuckets({ buckets, columns, accessor });
}
