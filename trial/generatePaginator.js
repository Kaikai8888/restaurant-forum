const PAGINATOR_LENGTH = 5

function generatePaginator(totalPages, curPage) {
  let start
  if (curPage > totalPages || totalPages <= PAGINATOR_LENGTH) {
    start = 1
  } else if (curPage < totalPages / 2) {
    const leftLength = Math.floor((PAGINATOR_LENGTH - 1) / 2)
    start = curPage - 1 < leftLength ? 1 : curPage - leftLength
  } else {
    const rightLength = Math.ceil((PAGINATOR_LENGTH - 1) / 2)
    start = totalPages - curPage < rightLength ? totalPages - PAGINATOR_LENGTH : curPage + rightLength
  }

  return Array.from({ length: Math.min(totalPages, PAGINATOR_LENGTH) }).map((_, i) => start + i)
}