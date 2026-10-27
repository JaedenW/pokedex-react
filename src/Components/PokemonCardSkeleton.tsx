// Placeholder with the same box as PokemonCard, so cards swap in without
// shifting the layout while their data loads
function PokemonCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="m-2 w-42 animate-pulse overflow-hidden rounded-lg bg-gray-50 shadow-md sm:m-4 sm:w-56"
    >
      {/* mt-5 matches the sprite's top margin, which collapses into this box */}
      <div className="mt-5 h-28 sm:h-32" />
      <div className="text-center">
        <div className="mx-auto mb-1 h-7 w-28 rounded bg-stone-200" />
        <div className="inline-flex px-0.5 pb-2 sm:px-1 sm:pt-1 sm:pb-3">
          <div className="h-7 w-16 rounded-md bg-stone-200 sm:h-8 lg:h-10" />
        </div>
      </div>
      <footer className="bg-[#FFCC00]/60 p-2 text-center font-bold text-transparent">
        #000
      </footer>
    </div>
  );
}

export default PokemonCardSkeleton;
