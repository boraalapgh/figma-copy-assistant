import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen paper-texture">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="font-serif font-bold text-lg">Copy Assistant</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Button size="sm" asChild>
              <a href="https://github.com/boraalapgh/figma-copy-assistant" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="animate-fade-up">
          <Badge variant="secondary" className="mb-6 font-sans text-xs tracking-wide">
            For Figma Designers
          </Badge>
        </div>

        <h1 className="text-5xl md:text-7xl leading-[1.1] tracking-tight mb-8 animate-fade-up delay-100">
          Words that work,
          <br />
          <span className="italic font-normal">crafted by AI</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10 animate-fade-up delay-200">
          A Figma plugin that transforms how design teams write UX copy.
          Powered by GPT-4, guided by your brand voice.
        </p>

        <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/docs#installation">
              Install Plugin
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" asChild>
            <Link href="/docs">
              Read the Docs
            </Link>
          </Button>
        </div>

        {/* Decorative line */}
        <div className="editorial-rule mt-20 opacity-20" />
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="animate-fade-up">
            <span className="text-sm font-mono text-muted-foreground mb-4 block">01</span>
            <h2 className="text-2xl mb-4">Three-Layer Context</h2>
            <p className="text-muted-foreground leading-relaxed">
              System prompt defines your brand voice. Project context travels with each Figma file.
              User requests guide each generation. Every piece of copy understands its place.
            </p>
          </div>

          <div className="animate-fade-up delay-100">
            <span className="text-sm font-mono text-muted-foreground mb-4 block">02</span>
            <h2 className="text-2xl mb-4">Smart Shortcuts</h2>
            <p className="text-muted-foreground leading-relaxed">
              One-click transformations: make it concise, make it friendly, make it formal.
              Quick actions for common copywriting needs, all contextually aware.
            </p>
          </div>

          <div className="animate-fade-up delay-200">
            <span className="text-sm font-mono text-muted-foreground mb-4 block">03</span>
            <h2 className="text-2xl mb-4">Shared Context</h2>
            <p className="text-muted-foreground leading-relaxed">
              Project context is stored in the Figma file itself. When designers share files,
              the AI context travels with them. Collaboration without configuration.
            </p>
          </div>

          <div className="animate-fade-up delay-300">
            <span className="text-sm font-mono text-muted-foreground mb-4 block">04</span>
            <h2 className="text-2xl mb-4">Secure by Design</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your OpenAI key lives on the server, never exposed to the client.
              Edge functions process requests instantly while keeping credentials safe.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl mb-4 animate-fade-up">How It Works</h2>
          <p className="text-muted-foreground text-lg mb-12 animate-fade-up delay-100">
            From selection to suggestion in seconds
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm animate-fade-up delay-200">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl">1</span>
                </div>
                <h3 className="text-lg mb-2 font-serif">Select Text</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any text layer in your Figma design. The plugin detects the selection automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm animate-fade-up delay-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl">2</span>
                </div>
                <h3 className="text-lg mb-2 font-serif">Describe Your Need</h3>
                <p className="text-sm text-muted-foreground">
                  Type what you need or use a quick shortcut. The AI receives your brand context automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm animate-fade-up delay-400">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl">3</span>
                </div>
                <h3 className="text-lg mb-2 font-serif">Apply or Iterate</h3>
                <p className="text-sm text-muted-foreground">
                  Review the suggestion, apply it directly to your design, or generate alternatives until it&apos;s perfect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl mb-6 animate-fade-up">
            Ready to write better copy?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto animate-fade-up delay-100">
            Get started with the documentation. Learn how to install, configure,
            and customize the plugin for your team.
          </p>
          <Button size="lg" className="text-base px-8 animate-fade-up delay-200" asChild>
            <Link href="/docs">
              View Documentation →
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>✦</span>
            <span>Copy Assistant</span>
            <span className="editorial-ornament" />
            <span>Built for GoodHabitz</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="https://github.com/boraalapgh/figma-copy-assistant" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
