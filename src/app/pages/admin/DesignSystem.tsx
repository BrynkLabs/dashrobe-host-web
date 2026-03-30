import { useState, useRef, useCallback, type ReactNode } from "react";

function copyToClipboard(text: string) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch {
    // silently fail
  }
  document.body.removeChild(textarea);
}

import {
  Copy,
  Check,
  Palette,
  Type,
  RectangleHorizontal,
  TextCursorInput,
  ToggleLeft,
  ListChecks,
  CircleDot,
  Tag,
  CreditCard,
  LayoutGrid,
  SlidersHorizontal,
  AlertTriangle,
  UserCircle,
  Table2,
  Minus,
  ChevronDown,
  MessageSquare,
  Loader2,
  Search,
  Mail,
  Star,
  BarChart3,
  Layers,
  Info,
  PanelTop,
  BookOpen,
  Code2,
  FileCode,
  Paintbrush,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { Slider } from "../../components/ui/slider";
import { Skeleton } from "../../components/ui/skeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";

// ─── Code Block with Copy ────────────────────────────────────────
function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group rounded-[10px] overflow-hidden border border-border bg-[#0F0538]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0F0538] border-b border-white/10">
        <span className="text-white/50" style={{ fontSize: "11px", fontWeight: 500 }}>{language}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
          style={{ fontSize: "11px" }}
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto" style={{ fontSize: "12.5px", lineHeight: "1.7" }}>
        <code className="text-[#e2e8f0]">{code}</code>
      </pre>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────
function DocSection({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: typeof Palette;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-8 h-8 rounded-[10px] bg-[#220E92]/8 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#220E92]" />
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{title}</h2>
      </div>
      <p className="text-muted-foreground mb-5 ml-11" style={{ fontSize: "13px" }}>{description}</p>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

// ─── Code Format Tabs ─────────────────────────────────────────────
type CodeFormat = "react" | "html" | "css";
const codeFormatMeta: Record<CodeFormat, { label: string; icon: typeof Code2; lang: string }> = {
  react: { label: "React", icon: Code2, lang: "tsx" },
  html: { label: "HTML", icon: FileCode, lang: "html" },
  css: { label: "CSS", icon: Paintbrush, lang: "css" },
};

function CodeTabs({ codes }: { codes: Partial<Record<CodeFormat, string>> }) {
  const available = (Object.keys(codes) as CodeFormat[]).filter((k) => codes[k]);
  const [activeTab, setActiveTab] = useState<CodeFormat>(available[0] || "react");
  const current = codes[activeTab] || "";
  const meta = codeFormatMeta[activeTab];

  if (available.length === 0) return null;

  return (
    <div className="space-y-0">
      {available.length > 1 && (
        <div className="flex items-center gap-1 mb-2">
          {available.map((fmt) => {
            const m = codeFormatMeta[fmt];
            const Icon = m.icon;
            const isActive = activeTab === fmt;
            return (
              <button
                key={fmt}
                onClick={() => setActiveTab(fmt)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#220E92] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                style={{ fontSize: "11.5px", fontWeight: isActive ? 600 : 500 }}
              >
                <Icon className="w-3 h-3" />
                {m.label}
              </button>
            );
          })}
        </div>
      )}
      <CodeBlock code={current} language={meta.lang} />
    </div>
  );
}

// ─── Preview + Code card ──────────────────────────────────────────
function ComponentCard({
  title,
  preview,
  code,
  htmlCode,
  cssCode,
}: {
  title?: string;
  preview: ReactNode;
  code: string;
  htmlCode?: string;
  cssCode?: string;
}) {
  const [showCode, setShowCode] = useState(false);
  const codes: Partial<Record<CodeFormat, string>> = { react: code };
  if (htmlCode) codes.html = htmlCode;
  if (cssCode) codes.css = cssCode;

  return (
    <div className="rounded-[12px] border border-border bg-card overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{title}</span>
        </div>
      )}
      <div className="p-5">{preview}</div>
      <div className="border-t border-border">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/30"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {showCode ? "Hide Code" : "View Code"}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCode ? "rotate-180" : ""}`} />
        </button>
        {showCode && (
          <div className="px-4 pb-4">
            <CodeTabs codes={codes} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────
function PropsTable({ rows }: { rows: { prop: string; type: string; default?: string; description: string }[] }) {
  return (
    <div className="rounded-[10px] border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/40 border-b border-border">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5">
                <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>{r.prop}</code>
              </td>
              <td className="px-4 py-2.5">
                <code className="text-muted-foreground" style={{ fontSize: "12px" }}>{r.type}</code>
              </td>
              <td className="px-4 py-2.5">
                <code className="text-muted-foreground" style={{ fontSize: "12px" }}>{r.default || "—"}</code>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground" style={{ fontSize: "12.5px" }}>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Color Swatch ──────────────────────────────────────────────────
function ColorSwatch({ name, cssVar, hex, textColor = "#fff" }: { name: string; cssVar: string; hex: string; textColor?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        copyToClipboard(cssVar);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="group flex flex-col rounded-[10px] overflow-hidden border border-border hover:shadow-md transition-shadow bg-card"
    >
      <div className="h-16 flex items-end justify-between px-3 pb-2" style={{ backgroundColor: hex, color: textColor }}>
        <span style={{ fontSize: "11px", fontWeight: 600 }}>{name}</span>
        {copied && <span style={{ fontSize: "10px" }} className="text-white/80">Copied!</span>}
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{hex}</span>
        <code className="text-muted-foreground" style={{ fontSize: "10px" }}>{cssVar}</code>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SIDEBAR NAV ITEMS
// ══════════════���════════════════════════════════════════════════════
const sections = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "buttons", label: "Button", icon: RectangleHorizontal },
  { id: "inputs", label: "Input", icon: TextCursorInput },
  { id: "textarea", label: "Textarea", icon: MessageSquare },
  { id: "select", label: "Select", icon: ChevronDown },
  { id: "checkbox", label: "Checkbox", icon: ListChecks },
  { id: "radio", label: "Radio Group", icon: CircleDot },
  { id: "switch", label: "Switch", icon: ToggleLeft },
  { id: "badge", label: "Badge", icon: Tag },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "tabs", label: "Tabs", icon: LayoutGrid },
  { id: "dialog", label: "Dialog", icon: PanelTop },
  { id: "tooltip", label: "Tooltip", icon: Info },
  { id: "accordion", label: "Accordion", icon: Layers },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "slider", label: "Slider", icon: SlidersHorizontal },
  { id: "alert", label: "Alert", icon: AlertTriangle },
  { id: "avatar", label: "Avatar", icon: UserCircle },
  { id: "table", label: "Table", icon: Table2 },
  { id: "separator", label: "Separator", icon: Minus },
  { id: "skeleton", label: "Skeleton", icon: Loader2 },
  { id: "label", label: "Label", icon: Tag },
];

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export function DesignSystem() {
  const [active, setActive] = useState("colors");
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex gap-8" ref={containerRef}>
      {/* Sidebar navigation */}
      <nav className="hidden lg:block w-[200px] shrink-0 self-start sticky top-0 h-[calc(100vh-120px)] overflow-y-auto pb-8 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,14,146,0.15) transparent" }}>
        <div className="mb-4">
          <span className="text-muted-foreground" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Components</span>
        </div>
        <div className="space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left ${
                active === s.id
                  ? "bg-[#220E92]/8 text-[#220E92]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={{ fontSize: "12.5px", fontWeight: active === s.id ? 600 : 400 }}
            >
              <s.icon className="w-3.5 h-3.5 shrink-0" />
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-14 pb-20">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#220E92] to-[#4318ca] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 800 }}>Design System</h1>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                Dashrobe component library &mdash; copy, paste, and build.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-[12px] bg-[#220E92]/5 border border-[#220E92]/10">
            <p style={{ fontSize: "13px", lineHeight: "1.7" }}>
              All components are built with <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>Radix UI</code> primitives,
              styled with <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>Tailwind CSS v4</code>, and
              use <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>class-variance-authority</code> for variants.
              Import from <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>@/components/ui/*</code>.
              Every component includes code snippets in <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>React</code>,
              <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>HTML</code>, and
              <code className="bg-[#220E92]/8 text-[#220E92] px-1.5 py-0.5 rounded-md" style={{ fontSize: "12px", fontWeight: 600 }}>CSS</code> &mdash; switch between formats using the tabs above each code block.
            </p>
          </div>
        </div>

        {/* ─── COLORS ─────────────────────────────────────────── */}
        <DocSection id="colors" icon={Palette} title="Colors" description="Design tokens from the Dashrobe theme. Click any swatch to copy the CSS variable.">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <ColorSwatch name="Primary" cssVar="var(--primary)" hex="#220E92" />
            <ColorSwatch name="Accent" cssVar="var(--accent)" hex="#FFC100" textColor="#1a1a2e" />
            <ColorSwatch name="Background" cssVar="var(--background)" hex="#F5F6FA" textColor="#1a1a2e" />
            <ColorSwatch name="Card" cssVar="var(--card)" hex="#ffffff" textColor="#1a1a2e" />
            <ColorSwatch name="Foreground" cssVar="var(--foreground)" hex="#1a1a2e" />
            <ColorSwatch name="Muted" cssVar="var(--muted)" hex="#f0f0f5" textColor="#6b6b80" />
            <ColorSwatch name="Muted FG" cssVar="var(--muted-foreground)" hex="#6b6b80" />
            <ColorSwatch name="Destructive" cssVar="var(--destructive)" hex="#ef4444" />
            <ColorSwatch name="Success" cssVar="var(--success)" hex="#10b981" />
            <ColorSwatch name="Border" cssVar="var(--border)" hex="rgba(0,0,0,0.08)" textColor="#333" />
            <ColorSwatch name="Ring" cssVar="var(--ring)" hex="#220E92" />
            <ColorSwatch name="Sidebar" cssVar="var(--sidebar)" hex="#220E92" />
          </div>
          <CodeBlock code={`/* Usage in Tailwind CSS v4 */
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive text-white" />
<div className="border-border bg-card" />

/* CSS custom properties */
:root {
  --primary: #220E92;
  --accent: #FFC100;
  --background: #F5F6FA;
  --destructive: #ef4444;
  --success: #10b981;
}`} language="css" />
        </DocSection>

        {/* ─── TYPOGRAPHY ─────────────────────────────────────── */}
        <DocSection id="typography" icon={Type} title="Typography" description="Default HTML heading styles from theme.css. Override with Tailwind utilities.">
          <ComponentCard
            title="Heading Scale"
            preview={
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-muted-foreground w-10 shrink-0" style={{ fontSize: "11px" }}>h1</span>
                  <h1>The quick brown fox</h1>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="text-muted-foreground w-10 shrink-0" style={{ fontSize: "11px" }}>h2</span>
                  <h2>The quick brown fox</h2>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="text-muted-foreground w-10 shrink-0" style={{ fontSize: "11px" }}>h3</span>
                  <h3>The quick brown fox</h3>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="text-muted-foreground w-10 shrink-0" style={{ fontSize: "11px" }}>h4</span>
                  <h4>The quick brown fox</h4>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="text-muted-foreground w-10 shrink-0" style={{ fontSize: "11px" }}>p</span>
                  <p>The quick brown fox jumps over the lazy dog.</p>
                </div>
              </div>
            }
            code={`<h1>Page Title</h1>       {/* 2xl, 600 weight */}
<h2>Section Title</h2>   {/* xl, 600 weight */}
<h3>Card Title</h3>      {/* lg, 600 weight */}
<h4>Subsection</h4>      {/* base, 600 weight */}
<p>Body text</p>

{/* Font family: 'Geist', system-ui sans-serif */}
{/* All headings use line-height: 1.5 */}`}
            htmlCode={`<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Card Title</h3>
<h4>Subsection</h4>
<p>Body text paragraph with default styling.</p>`}
            cssCode={`/* Dashrobe Typography Scale */
body {
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  color: #1a1a2e;
  line-height: 1.5;
}
h1 {
  font-size: 1.5rem;   /* 24px */
  font-weight: 600;
  line-height: 1.5;
}
h2 {
  font-size: 1.25rem;  /* 20px */
  font-weight: 600;
  line-height: 1.5;
}
h3 {
  font-size: 1.125rem; /* 18px */
  font-weight: 600;
  line-height: 1.5;
}
h4 {
  font-size: 1rem;     /* 16px */
  font-weight: 600;
  line-height: 1.5;
}
p {
  font-size: 1rem;
  line-height: 1.5;
}`}
          />
        </DocSection>

        {/* ─── BUTTONS ────────────────────────────────────────── */}
        <DocSection id="buttons" icon={RectangleHorizontal} title="Button" description="Versatile button component with multiple variants, sizes, and states.">
          <ComponentCard
            title="Variants"
            preview={
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            }
            code={`import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
            htmlCode={`<button class="btn btn-default">Default</button>
<button class="btn btn-destructive">Destructive</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<a href="#" class="btn btn-link">Link</a>`}
            cssCode={`.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.625rem; /* 10px */
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}
.btn-default {
  background: #220E92;
  color: #fff;
  border-color: #220E92;
  box-shadow: 0 4px 14px rgba(34,14,146,0.25);
}
.btn-default:hover { opacity: 0.9; }
.btn-destructive { background: #ef4444; color: #fff; }
.btn-outline {
  background: transparent;
  color: #1a1a2e;
  border-color: rgba(0,0,0,0.08);
}
.btn-outline:hover { background: #f0f0f5; }
.btn-secondary { background: #f0f0f5; color: #1a1a2e; }
.btn-ghost { background: transparent; color: #1a1a2e; }
.btn-ghost:hover { background: #f0f0f5; }
.btn-link {
  background: transparent;
  color: #220E92;
  text-decoration: underline;
  padding: 0;
}`}
          />
          <ComponentCard
            title="Sizes"
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Search className="w-4 h-4" /></Button>
              </div>
            }
            code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Search className="w-4 h-4" /></Button>`}
            htmlCode={`<button class="btn btn-default btn-sm">Small</button>
<button class="btn btn-default">Default</button>
<button class="btn btn-default btn-lg">Large</button>
<button class="btn btn-default btn-icon">
  <svg><!-- search icon --></svg>
</button>`}
            cssCode={`.btn-sm { height: 2rem; padding: 0 0.75rem; font-size: 0.8125rem; }
.btn-default { height: 2.25rem; padding: 0 1rem; }
.btn-lg { height: 2.75rem; padding: 0 2rem; font-size: 0.9375rem; }
.btn-icon {
  height: 2.25rem;
  width: 2.25rem;
  padding: 0;
}`}
          />
          <ComponentCard
            title="States"
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button disabled>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </Button>
                <Button>
                  <Mail className="w-4 h-4" />
                  With Icon
                </Button>
              </div>
            }
            code={`{/* Disabled state */}
<Button disabled>Disabled</Button>

{/* Loading state */}
<Button disabled>
  <Loader2 className="w-4 h-4 animate-spin" />
  Loading...
</Button>

{/* With icon */}
<Button>
  <Mail className="w-4 h-4" />
  With Icon
</Button>`}
            htmlCode={`<button class="btn btn-default" disabled>Disabled</button>

<button class="btn btn-default btn-loading" disabled>
  <svg class="spinner" viewBox="0 0 24 24"><!-- spinner --></svg>
  Loading...
</button>

<button class="btn btn-default">
  <svg class="icon"><!-- mail icon --></svg>
  With Icon
</button>`}
            cssCode={`.btn:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
.btn .icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
.btn .spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`}
          />
          <ComponentCard
            title="Dashrobe Custom Buttons"
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="px-5 py-2.5 rounded-[10px] text-white border border-[#220E92] transition-all"
                  style={{ fontSize: "13px", fontWeight: 600, background: "#220E92", boxShadow: "0 4px 14px rgba(34,14,146,0.25)" }}
                >
                  Primary Glow
                </button>
                <button
                  className="px-5 py-2.5 rounded-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200 transition-all"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Approve
                </button>
                <button
                  className="px-5 py-2.5 rounded-[10px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Reject
                </button>
                <button
                  className="px-5 py-2.5 rounded-[10px] bg-[#FFC100] text-[#0F0538] border border-[#FFC100] hover:bg-[#FFD040] transition-all"
                  style={{ fontSize: "13px", fontWeight: 700 }}
                >
                  Accent CTA
                </button>
              </div>
            }
            code={`{/* Primary with purple glow shadow */}
<button
  className="px-5 py-2.5 rounded-[10px] text-white border border-[#220E92]"
  style={{
    background: "#220E92",
    boxShadow: "0 4px 14px rgba(34,14,146,0.25)"
  }}
>
  Primary Glow
</button>

{/* Approve button */}
<button className="px-5 py-2.5 rounded-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200">
  Approve
</button>

{/* Reject button */}
<button className="px-5 py-2.5 rounded-[10px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
  Reject
</button>

{/* Accent CTA */}
<button className="px-5 py-2.5 rounded-[10px] bg-[#FFC100] text-[#0F0538] border border-[#FFC100] hover:bg-[#FFD040]">
  Accent CTA
</button>`}
            htmlCode={`<button class="btn-glow-primary">Primary Glow</button>
<button class="btn-approve">Approve</button>
<button class="btn-reject">Reject</button>
<button class="btn-accent-cta">Accent CTA</button>`}
            cssCode={`.btn-glow-primary {
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  background: #220E92;
  border: 1px solid #220E92;
  box-shadow: 0 4px 14px rgba(34,14,146,0.25);
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-approve {
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  background: #d1fae5;
  color: #047857;
  border: 1px solid #6ee7b7;
  font-weight: 600;
}
.btn-approve:hover { background: #a7f3d0; }
.btn-reject {
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-weight: 600;
}
.btn-reject:hover { background: #fee2e2; }
.btn-accent-cta {
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  background: #FFC100;
  color: #0F0538;
  border: 1px solid #FFC100;
  font-weight: 700;
}
.btn-accent-cta:hover { background: #FFD040; }`}
          />
          <PropsTable rows={[
            { prop: "variant", type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', default: '"default"', description: "Visual style variant" },
            { prop: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: "Button size" },
            { prop: "asChild", type: "boolean", default: "false", description: "Render as child element (Slot)" },
            { prop: "disabled", type: "boolean", default: "false", description: "Disable interaction" },
          ]} />
        </DocSection>

        {/* ─── INPUT ──────────────────────────────────────────── */}
        <DocSection id="inputs" icon={TextCursorInput} title="Input" description="Text input with focus ring, hover, disabled, and error states.">
          <ComponentCard
            title="States"
            preview={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div className="space-y-1.5">
                  <Label htmlFor="input-default">Default</Label>
                  <Input id="input-default" placeholder="Enter text..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="input-filled">Filled</Label>
                  <Input id="input-filled" defaultValue="john@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="input-disabled">Disabled</Label>
                  <Input id="input-disabled" placeholder="Cannot edit" disabled />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="input-error">Error</Label>
                  <Input id="input-error" aria-invalid="true" defaultValue="invalid@" />
                  <p className="text-destructive" style={{ fontSize: "12px" }}>Please enter a valid email.</p>
                </div>
              </div>
            }
            code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

{/* Default */}
<Label htmlFor="email">Email</Label>
<Input id="email" placeholder="Enter text..." />

{/* Disabled */}
<Input placeholder="Cannot edit" disabled />

{/* Error state - use aria-invalid */}
<Input aria-invalid="true" defaultValue="invalid@" />
<p className="text-destructive text-xs">Please enter a valid email.</p>

{/* With icon (custom wrapper) */}
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <Input className="pl-9" placeholder="Search..." />
</div>`}
            htmlCode={`<label for="email">Email</label>
<input type="text" id="email" class="input" placeholder="Enter text..." />

<!-- Disabled -->
<input type="text" class="input" placeholder="Cannot edit" disabled />

<!-- Error state -->
<input type="text" class="input input-error" value="invalid@" />
<p class="error-text">Please enter a valid email.</p>

<!-- With icon -->
<div class="input-icon-wrapper">
  <svg class="input-icon"><!-- search icon --></svg>
  <input type="text" class="input input-with-icon" placeholder="Search..." />
</div>`}
            cssCode={`.input {
  width: 100%;
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.625rem;
  font-size: 0.875rem;
  background: transparent;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input:focus {
  border-color: #220E92;
  box-shadow: 0 0 0 2px rgba(34,14,146,0.15);
}
.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f0f0f5;
}
.input-error {
  border-color: #ef4444;
}
.input-error:focus {
  box-shadow: 0 0 0 2px rgba(239,68,68,0.15);
}
.error-text {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}
.input-icon-wrapper { position: relative; }
.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b6b80;
}
.input-with-icon { padding-left: 2.25rem; }`}
          />
          <ComponentCard
            title="With Icon"
            preview={
              <div className="max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search stores..." />
                </div>
              </div>
            }
            code={`<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <Input className="pl-9" placeholder="Search stores..." />
</div>`}
            htmlCode={`<div class="input-icon-wrapper">
  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
  <input type="text" class="input input-with-icon"
    placeholder="Search stores..." />
</div>`}
            cssCode={`/* See Input CSS above for .input-icon-wrapper styles */`}
          />
          <PropsTable rows={[
            { prop: "type", type: "string", default: '"text"', description: "HTML input type" },
            { prop: "placeholder", type: "string", description: "Placeholder text" },
            { prop: "disabled", type: "boolean", default: "false", description: "Disable the input" },
            { prop: "aria-invalid", type: "boolean", description: "Show error ring styling" },
          ]} />
        </DocSection>

        {/* ─── TEXTAREA ──────────────────────────────────────── */}
        <DocSection id="textarea" icon={MessageSquare} title="Textarea" description="Multi-line text input with auto-resize, focus, and error states.">
          <ComponentCard
            title="States"
            preview={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div className="space-y-1.5">
                  <Label>Default</Label>
                  <Textarea placeholder="Write a description..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Disabled</Label>
                  <Textarea placeholder="Cannot edit" disabled />
                </div>
              </div>
            }
            code={`import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Write a description..." />
<Textarea placeholder="Cannot edit" disabled />
<Textarea aria-invalid="true" defaultValue="Error state" />`}
            htmlCode={`<textarea class="textarea" placeholder="Write a description..."></textarea>
<textarea class="textarea" placeholder="Cannot edit" disabled></textarea>
<textarea class="textarea textarea-error">Error state</textarea>`}
            cssCode={`.textarea {
  width: 100%;
  min-height: 5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.625rem;
  font-size: 0.875rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}
.textarea:focus {
  border-color: #220E92;
  box-shadow: 0 0 0 2px rgba(34,14,146,0.15);
}
.textarea:disabled { opacity: 0.5; background: #f0f0f5; }
.textarea-error { border-color: #ef4444; }`}
          />
        </DocSection>

        {/* ─── SELECT ─────────────────────────────────────────── */}
        <DocSection id="select" icon={ChevronDown} title="Select" description="Radix-based dropdown select with keyboard navigation and portal rendering.">
          <ComponentCard
            title="Default & Disabled"
            preview={
              <div className="flex flex-wrap gap-4 max-w-md">
                <div className="space-y-1.5 w-56">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 w-56">
                  <Label>Disabled</Label>
                  <Select disabled>
                    <SelectTrigger><SelectValue placeholder="Cannot select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            }
            code={`import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="clothing">Clothing</SelectItem>
    <SelectItem value="footwear">Footwear</SelectItem>
    <SelectItem value="accessories">Accessories</SelectItem>
  </SelectContent>
</Select>

{/* Disabled */}
<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Cannot select" />
  </SelectTrigger>
  ...
</Select>`}
            htmlCode={`<div class="select-wrapper">
  <select class="select">
    <option value="" disabled selected>Select category</option>
    <option value="clothing">Clothing</option>
    <option value="footwear">Footwear</option>
    <option value="accessories">Accessories</option>
  </select>
  <svg class="select-chevron"><!-- chevron down --></svg>
</div>

<select class="select" disabled>
  <option>Cannot select</option>
</select>`}
            cssCode={`.select-wrapper { position: relative; display: inline-block; }
.select {
  appearance: none;
  width: 100%;
  height: 2.25rem;
  padding: 0 2rem 0 0.75rem;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.625rem;
  font-size: 0.875rem;
  background: #fff;
  cursor: pointer;
  outline: none;
}
.select:focus {
  border-color: #220E92;
  box-shadow: 0 0 0 2px rgba(34,14,146,0.15);
}
.select:disabled { opacity: 0.5; cursor: not-allowed; }
.select-chevron {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  color: #6b6b80;
}`}
          />
        </DocSection>

        {/* ─── CHECKBOX ──────────────────────────────────────── */}
        <DocSection id="checkbox" icon={ListChecks} title="Checkbox" description="Radix checkbox with checked, unchecked, and disabled states.">
          <ComponentCard
            title="States"
            preview={
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox id="cb1" />
                  <Label htmlFor="cb1">Unchecked</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb2" defaultChecked />
                  <Label htmlFor="cb2">Checked</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb3" disabled />
                  <Label htmlFor="cb3">Disabled</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb4" defaultChecked disabled />
                  <Label htmlFor="cb4">Checked + Disabled</Label>
                </div>
              </div>
            }
            code={`import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>

{/* Pre-checked */}
<Checkbox defaultChecked />

{/* Disabled */}
<Checkbox disabled />

{/* Checked + Disabled */}
<Checkbox defaultChecked disabled />`}
            htmlCode={`<div class="checkbox-group">
  <input type="checkbox" id="terms" class="checkbox" />
  <label for="terms">Accept terms</label>
</div>

<input type="checkbox" class="checkbox" checked />
<input type="checkbox" class="checkbox" disabled />
<input type="checkbox" class="checkbox" checked disabled />`}
            cssCode={`.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.checkbox {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
}
.checkbox:checked {
  background: #220E92;
  border-color: #220E92;
}
.checkbox:checked::after {
  content: "✓";
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
}
.checkbox:focus-visible {
  box-shadow: 0 0 0 2px rgba(34,14,146,0.2);
}
.checkbox:disabled { opacity: 0.5; cursor: not-allowed; }`}
          />
        </DocSection>

        {/* ─── RADIO GROUP ────────────────────────────────────── */}
        <DocSection id="radio" icon={CircleDot} title="Radio Group" description="Radix radio group for single-select options.">
          <ComponentCard
            title="Default"
            preview={
              <RadioGroup defaultValue="express" className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="standard" id="r1" />
                  <Label htmlFor="r1">Standard Delivery</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="express" id="r2" />
                  <Label htmlFor="r2">Express Delivery</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="same-day" id="r3" disabled />
                  <Label htmlFor="r3">Same-Day (Disabled)</Label>
                </div>
              </RadioGroup>
            }
            code={`import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

<RadioGroup defaultValue="express">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="standard" id="r1" />
    <Label htmlFor="r1">Standard Delivery</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="express" id="r2" />
    <Label htmlFor="r2">Express Delivery</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="same-day" id="r3" disabled />
    <Label htmlFor="r3">Same-Day (Disabled)</Label>
  </div>
</RadioGroup>`}
            htmlCode={`<fieldset class="radio-group">
  <div class="radio-item">
    <input type="radio" name="delivery" id="r1" value="standard" class="radio" />
    <label for="r1">Standard Delivery</label>
  </div>
  <div class="radio-item">
    <input type="radio" name="delivery" id="r2" value="express" class="radio" checked />
    <label for="r2">Express Delivery</label>
  </div>
  <div class="radio-item">
    <input type="radio" name="delivery" id="r3" value="same-day" class="radio" disabled />
    <label for="r3">Same-Day (Disabled)</label>
  </div>
</fieldset>`}
            cssCode={`.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: none;
  padding: 0;
}
.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.radio {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(0,0,0,0.15);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
}
.radio:checked {
  border-color: #220E92;
  background: radial-gradient(circle, #220E92 40%, transparent 41%);
}
.radio:focus-visible {
  box-shadow: 0 0 0 2px rgba(34,14,146,0.2);
}
.radio:disabled { opacity: 0.5; cursor: not-allowed; }`}
          />
        </DocSection>

        {/* ─── SWITCH ─────────────────────────────────────────── */}
        <DocSection id="switch" icon={ToggleLeft} title="Switch" description="Toggle switch for boolean settings.">
          <ComponentCard
            title="States"
            preview={
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2.5">
                  <Switch id="sw1" />
                  <Label htmlFor="sw1">Off</Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Switch id="sw2" defaultChecked />
                  <Label htmlFor="sw2">On</Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Switch id="sw3" disabled />
                  <Label htmlFor="sw3">Disabled</Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Switch id="sw4" defaultChecked disabled />
                  <Label htmlFor="sw4">On + Disabled</Label>
                </div>
              </div>
            }
            code={`import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center gap-2.5">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>

{/* Default checked */}
<Switch defaultChecked />

{/* Disabled */}
<Switch disabled />
<Switch defaultChecked disabled />`}
            htmlCode={`<label class="switch-wrapper">
  <input type="checkbox" class="switch-input" />
  <span class="switch-track">
    <span class="switch-thumb"></span>
  </span>
  <span>Enable notifications</span>
</label>`}
            cssCode={`.switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
}
.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-track {
  width: 2.75rem;
  height: 1.5rem;
  background: #e5e5e5;
  border-radius: 999px;
  position: relative;
  transition: background 0.2s;
}
.switch-input:checked + .switch-track {
  background: #220E92;
}
.switch-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.switch-input:checked + .switch-track .switch-thumb {
  transform: translateX(1.25rem);
}
.switch-input:disabled + .switch-track { opacity: 0.5; }
.switch-input:focus-visible + .switch-track {
  box-shadow: 0 0 0 2px rgba(34,14,146,0.2);
}`}
          />
        </DocSection>

        {/* ─── BADGE ──────────────────────────────────────────── */}
        <DocSection id="badge" icon={Tag} title="Badge" description="Small status indicators and labels with multiple variants.">
          <ComponentCard
            title="Variants"
            preview={
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            }
            code={`import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`}
            htmlCode={`<span class="badge badge-default">Default</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-destructive">Destructive</span>
<span class="badge badge-outline">Outline</span>`}
            cssCode={`.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  border: 1px solid transparent;
}
.badge-default { background: #220E92; color: #fff; }
.badge-secondary { background: #f0f0f5; color: #1a1a2e; }
.badge-destructive { background: #ef4444; color: #fff; }
.badge-outline {
  background: transparent;
  color: #1a1a2e;
  border-color: rgba(0,0,0,0.08);
}`}
          />
          <ComponentCard
            title="Dashrobe Status Badges"
            preview={
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, background: "#FEF3C7", color: "#D97706" }}>Pending</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, background: "#D1FAE5", color: "#059669" }}>Approved</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, background: "#FEE2E2", color: "#DC2626" }}>Rejected</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, background: "#E0E7FF", color: "#4338CA" }}>Active</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, background: "#F3E8FF", color: "#7C3AED" }}>In Review</span>
              </div>
            }
            code={`{/* Pending */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full"
  style={{ fontSize: "11px", fontWeight: 600, background: "#FEF3C7", color: "#D97706" }}>
  Pending
</span>

{/* Approved */}
<span style={{ background: "#D1FAE5", color: "#059669" }}>Approved</span>

{/* Rejected */}
<span style={{ background: "#FEE2E2", color: "#DC2626" }}>Rejected</span>

{/* Active */}
<span style={{ background: "#E0E7FF", color: "#4338CA" }}>Active</span>`}
            htmlCode={`<span class="status-badge status-pending">Pending</span>
<span class="status-badge status-approved">Approved</span>
<span class="status-badge status-rejected">Rejected</span>
<span class="status-badge status-active">Active</span>
<span class="status-badge status-review">In Review</span>`}
            cssCode={`.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
}
.status-pending { background: #FEF3C7; color: #D97706; }
.status-approved { background: #D1FAE5; color: #059669; }
.status-rejected { background: #FEE2E2; color: #DC2626; }
.status-active { background: #E0E7FF; color: #4338CA; }
.status-review { background: #F3E8FF; color: #7C3AED; }`}
          />
        </DocSection>

        {/* ─── CARD ───────────────────────────────────────────── */}
        <DocSection id="card" icon={CreditCard} title="Card" description="Container component with header, content, and footer slots.">
          <ComponentCard
            title="Full Card"
            preview={
              <div className="max-w-sm">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Revenue</CardTitle>
                    <CardDescription>Monthly revenue breakdown for Q1 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontSize: "28px", fontWeight: 800 }}>$24,580</span>
                      <span className="text-emerald-600" style={{ fontSize: "13px", fontWeight: 600 }}>+12.5%</span>
                    </div>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Compared to last quarter</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" size="sm">View Report</Button>
                  </CardFooter>
                </Card>
              </div>
            }
            code={`import {
  Card, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Store Revenue</CardTitle>
    <CardDescription>Monthly revenue breakdown</CardDescription>
  </CardHeader>
  <CardContent>
    <span style={{ fontSize: "28px", fontWeight: 800 }}>$24,580</span>
    <span className="text-emerald-600">+12.5%</span>
  </CardContent>
  <CardFooter className="border-t pt-4">
    <Button variant="outline" size="sm">View Report</Button>
  </CardFooter>
</Card>`}
            htmlCode={`<div class="card">
  <div class="card-header">
    <h3 class="card-title">Store Revenue</h3>
    <p class="card-description">Monthly revenue breakdown</p>
  </div>
  <div class="card-content">
    <span class="stat-value">$24,580</span>
    <span class="stat-change positive">+12.5%</span>
  </div>
  <div class="card-footer">
    <button class="btn btn-outline btn-sm">View Report</button>
  </div>
</div>`}
            cssCode={`.card {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  background: #fff;
  overflow: hidden;
}
.card-header { padding: 1.5rem 1.5rem 0; }
.card-title { font-size: 1rem; font-weight: 600; }
.card-description {
  font-size: 0.8125rem;
  color: #6b6b80;
  margin-top: 0.25rem;
}
.card-content { padding: 1.5rem; }
.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.08);
}
.stat-value { font-size: 1.75rem; font-weight: 800; }
.stat-change { font-size: 0.8125rem; font-weight: 600; }
.stat-change.positive { color: #059669; }
.stat-change.negative { color: #ef4444; }`}
          />
          <ComponentCard
            title="Dashrobe KPI Card Pattern"
            preview={
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Revenue", value: "$128,450", change: "+18.2%", positive: true },
                  { label: "Total Orders", value: "2,847", change: "+5.1%", positive: true },
                  { label: "Refund Rate", value: "2.3%", change: "-0.4%", positive: true },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-[12px] border border-border bg-card p-4">
                    <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{kpi.label}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span style={{ fontSize: "22px", fontWeight: 800 }}>{kpi.value}</span>
                      <span className={kpi.positive ? "text-emerald-600" : "text-red-500"} style={{ fontSize: "12px", fontWeight: 600 }}>{kpi.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            }
            code={`{/* KPI Card Pattern */}
<div className="rounded-[12px] border border-border bg-card p-4">
  <p className="text-muted-foreground"
    style={{ fontSize: "12px", fontWeight: 500 }}>
    Total Revenue
  </p>
  <div className="flex items-baseline gap-2 mt-1">
    <span style={{ fontSize: "22px", fontWeight: 800 }}>$128,450</span>
    <span className="text-emerald-600"
      style={{ fontSize: "12px", fontWeight: 600 }}>
      +18.2%
    </span>
  </div>
</div>`}
            htmlCode={`<div class="kpi-card">
  <p class="kpi-label">Total Revenue</p>
  <div class="kpi-value-row">
    <span class="kpi-value">$128,450</span>
    <span class="kpi-change positive">+18.2%</span>
  </div>
</div>`}
            cssCode={`.kpi-card {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  background: #fff;
  padding: 1rem;
}
.kpi-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b6b80;
}
.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.kpi-value { font-size: 1.375rem; font-weight: 800; }
.kpi-change { font-size: 0.75rem; font-weight: 600; }
.kpi-change.positive { color: #059669; }
.kpi-change.negative { color: #ef4444; }`}
          />
        </DocSection>

        {/* ─── TABS ───────────────────────────────────────────── */}
        <DocSection id="tabs" icon={LayoutGrid} title="Tabs" description="Radix tabs with animated active indicator.">
          <ComponentCard
            title="Default"
            preview={
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="rounded-[10px] border border-border bg-muted/30 p-4">
                    <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Overview tab content goes here.</p>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="mt-4">
                  <div className="rounded-[10px] border border-border bg-muted/30 p-4">
                    <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Analytics tab content goes here.</p>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                  <div className="rounded-[10px] border border-border bg-muted/30 p-4">
                    <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Settings tab content goes here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            }
            code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    {/* Tab 1 content */}
  </TabsContent>
  <TabsContent value="analytics">
    {/* Tab 2 content */}
  </TabsContent>
</Tabs>`}
            htmlCode={`<div class="tabs">
  <div class="tabs-list" role="tablist">
    <button class="tab-trigger active" role="tab"
      data-tab="overview">Overview</button>
    <button class="tab-trigger" role="tab"
      data-tab="analytics">Analytics</button>
    <button class="tab-trigger" role="tab"
      data-tab="settings">Settings</button>
  </div>
  <div class="tab-content active" id="tab-overview">
    <p>Overview content here.</p>
  </div>
  <div class="tab-content" id="tab-analytics">
    <p>Analytics content here.</p>
  </div>
</div>`}
            cssCode={`.tabs-list {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #f0f0f5;
  border-radius: 0.5rem;
}
.tab-trigger {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b6b80;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-trigger.active {
  background: #fff;
  color: #1a1a2e;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.tab-content { display: none; margin-top: 1rem; }
.tab-content.active { display: block; }`}
          />
        </DocSection>

        {/* ─── DIALOG ─────────────────────────────────────────── */}
        <DocSection id="dialog" icon={PanelTop} title="Dialog" description="Modal dialog with overlay, built on Radix Dialog.">
          <ComponentCard
            title="Default Dialog"
            preview={
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm">
                    Open Dialog
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to approve this store? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
            code={`import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to approve this store?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            htmlCode={`<!-- Trigger button -->
<button class="btn btn-default"
  onclick="document.getElementById('modal').showModal()">
  Open Dialog
</button>

<!-- Native HTML dialog -->
<dialog id="modal" class="dialog">
  <div class="dialog-header">
    <h3 class="dialog-title">Confirm Action</h3>
    <p class="dialog-description">
      Are you sure you want to approve this store?
    </p>
  </div>
  <div class="dialog-footer">
    <button class="btn btn-outline"
      onclick="this.closest('dialog').close()">Cancel</button>
    <button class="btn btn-default">Confirm</button>
  </div>
</dialog>`}
            cssCode={`.dialog {
  border: none;
  border-radius: 0.75rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}
.dialog::backdrop {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
.dialog-header { margin-bottom: 1.5rem; }
.dialog-title { font-size: 1.125rem; font-weight: 600; }
.dialog-description {
  font-size: 0.875rem;
  color: #6b6b80;
  margin-top: 0.5rem;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}`}
          />
        </DocSection>

        {/* ─── TOOLTIP ────────────────────────────────────────── */}
        <DocSection id="tooltip" icon={Info} title="Tooltip" description="Hover tooltip with arrow and animation.">
          <ComponentCard
            title="Positions"
            preview={
              <div className="flex flex-wrap gap-4 py-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-8 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all text-sm">Hover me (top)</button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>Tooltip on top</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-8 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all text-sm">Bottom</button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Tooltip on bottom</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-8 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all text-sm">Left</button>
                  </TooltipTrigger>
                  <TooltipContent side="left"><p>Tooltip on left</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-8 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all text-sm">Right</button>
                  </TooltipTrigger>
                  <TooltipContent side="right"><p>Tooltip on right</p></TooltipContent>
                </Tooltip>
              </div>
            }
            code={`import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent side="top">
    <p>Tooltip content</p>
  </TooltipContent>
</Tooltip>

{/* Sides: "top" | "bottom" | "left" | "right" */}`}
            htmlCode={`<!-- CSS-only tooltip using data attribute -->
<span class="tooltip-wrapper" data-tooltip="Tooltip on top">
  <button class="btn btn-outline btn-sm">Hover me</button>
</span>

<!-- Multiple positions -->
<span class="tooltip-wrapper tooltip-bottom" data-tooltip="Bottom">
  <button class="btn btn-outline btn-sm">Bottom</button>
</span>`}
            cssCode={`.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip-wrapper::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 0.375rem 0.75rem;
  background: #0F0538;
  color: #fff;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, transform 0.15s;
}
.tooltip-wrapper:hover::after {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
/* Bottom position */
.tooltip-bottom::after {
  bottom: auto;
  top: calc(100% + 6px);
}`}
          />
        </DocSection>

        {/* ─── ACCORDION ────────────────────────────���─────────── */}
        <DocSection id="accordion" icon={Layers} title="Accordion" description="Collapsible content sections with smooth animation.">
          <ComponentCard
            title="Default"
            preview={
              <Accordion type="single" collapsible className="w-full max-w-lg">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does vendor onboarding work?</AccordionTrigger>
                  <AccordionContent>
                    Vendors complete an 8-step onboarding flow covering basic details, banking, store operations, offers, products, returns, technology setup, and final review.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What payment methods are supported?</AccordionTrigger>
                  <AccordionContent>
                    We support bank transfers, UPI, and digital wallets for vendor settlements. Payouts are processed weekly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How are refunds handled?</AccordionTrigger>
                  <AccordionContent>
                    Vendors configure their refund policy during onboarding. Customers can initiate refunds through the app and vendors approve or reject based on their policy.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            }
            code={`import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question here</AccordionTrigger>
    <AccordionContent>Answer here</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Another question</AccordionTrigger>
    <AccordionContent>Another answer</AccordionContent>
  </AccordionItem>
</Accordion>

{/* type="single" for one open at a time */}
{/* type="multiple" for multiple open */}
{/* collapsible allows closing all */}`}
            htmlCode={`<div class="accordion">
  <details class="accordion-item" open>
    <summary class="accordion-trigger">
      How does vendor onboarding work?
    </summary>
    <div class="accordion-content">
      <p>Vendors complete an 8-step onboarding flow...</p>
    </div>
  </details>
  <details class="accordion-item">
    <summary class="accordion-trigger">
      What payment methods are supported?
    </summary>
    <div class="accordion-content">
      <p>We support bank transfers, UPI, and digital wallets...</p>
    </div>
  </details>
</div>`}
            cssCode={`.accordion { width: 100%; }
.accordion-item {
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  list-style: none;
}
.accordion-trigger::-webkit-details-marker { display: none; }
.accordion-trigger::after {
  content: "▾";
  transition: transform 0.2s;
}
details[open] .accordion-trigger::after {
  transform: rotate(180deg);
}
.accordion-content {
  padding-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b6b80;
}`}
          />
        </DocSection>

        {/* ─── PROGRESS ──────────────────────────────────────── */}
        <DocSection id="progress" icon={BarChart3} title="Progress" description="Linear progress bar with animated indicator.">
          <ComponentCard
            title="Values"
            preview={
              <div className="space-y-6 max-w-md">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label>0%</Label>
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Empty</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label>25%</Label>
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Quarter</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label>60%</Label>
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Majority</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label>100%</Label>
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Complete</span>
                  </div>
                  <Progress value={100} />
                </div>
              </div>
            }
            code={`import { Progress } from "@/components/ui/progress";

<Progress value={0} />   {/* Empty */}
<Progress value={25} />  {/* Quarter */}
<Progress value={60} />  {/* Majority */}
<Progress value={100} /> {/* Complete */}

{/* With label pattern */}
<div className="space-y-1.5">
  <div className="flex justify-between">
    <Label>Upload Progress</Label>
    <span className="text-muted-foreground text-xs">60%</span>
  </div>
  <Progress value={60} />
</div>`}
            htmlCode={`<div class="progress-wrapper">
  <div class="progress-label">
    <span>Upload Progress</span>
    <span>60%</span>
  </div>
  <div class="progress-track">
    <div class="progress-bar" style="width: 60%"></div>
  </div>
</div>`}
            cssCode={`.progress-wrapper { width: 100%; }
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  margin-bottom: 0.375rem;
}
.progress-track {
  width: 100%;
  height: 0.5rem;
  background: #f0f0f5;
  border-radius: 999px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #220E92;
  border-radius: 999px;
  transition: width 0.3s ease;
}`}
          />
        </DocSection>

        {/* ─── SLIDER ─────────────────────────────────────────── */}
        <DocSection id="slider" icon={SlidersHorizontal} title="Slider" description="Range slider with Dashrobe purple accent.">
          <ComponentCard
            title="Single & Range"
            preview={
              <div className="space-y-8 max-w-md py-2">
                <div className="space-y-3">
                  <Label>Single Value</Label>
                  <Slider defaultValue={[40]} max={100} />
                </div>
                <div className="space-y-3">
                  <Label>Range</Label>
                  <Slider defaultValue={[20, 80]} max={100} />
                </div>
              </div>
            }
            code={`import { Slider } from "@/components/ui/slider";

{/* Single value */}
<Slider defaultValue={[40]} max={100} />

{/* Range (two thumbs) */}
<Slider defaultValue={[20, 80]} max={100} />

{/* With step */}
<Slider defaultValue={[50]} max={100} step={10} />`}
            htmlCode={`<label for="slider">Volume</label>
<input type="range" id="slider" class="slider"
  min="0" max="100" value="40" />`}
            cssCode={`.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 0.5rem;
  background: #f0f0f5;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  background: #220E92;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  cursor: grab;
}
.slider::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  background: #220E92;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: grab;
}
.slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(34,14,146,0.2);
}`}
          />
        </DocSection>

        {/* ─── ALERT ──────────────────────────────────────────── */}
        <DocSection id="alert" icon={AlertTriangle} title="Alert" description="Contextual alert banners for info and error states.">
          <ComponentCard
            title="Variants"
            preview={
              <div className="space-y-4 max-w-lg">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>Your store application is being reviewed. We'll notify you once approved.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Failed to save changes. Please check your connection and try again.</AlertDescription>
                </Alert>
              </div>
            }
            code={`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

{/* Default */}
<Alert>
  <Info className="w-4 h-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Your store is being reviewed.</AlertDescription>
</Alert>

{/* Destructive */}
<Alert variant="destructive">
  <AlertTriangle className="w-4 h-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Failed to save changes.</AlertDescription>
</Alert>`}
            htmlCode={`<!-- Info Alert -->
<div class="alert alert-info" role="alert">
  <svg class="alert-icon"><!-- info icon --></svg>
  <div>
    <h4 class="alert-title">Information</h4>
    <p class="alert-description">Your store is being reviewed.</p>
  </div>
</div>

<!-- Error Alert -->
<div class="alert alert-error" role="alert">
  <svg class="alert-icon"><!-- warning icon --></svg>
  <div>
    <h4 class="alert-title">Error</h4>
    <p class="alert-description">Failed to save changes.</p>
  </div>
</div>`}
            cssCode={`.alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(0,0,0,0.08);
}
.alert-icon { width: 1rem; height: 1rem; flex-shrink: 0; margin-top: 0.125rem; }
.alert-title { font-size: 0.875rem; font-weight: 600; }
.alert-description {
  font-size: 0.8125rem;
  color: #6b6b80;
  margin-top: 0.25rem;
}
.alert-info { background: #f8f9fc; }
.alert-error {
  background: #fef2f2;
  border-color: rgba(239,68,68,0.2);
  color: #dc2626;
}
.alert-error .alert-description { color: #dc2626; }`}
          />
        </DocSection>

        {/* ─── AVATAR ─────────────────────────────────────────── */}
        <DocSection id="avatar" icon={UserCircle} title="Avatar" description="User avatar with image, fallback initials, and size variants.">
          <ComponentCard
            title="States & Sizes"
            preview={
              <div className="flex flex-wrap items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/80?u=admin" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">SM</AvatarFallback>
                </Avatar>
                <Avatar className="size-14">
                  <AvatarImage src="https://i.pravatar.cc/80?u=vendor" alt="Vendor" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((l) => (
                    <Avatar key={l} className="size-8 border-2 border-card">
                      <AvatarFallback className="text-xs">{l}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="size-8 rounded-full bg-muted border-2 border-card flex items-center justify-center" style={{ fontSize: "10px", fontWeight: 600 }}>+5</div>
                </div>
              </div>
            }
            code={`import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

{/* With image */}
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* Fallback only */}
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* Custom sizes */}
<Avatar className="size-8">...</Avatar>   {/* Small */}
<Avatar className="size-14">...</Avatar>  {/* Large */}

{/* Stacked group */}
<div className="flex -space-x-2">
  <Avatar className="size-8 border-2 border-card">
    <AvatarFallback>A</AvatarFallback>
  </Avatar>
  {/* ... more avatars */}
</div>`}
            htmlCode={`<!-- With image -->
<div class="avatar">
  <img src="/avatar.jpg" alt="User" class="avatar-img" />
</div>

<!-- Fallback initials -->
<div class="avatar">
  <span class="avatar-fallback">JD</span>
</div>

<!-- Sizes -->
<div class="avatar avatar-sm">
  <span class="avatar-fallback">SM</span>
</div>
<div class="avatar avatar-lg">
  <img src="/avatar.jpg" alt="User" class="avatar-img" />
</div>

<!-- Stacked group -->
<div class="avatar-group">
  <div class="avatar avatar-sm">
    <span class="avatar-fallback">A</span>
  </div>
  <div class="avatar avatar-sm">
    <span class="avatar-fallback">B</span>
  </div>
  <div class="avatar-count">+5</div>
</div>`}
            cssCode={`.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f5;
  flex-shrink: 0;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-fallback {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b6b80;
}
.avatar-sm { width: 2rem; height: 2rem; }
.avatar-sm .avatar-fallback { font-size: 0.75rem; }
.avatar-lg { width: 3.5rem; height: 3.5rem; }
.avatar-group {
  display: flex;
}
.avatar-group .avatar {
  margin-left: -0.5rem;
  border: 2px solid #fff;
}
.avatar-group .avatar:first-child { margin-left: 0; }
.avatar-count {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #f0f0f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  margin-left: -0.5rem;
  border: 2px solid #fff;
}`}
          />
        </DocSection>

        {/* ─── TABLE ──────────────────────────────────────────── */}
        <DocSection id="table" icon={Table2} title="Table" description="Data table with header, body, and responsive overflow.">
          <ComponentCard
            title="Default Table"
            preview={
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { store: "Urban Threads", owner: "Rahul Mehta", revenue: "$12,450", status: "Approved" },
                    { store: "Style Studio", owner: "Priya Shah", revenue: "$8,320", status: "Pending" },
                    { store: "Fashion Hub", owner: "Arjun Reddy", revenue: "$15,780", status: "Approved" },
                  ].map((row) => (
                    <TableRow key={row.store}>
                      <TableCell style={{ fontWeight: 600, fontSize: "13px" }}>{row.store}</TableCell>
                      <TableCell className="text-muted-foreground" style={{ fontSize: "13px" }}>{row.owner}</TableCell>
                      <TableCell style={{ fontSize: "13px" }}>{row.revenue}</TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            background: row.status === "Approved" ? "#D1FAE5" : "#FEF3C7",
                            color: row.status === "Approved" ? "#059669" : "#D97706",
                          }}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
            code={`import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Store</TableHead>
      <TableHead>Owner</TableHead>
      <TableHead>Revenue</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Urban Threads</TableCell>
      <TableCell>Rahul Mehta</TableCell>
      <TableCell>$12,450</TableCell>
      <TableCell>
        <Badge variant="secondary">Approved</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`}
            htmlCode={`<div class="table-wrapper">
  <table class="data-table">
    <thead>
      <tr>
        <th>Store</th>
        <th>Owner</th>
        <th>Revenue</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="cell-primary">Urban Threads</td>
        <td>Rahul Mehta</td>
        <td>$12,450</td>
        <td>
          <span class="status-badge status-approved">Approved</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`}
            cssCode={`.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.625rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.data-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #6b6b80;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  background: #fafafa;
}
.data-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8f9fc; }
.cell-primary { font-weight: 600; }`}
          />
        </DocSection>

        {/* ─── SEPARATOR ──────────────────────────────────────── */}
        <DocSection id="separator" icon={Minus} title="Separator" description="Visual divider between content sections.">
          <ComponentCard
            title="Horizontal & Vertical"
            preview={
              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "13px" }}>Horizontal (default)</p>
                  <Separator />
                </div>
                <div className="flex items-center gap-4 h-8">
                  <span style={{ fontSize: "13px" }}>Home</span>
                  <Separator orientation="vertical" />
                  <span style={{ fontSize: "13px" }}>Stores</span>
                  <Separator orientation="vertical" />
                  <span style={{ fontSize: "13px" }}>Orders</span>
                </div>
              </div>
            }
            code={`import { Separator } from "@/components/ui/separator";

{/* Horizontal */}
<Separator />

{/* Vertical */}
<div className="flex items-center gap-4 h-8">
  <span>Home</span>
  <Separator orientation="vertical" />
  <span>Stores</span>
  <Separator orientation="vertical" />
  <span>Orders</span>
</div>`}
            htmlCode={`<!-- Horizontal -->
<hr class="separator" />

<!-- Vertical -->
<div class="flex-row">
  <span>Home</span>
  <div class="separator-vertical"></div>
  <span>Stores</span>
  <div class="separator-vertical"></div>
  <span>Orders</span>
</div>`}
            cssCode={`.separator {
  border: none;
  border-top: 1px solid rgba(0,0,0,0.08);
  margin: 0;
}
.separator-vertical {
  width: 1px;
  background: rgba(0,0,0,0.08);
  align-self: stretch;
}
.flex-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 2rem;
}`}
          />
        </DocSection>

        {/* ─── SKELETON ──────────────────────────────────────── */}
        <DocSection id="skeleton" icon={Loader2} title="Skeleton" description="Loading placeholder with pulse animation.">
          <ComponentCard
            title="Loading Patterns"
            preview={
              <div className="space-y-6 max-w-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>Card Skeleton</p>
                  <div className="rounded-[12px] border border-border p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded-md" />
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>Row Skeleton</p>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            }
            code={`import { Skeleton } from "@/components/ui/skeleton";

{/* Card skeleton */}
<div className="rounded-xl border p-4 space-y-3">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-3 w-1/2" />
  <Skeleton className="h-20 w-full rounded-lg" />
</div>

{/* User row skeleton */}
<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10 rounded-full" />
  <div className="flex-1 space-y-1.5">
    <Skeleton className="h-3.5 w-1/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
</div>`}
            htmlCode={`<!-- Card skeleton -->
<div class="skeleton-card">
  <div class="skeleton skeleton-text" style="width: 75%"></div>
  <div class="skeleton skeleton-text" style="width: 50%"></div>
  <div class="skeleton skeleton-block"></div>
</div>

<!-- User row skeleton -->
<div class="skeleton-row">
  <div class="skeleton skeleton-circle"></div>
  <div class="skeleton-row-text">
    <div class="skeleton skeleton-text" style="width: 33%"></div>
    <div class="skeleton skeleton-text-sm" style="width: 50%"></div>
  </div>
</div>`}
            cssCode={`@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.skeleton {
  background: #e5e5ea;
  border-radius: 0.375rem;
  animation: skeleton-pulse 2s ease-in-out infinite;
}
.skeleton-text { height: 1rem; }
.skeleton-text-sm { height: 0.75rem; }
.skeleton-block { height: 5rem; border-radius: 0.5rem; }
.skeleton-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}
.skeleton-card {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.skeleton-row-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}`}
          />
        </DocSection>

        {/* ─── LABEL ──────────────────────────────────────────── */}
        <DocSection id="label" icon={Tag} title="Label" description="Accessible form label with disabled state support.">
          <ComponentCard
            title="Usage"
            preview={
              <div className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="label-demo">Store Name</Label>
                  <Input id="label-demo" placeholder="Enter store name" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="label-cb" />
                  <Label htmlFor="label-cb">I agree to the terms and conditions</Label>
                </div>
              </div>
            }
            code={`import { Label } from "@/components/ui/label";

<Label htmlFor="storeName">Store Name</Label>
<Input id="storeName" placeholder="Enter store name" />

{/* With checkbox */}
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to the terms</Label>
</div>`}
            htmlCode={`<label for="storeName" class="form-label">Store Name</label>
<input type="text" id="storeName" class="input"
  placeholder="Enter store name" />

<!-- With checkbox -->
<div class="checkbox-group">
  <input type="checkbox" id="terms" class="checkbox" />
  <label for="terms" class="form-label">
    I agree to the terms
  </label>
</div>`}
            cssCode={`.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a2e;
  cursor: pointer;
}
.form-label[for]:hover {
  color: #220E92;
}
/* Disabled state via peer */
input:disabled + .form-label,
input:disabled ~ .form-label {
  opacity: 0.5;
  cursor: not-allowed;
}`}
          />
          <PropsTable rows={[
            { prop: "htmlFor", type: "string", description: "Associates label with input by ID" },
            { prop: "className", type: "string", description: "Additional CSS classes" },
          ]} />
        </DocSection>

        {/* ─── INSTALL / QUICK START ─────────────────────────── */}
        <div className="rounded-[12px] border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2.5">
            <Star className="w-4 h-4 text-[#FFC100]" />
            <span style={{ fontSize: "14px", fontWeight: 700 }}>Quick Start &mdash; Import Guide</span>
          </div>
          <div className="p-5">
            <CodeBlock code={`// All components live in /src/app/components/ui/
// Import pattern:
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";

// Icons from lucide-react
import { Search, Settings, Plus, Trash2 } from "lucide-react";

// Utility function
import { cn } from "@/components/ui/utils";
// Usage: cn("base-class", conditional && "active-class", className)

// Design tokens (CSS variables)
// --primary: #220E92   (Dashrobe purple)
// --accent: #FFC100    (Dashrobe gold)
// --border-radius: 10px (buttons), 12px (cards), 14px (large cards)
// --font: Geist, system-ui, sans-serif`} />
          </div>
        </div>
      </div>
    </div>
  );
}
