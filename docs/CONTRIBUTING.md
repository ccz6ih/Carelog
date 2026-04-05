# CareLog — Contributing Guide for AI Agents

> Rules and conventions for any agent or developer working on this codebase.

---

## Before You Write Any Code

1. Read `docs/ABOUT.md` — understand WHAT we're building and WHY
2. Read `docs/ARCHITECTURE.md` — understand HOW the code is structured
3. Read `docs/GLOSSARY.md` — understand the domain terminology
4. Check `types/index.ts` — understand the data model
5. Check `constants/Colors.ts` — use semantic color tokens, never hardcode hex

---

## Code Conventions

### General
- TypeScript strict mode — no `any` types unless absolutely unavoidable
- Functional components only — no class components
- Named exports for components, default exports for screens
- Absolute imports via `@/` alias (e.g., `@/components/ui/Button`)
- No inline styles for anything reusable — use StyleSheet.create()

### File Naming
- Components: PascalCase (`ClockButton.tsx`, `VisitCard.tsx`)
- Hooks: camelCase with `use` prefix (`useLocation.ts`, `useTimer.ts`)
- Services: camelCase (`evv.ts`, `api.ts`, `notifications.ts`)
- Constants: PascalCase (`Colors.ts`, `Typography.ts`, `Layout.ts`)
- Types: PascalCase interfaces in `types/index.ts`

### Component Patterns

```tsx
// GOOD — functional component, typed props, semantic colors
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface MyComponentProps {
  title: string;
  status: 'active' | 'inactive';
}

export default function MyComponent({ title, status }: MyComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={[Typography.h3, { color: Colors.textPrimary }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
  },
});
```

```tsx
// BAD — class component, hardcoded colors, inline styles, any types
class MyComponent extends React.Component<any> {
  render() {
    return (
      <View style={{ backgroundColor: '#142842', padding: 16 }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{this.props.title}</Text>
      </View>
    );
  }
}
```

---

## Screen Development Patterns

Every screen follows this structure:

1. **Section label** — spaced uppercase, teal or accent color (Typography.sectionLabel)
2. **Screen title** — h1 weight, white text
3. **Optional subtitle** — bodySm, secondary text color
4. **Content area** — cards, lists, or hero interaction
5. **SafeAreaView wrapper** — always, for notch/dynamic island safety

```tsx
export default function ExampleScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16 }}>
        <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>
          SECTION NAME
        </Text>
        <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
          Screen Title
        </Text>
        {/* Content here */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Navigation Rules

- Expo Router uses file-based routing in the `app/` directory
- Route groups: `(auth)` for unauthenticated, `(tabs)` for authenticated
- Use `router.replace()` for auth transitions (no back button to login)
- Use `router.push()` for drilling into detail screens
- Deep links use the `carelog://` scheme (configured in app.json)

---

## HIPAA / Security Checklist

Before merging ANY code, verify:

- [ ] No PHI (names, Medicaid IDs, visit records) in console.log statements
- [ ] No PHI in error messages sent to crash reporting
- [ ] No PHI in analytics events
- [ ] API calls use HTTPS (never HTTP, even in dev)
- [ ] Sensitive data stored via expo-secure-store, never AsyncStorage
- [ ] No hardcoded credentials, API keys, or tokens in source code
- [ ] User data access is scoped (caregiver sees only their own data)

---

## Adding a New Feature

1. Does it serve compliance, family connection, or revenue? If no, don't build it.
2. Add types to `types/index.ts` first
3. Add any new colors/tokens to `constants/` (never hardcode hex in components)
4. Build the component in `components/` or `components/ui/`
5. Wire it into the appropriate screen in `app/`
6. Update state in `store/useAppStore.ts` if needed
7. Add service logic in `services/` if it talks to an API
8. Update these docs if you change architecture

---

## Common Mistakes to Avoid

1. **Hardcoding colors** — Always use `Colors.xxx`, never `'#00D4AA'` in components
2. **Forgetting SafeAreaView** — Every screen needs it for notch safety
3. **Using AsyncStorage for sensitive data** — Use expo-secure-store instead
4. **Logging PHI** — Never console.log recipient names, Medicaid IDs, or visit data
5. **Class components** — We use functional components + hooks exclusively
6. **Ignoring offline states** — EVV submissions MUST work offline with retry queue
7. **Breaking the timer** — The clock-in timer must survive background/foreground cycles
8. **Skipping haptics** — Clock in/out MUST have haptic feedback (trust signal)
9. **Using "patient" or "client"** — Say "care recipient" or use their name
10. **Adding features without a revenue path** — Every feature must earn its place

---

## Testing Priority

In order of criticality:
1. **EVV auto-submit** — if this breaks, caregivers don't get paid
2. **Clock in/out with GPS** — the core interaction
3. **Authentication flow** — secure access to PHI
4. **Family notifications** — the retention mechanism
5. **Appreciation deep links** — the subscription offsetter
6. **UI/navigation** — everything else

---

*"Every feature earns its place or gets cut."*
