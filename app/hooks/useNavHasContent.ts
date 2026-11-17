/**
 * The nav drawer always has content in this brand theme: the approved
 * `IQRA_MENU` tree is rendered in both the desktop menu and the drawer, so the
 * toggle never needs to be hidden while a store menu is empty or loading.
 */
export function useNavHasContent(): boolean {
  return true;
}
