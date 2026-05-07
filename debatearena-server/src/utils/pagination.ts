export function withCursorPagination<T>(
  data: T[],
  limit: number,
  cursorKey: keyof T = 'id' as keyof T
) {
  let nextCursor: string | number | null = null;

  // Prisma queries typically ask for `limit + 1` to check if there's a next page
  if (data.length > limit) {
    const nextItem = data.pop(); // Remove the extra item
    if (nextItem && nextItem[cursorKey] !== undefined) {
      nextCursor = nextItem[cursorKey] as unknown as string | number;
    }
  }

  return {
    data,
    nextCursor,
  };
}
