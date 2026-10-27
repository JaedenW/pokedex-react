import { useSelection } from '../Utils/selection';
import { ChevronDownIcon } from './Icons';
import { buttonClass } from './ui';

/** A shortcut to the game and Pokédex dialog, for the Pokédex page banner. */
export default function DexPicker() {
  const { openSelector } = useSelection();
  return (
    <button
      type="button"
      onClick={openSelector}
      aria-haspopup="dialog"
      className={buttonClass('primary', 'md')}
    >
      Change game or Pokédex
      <ChevronDownIcon className="size-5" />
    </button>
  );
}
