const keysOf = (object) => Object.keys(object);
const itemsInBucket = (buckets, key) => { var _a; return ((_a = buckets[key]) === null || _a === void 0 ? void 0 : _a.length) || 0 > 0; };
const rowQuantity = (row, accessor) => row.reduce((acc, item) => {
    if (accessor && typeof item === "object") {
        const value = accessor(item);
        return acc + value;
    }
    if (typeof item === "number") {
        return acc + item;
    }
    return acc;
}, 0);
export function getSortedKeys(buckets) {
    return keysOf(buckets).sort((a, z) => z - a);
}
export function calculateItemsLeft(buckets) {
    return Object.values(buckets).reduce((acc, bucket) => acc + bucket.length, 0);
}
export function rowsAreEqual(rowA, rowB, accessor) {
    return rowA.every((value, index) => {
        let itemA = value;
        let itemB = rowB[index];
        if (accessor && typeof itemA === "object" && typeof itemB === "object") {
            return accessor(itemA) === accessor(itemB);
        }
        return itemA === itemB;
    });
}
export function groupItemsByValue(items, accessor) {
    const groups = {};
    for (const item of items) {
        let key;
        if (accessor && typeof item === "object") {
            key = accessor(item);
        }
        else if (typeof item === "number") {
            key = item;
        }
        if (key === undefined)
            continue;
        const group = groups[key];
        if (group && Array.isArray(group)) {
            group.push(item);
        }
        else {
            groups[key] = [item];
        }
    }
    return groups;
}
export function getFillableItem(buckets, maxKey) {
    let currentBiggestKey = 0;
    const sortedKeys = getSortedKeys(buckets);
    for (const key of sortedKeys) {
        if (itemsInBucket(buckets, key) &&
            key > currentBiggestKey &&
            key <= maxKey) {
            currentBiggestKey = key;
        }
    }
    return currentBiggestKey;
}
export function buildGridFromBuckets({ buckets, columns, accessor, }) {
    const grid = [];
    let itemsLeft;
    while ((itemsLeft = calculateItemsLeft(buckets)) > 0) {
        const row = [];
        let key;
        while ((key = getFillableItem(buckets, columns - rowQuantity(row, accessor))) &&
            rowQuantity(row, accessor) < columns &&
            itemsLeft >= 1) {
            const bucket = buckets[key];
            if (!bucket)
                continue;
            const item = bucket.shift();
            if (!item)
                break;
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
export function gridSort({ items, columns = 4, accessor, }) {
    const buckets = groupItemsByValue(items, accessor);
    return buildGridFromBuckets({ buckets, columns, accessor });
}
//# sourceMappingURL=gridSort.js.map