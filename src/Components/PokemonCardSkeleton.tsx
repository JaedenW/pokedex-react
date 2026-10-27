// Placeholder with the same boxes as PokemonCard, so cards swap in without
// shifting the layout while their data loads
function PokemonCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse overflow-hidden ds-frame">
      <div className="h-36 bg-pk-line/30" />
      <div className="px-3 pt-3 pb-3.5 text-center">
        <div className="mx-auto w-28 rounded bg-pk-line t-h3 text-transparent">
          .
        </div>
        <div className="mt-2 flex h-7 justify-center">
          <div className="h-7 w-20 rounded-lg bg-pk-line" />
        </div>
      </div>
    </div>
  );
}

export default PokemonCardSkeleton;
