export declare type Bucket<T> = T[];
export declare type Buckets<T> = {
    [key: number]: Bucket<T>;
};
export declare type Accessor<T extends object> = (item: T) => number;
export declare function getSortedKeys<T>(buckets: Buckets<T>): number[];
export declare function calculateItemsLeft<T>(buckets: Buckets<T>, columns: number, accessor?: T extends object ? Accessor<T> : undefined): number;
export declare function rowsAreEqual<T extends object | number>(rowA: T[], rowB: T[], accessor?: T extends object ? Accessor<T> : undefined): boolean;
export declare function groupItemsByValue<T extends object | number>(items: T[], accessor?: T extends object ? Accessor<T> : undefined): Buckets<T>;
export declare function getFillableItem<T>(buckets: Buckets<T>, maxKey: number): number;
export declare function buildGridFromBuckets<T extends object | number>({ buckets, columns, accessor, }: {
    buckets: Buckets<T>;
    columns: number;
    accessor?: T extends object ? Accessor<T> : undefined;
}): T[][];
export declare function gridSort<T extends object | number>({ items, columns, accessor, }: {
    items: T[];
    columns?: number;
    accessor?: T extends object ? Accessor<T> : never;
}): T[][];
