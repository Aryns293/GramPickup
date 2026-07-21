import React from 'react';

export const SkeletonLine = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`${w} ${h} bg-gray-100 dark:bg-gray-800 rounded animate-pulse`} />
);

export const SkeletonCard = () => (
  <div className="card p-5 animate-pulse space-y-3">
    <SkeletonLine w="w-1/2" h="h-4" />
    <SkeletonLine w="w-3/4" h="h-3" />
    <SkeletonLine w="w-1/3" h="h-3" />
  </div>
);

export const SkeletonTable = ({ rows = 3 }) => (
  <div className="divide-y divide-gray-100 dark:divide-gray-800">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
        <SkeletonLine w="w-1/3" h="h-4" />
        <SkeletonLine w="w-1/4" h="h-4" />
        <SkeletonLine w="w-1/5" h="h-4" />
      </div>
    ))}
  </div>
);

export const SkeletonStat = () => (
  <div className="card p-6 animate-pulse">
    <SkeletonLine w="w-1/2" h="h-3" />
    <div className="mt-3"><SkeletonLine w="w-1/3" h="h-8" /></div>
  </div>
);
