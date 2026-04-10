import type { RecipeDetail } from "../types";

export const componentComposition: RecipeDetail = {
  slug: "component-composition",
  title: "Component Composition",
  breadcrumbCategory: "Foundations",
  description: "How components combine and communicate — children props, slot patterns, and why composition beats deep prop drilling.",
  lastUpdated: "Apr 8, 2026",
  principle: {
    text: "Prop drilling happens when you pass data through multiple components that do not use it — just to get it to a component deep in the tree. Composition solves this differently: instead of passing data down, you pass components down. The parent controls what gets rendered, and children receive exactly what they need directly.",
    tip: "When you find yourself adding a prop to a component just to pass it further down, stop. That is the signal to use composition instead.",
  },
  rules: [
    {
      title: "Use children for flexible content",
      description: "The children prop lets a parent inject content into a component without the component needing to know what it is.",
    },
    {
      title: "Use named slots for multiple injection points",
      description: "When you need more than one place to inject content (header + footer + body), use named props instead of children.",
    },
    {
      title: "Prefer composition over configuration",
      description: "A component that accepts children is more flexible than one with 10 props controlling its internals. Compose behavior, do not configure it.",
    },
    {
      title: "Keep components focused",
      description: "Each component does one thing. Composition is how you build complex UIs from simple, focused pieces.",
    },
  ],
  pattern: {
    filename: "components/Card.tsx — slot composition pattern",
    code: `// ❌ Prop drilling — Card needs to know about title, footer, etc.
<Card
  title="Recipe"
  subtitle="Foundations"
  footer={<Button>View</Button>}
  headerIcon="layers"
/>

// ✅ Composition — Card just provides structure
<Card>
  <Card.Header>
    <span>Foundations</span>
    <h2>Recipe</h2>
  </Card.Header>
  <Card.Body>
    Content goes here
  </Card.Body>
  <Card.Footer>
    <Button>View</Button>
  </Card.Footer>
</Card>

// The Card implementation
interface CardProps { children: React.ReactNode }
interface CardHeaderProps { children: React.ReactNode }

function Card({ children }: CardProps) {
  return <div className="rounded-xl border bg-white">{children}</div>;
}

function CardHeader({ children }: CardHeaderProps) {
  return <div className="p-4 border-b">{children}</div>;
}

Card.Header = CardHeader;
Card.Body = ({ children }: CardProps) => <div className="p-4">{children}</div>;
Card.Footer = ({ children }: CardProps) => <div className="p-4 border-t">{children}</div>;`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js, composition works the same way. Server Components can pass Client Components as children — this is how you keep server/client boundaries clean. See the starter template: github.com/sindev08/react-principles-nextjs → src/shared/components/PageLayout.tsx and src/ui/Card.tsx",
      filename: "shared/components/PageLayout.tsx — from react-principles-nextjs starter",
      code: `// Named slots pattern — multiple injection points via named props
interface PageLayoutProps {
  header?: React.ReactNode;   // slot for navbar/header
  sidebar?: React.ReactNode;  // slot for sidebar navigation
  children: React.ReactNode;  // main content area
}

export function PageLayout({ header, sidebar, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {header && <header className="border-b">{header}</header>}
      <div className="flex flex-1">
        {sidebar && <aside className="w-64 shrink-0 border-r">{sidebar}</aside>}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// Usage in a Server Component page:
export default async function UsersPage() {
  return (
    <PageLayout
      header={<Navbar />}
      sidebar={<Sidebar items={menuItems} />}
    >
      {/* Client Component as children — clean server/client boundary */}
      <UserList />
    </PageLayout>
  );
}`,
    },
    vite: {
      description: "In Vite, all components are client-side. Composition is the primary tool for managing component complexity without prop drilling.",
      filename: "features/cookbook/components/RecipeLayout.tsx",
      code: `interface RecipeLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function RecipeLayout({ header, sidebar, children }: RecipeLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b">{header}</header>
      <div className="flex max-w-7xl mx-auto">
        <aside className="w-64 shrink-0">{sidebar}</aside>
        <main className="flex-1 px-8">{children}</main>
      </div>
    </div>
  );
}

// Usage in a route component
export function RecipePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: detail } = useRecipeDetail(slug!);

  if (!detail) return null;

  return (
    <RecipeLayout
      header={<RecipeHeader title={detail.title} />}
      sidebar={<RecipeToc sections={detail.sections} />}
    >
      <RecipeContent detail={detail} />
    </RecipeLayout>
  );
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View composition components in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/blob/main/src/shared/components/PageLayout.tsx",
  },
};
