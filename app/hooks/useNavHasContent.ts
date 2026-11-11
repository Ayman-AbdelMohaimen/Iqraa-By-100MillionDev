import { useQuery } from '@tanstack/react-query';
import { menu } from '@salla.sa/twilight-theme-engine/api/menu';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { pruneUntitled } from '../lib/menuOverflow';
import { IQRA_MENU } from '../lib/brandMenu';

/**
 * Whether the nav drawer (`HeaderNav`) has anything to show: the store's header
 * menu, or one of its footer switchers (language, branch, currency). Its triggers
 * hide when it would open empty. True until the menu loads, so they don't flash
 * out and back in on stores that have one.
 */
export function useNavHasContent(): boolean {
  const { store } = useTwilight();
  const { data: items, isSuccess } = useQuery(menu.queries.header());
  const hasSwitchers = Boolean(
    store?.settings?.is_multilingual || store?.scope || store?.settings?.currencies_enabled
  );
  // The brand menu in `lib/brandMenu` stands in when the store has no header
  // menu (the dev store has none), matching `HeaderMainMenu`/`HeaderNav`.
  const hasMenu = pruneUntitled(items ?? []).length > 0 || IQRA_MENU.length > 0;
  return !isSuccess || hasSwitchers || hasMenu;
}
