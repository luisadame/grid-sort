const keysOf = (object) => Object.keys(object);
const itemsInBucket = (buckets, key) => { var _a; return ((_a = buckets[key]) === null || _a === void 0 ? void 0 : _a.length) || 0 > 0; };
const rowQuantity = (row, accessor) => row.reduce((acc, item) => {
    if (accessor && typeof item === "object") {
        const value = accessor(item);
        return acc + value;
    }
    return acc + Number(item);
}, 0);
export function getSortedKeys(buckets) {
    return keysOf(buckets).sort((a, z) => z - a);
}
export function calculateItemsLeft(buckets, columns, accessor) {
    return Object.values(buckets)
        .reduce((acc, bucket) => {
        const bucketQuantity = bucket.map(value => {
            if (accessor && typeof value === 'object') {
                return accessor(value);
            }
            return value;
        }).filter(value => value <= columns).length;
        return acc + bucketQuantity;
    }, 0);
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
        else {
            key = Number(item);
        }
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
    var _a;
    const grid = [];
    if (columns <= 0)
        return grid;
    let itemsLeft;
    while ((itemsLeft = calculateItemsLeft(buckets, columns, accessor)) > 0) {
        const row = [];
        let key;
        while ((key = getFillableItem(buckets, columns - rowQuantity(row, accessor))) &&
            rowQuantity(row, accessor) < columns &&
            itemsLeft >= 1) {
            const item = (_a = buckets[key]) === null || _a === void 0 ? void 0 : _a.shift();
            if (item) {
                row.push(item);
            }
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