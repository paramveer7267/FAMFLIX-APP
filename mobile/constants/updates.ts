export const updates = [
  {
  version: "1.2.3",
  date: "2025-11-13",
  title: "Splash Screen Added, Watchlist Fixes & UI Improvements",
  description:
    "This update introduces a new animated splash screen experience and includes important fixes to the Watchlist module. Several UI refinements have also been made to ensure smoother performance and a more polished experience.",

  updates: `
  • Added a new animated splash screen with improved logo transitions.
  • Implemented refined app startup flow for smoother navigation.
  • Enhanced UI responsiveness and layout consistency across screens.
  `,

  bugFixes: `
  • Fixed Watchlist delete issue where items were not being removed properly.
  • Resolved Watchlist 'Clear All' not functioning on some devices.
  • Addressed animation conflicts and gesture-handler issues affecting fast refresh.
  • Fixed safe area warnings by switching to react-native-safe-area-context.
  `,

  active: true,
},
{
    version: "1.1.2",
    date: "2025-11-05",
    title: "Minor Bug Fixes, UI Improvements & New Pages",
    description:
      "This update introduces new content sections including Browse, Movies, TV Shows, and Search — along with multiple UI improvements and bug fixes for smoother navigation and layout consistency.",

    updates: `
  • Added new Browse page for discovering trending movies and TV shows.
  • Introduced dedicated Movies and TV Shows pages with improved hero sections.
  • Implemented Search page with filters, live results, and clean dark UI.
  • Improved navigation bar visibility and behavior across devices.
  • Fixed favicon not showing correctly on some platforms.
  • Enhanced layout spacing and responsiveness across all screens.
  `,

    bugFixes: `
  • Fixed navigation button issue where it didn’t appear in APK builds.
  • Resolved favicon visibility issue on Android and web.
  • Fixed dropdown menu positioning issue in MoreOptionsMenu component.
  • Resolved table overflow issues in Dashboard page with scrollable container.
  `,

    active: false,
  },
  {
    version: `1.0.1`,
    date: "2025-11-04",
    title: "Minor Bug Fixes & UI Improvements",
    description:
      "Minor bug fixes including navigation button visibility, favicon appearance, dropdown alignment, and layout improvements.",

    updates: `
  • Improved navigation bar visibility and behavior across devices.
  • Fixed favicon not showing correctly on some platforms.
  `,

    bugFixes: `
  • Fixed navigation button issue where it didn’t appear in APK builds.
  • Resolved favicon visibility issue on Android and web.
  • Fixed dropdown menu positioning issue in MoreOptionsMenu component.
  • Resolved table overflow issues in Dashboard page with scrollable container.
  `,

    active: false,
  },
];
