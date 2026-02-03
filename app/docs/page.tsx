import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DocsPage() {
  return (
    <div className="min-h-screen paper-texture">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">✦</span>
              <span className="font-serif font-bold text-lg">Copy Assistant</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Documentation</span>
            <Button size="sm" asChild>
              <a href="https://github.com/boraalapgh/figma-copy-assistant" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16 animate-fade-up">
          <Badge variant="secondary" className="mb-4 font-sans text-xs tracking-wide">
            v1.0.0
          </Badge>
          <h1 className="text-4xl md:text-5xl mb-6">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Everything you need to install, configure, and customize the Copy Assistant plugin for your design team.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-16 p-6 bg-muted/30 rounded-lg border border-border/50 animate-fade-up delay-100">
          <h2 className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider mb-4">On This Page</h2>
          <nav className="space-y-2 text-sm">
            <a href="#architecture" className="block text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
            <a href="#installation" className="block text-muted-foreground hover:text-foreground transition-colors">Installation</a>
            <a href="#configuration" className="block text-muted-foreground hover:text-foreground transition-colors">Configuration</a>
            <a href="#security" className="block text-muted-foreground hover:text-foreground transition-colors">Security</a>
            <a href="#usage" className="block text-muted-foreground hover:text-foreground transition-colors">Usage Guide</a>
            <a href="#customization" className="block text-muted-foreground hover:text-foreground transition-colors">Customization</a>
            <a href="#api-reference" className="block text-muted-foreground hover:text-foreground transition-colors">API Reference</a>
          </nav>
        </div>

        {/* Architecture Section */}
        <section id="architecture" className="mb-20 scroll-mt-24 animate-fade-up delay-200">
          <h2 className="text-3xl mb-6">Architecture</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Copy Assistant uses a three-tier architecture that separates the Figma plugin,
            the API proxy, and the AI service for security and flexibility.
          </p>

          <div className="bg-muted/30 p-6 rounded-lg border border-border/50 mb-8 overflow-x-auto">
            <pre className="text-sm">
{`┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Figma Plugin      │────▶│   Next.js API        │────▶│   OpenAI    │
│   (figma-plugin/)   │◀────│   (Vercel)           │◀────│   GPT-4     │
└─────────────────────┘     └──────────────────────┘     └─────────────┘
         │                           ▲
         ▼                           │ Bearer token
┌─────────────────────┐              │ (PLUGIN_API_SECRET)
│   Project Context   │──────────────┘
│   (Plugin Data)     │
└─────────────────────┘`}
            </pre>
          </div>

          <h3 className="text-xl mb-4 font-serif">Components</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Figma Plugin (<code>figma-plugin/</code>)</h4>
              <p className="text-sm text-muted-foreground">
                Runs inside Figma&apos;s sandbox environment. Handles text selection, font loading,
                and stores project context in the Figma file&apos;s plugin data.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Next.js API (<code>app/api/generate/</code>)</h4>
              <p className="text-sm text-muted-foreground">
                Deployed on Vercel, this API route receives requests from the plugin, verifies the
                API secret, and forwards them to OpenAI. Both the OpenAI key and plugin secret are
                stored securely as environment variables.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Three-Layer Prompt System</h4>
              <p className="text-sm text-muted-foreground">
                <strong>System prompt:</strong> Brand voice guidelines (constant, in <code>figma-plugin/src/code.ts</code>)<br />
                <strong>Project context:</strong> Per-file context stored in Figma plugin data<br />
                <strong>User request:</strong> The immediate instruction from the designer
              </p>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section id="installation" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl mb-6">Installation</h2>

          <Tabs defaultValue="api" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="api">1. Deploy API</TabsTrigger>
              <TabsTrigger value="plugin">2. Setup Plugin</TabsTrigger>
              <TabsTrigger value="figma">3. Import to Figma</TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-6">
              <p className="text-muted-foreground">
                First, deploy the API to Vercel. This serves as a secure proxy to OpenAI.
              </p>

              <div className="space-y-4">
                <h4 className="font-medium">Clone and install</h4>
                <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 space-y-2">
                  <code className="text-sm block">git clone https://github.com/boraalapgh/figma-copy-assistant.git</code>
                  <code className="text-sm block">cd figma-copy-assistant</code>
                  <code className="text-sm block">npm install</code>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Deploy to Vercel</h4>
                <div className="bg-foreground/5 p-4 rounded-lg border border-border/50">
                  <code className="text-sm">vercel</code>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Set environment variables</h4>
                <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 space-y-2">
                  <code className="text-sm block">vercel env add OPENAI_API_KEY</code>
                  <code className="text-sm block">vercel env add PLUGIN_API_SECRET</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  For <code>PLUGIN_API_SECRET</code>, create a secure random string. You&apos;ll use this same
                  value when configuring the plugin.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Deploy to production</h4>
                <div className="bg-foreground/5 p-4 rounded-lg border border-border/50">
                  <code className="text-sm">vercel --prod</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Note your deployment URL (e.g., <code>https://your-project.vercel.app</code>).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="plugin" className="space-y-6">
              <p className="text-muted-foreground">
                Set up the Figma plugin with your API configuration.
              </p>

              <div className="space-y-4">
                <h4 className="font-medium">First-time setup</h4>
                <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 space-y-2">
                  <code className="text-sm block">npm run figma:build</code>
                  <code className="text-sm block">npm run figma:setup</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  The setup wizard prompts for your API endpoint and secret, saves them to
                  <code>.env.local</code>, and creates <code>figma-plugin/ui.html</code>.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">After template updates</h4>
                <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 space-y-2">
                  <code className="text-sm block">npm run figma:build</code>
                  <code className="text-sm block">npm run figma:update</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regenerates <code>ui.html</code> from your saved <code>.env.local</code> secrets—no prompts needed.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">What you&apos;ll need</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>API Endpoint:</strong> Your Vercel URL (press Enter for default)</li>
                  <li><strong>API Secret:</strong> The same <code>PLUGIN_API_SECRET</code> you set in Vercel</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="figma" className="space-y-6">
              <p className="text-muted-foreground">
                Import the plugin into Figma Desktop.
              </p>

              <div className="space-y-4">
                <h4 className="font-medium">Import the plugin</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open Figma Desktop</li>
                  <li>Go to <strong>Plugins → Development → Import plugin from manifest</strong></li>
                  <li>Navigate to your repo and select <code>figma-plugin/manifest.json</code></li>
                </ol>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Run the plugin</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open any Figma file</li>
                  <li>Go to <strong>Plugins → Development → Copy Assistant</strong></li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Configuration Section */}
        <section id="configuration" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl mb-6">Configuration</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl mb-4 font-serif">Environment Variables (Vercel)</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Variable</th>
                      <th className="text-left p-4 font-medium">Description</th>
                      <th className="text-left p-4 font-medium">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>OPENAI_API_KEY</code></td>
                      <td className="p-4 text-muted-foreground">Your OpenAI API key</td>
                      <td className="p-4">Yes</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>PLUGIN_API_SECRET</code></td>
                      <td className="p-4 text-muted-foreground">Secret token for plugin authentication</td>
                      <td className="p-4">Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-4 font-serif">Plugin Configuration (<code>figma-plugin/ui.html</code>)</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Variable</th>
                      <th className="text-left p-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>API_ENDPOINT</code></td>
                      <td className="p-4 text-muted-foreground">Your Vercel deployment URL + <code>/api/generate</code></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>API_SECRET</code></td>
                      <td className="p-4 text-muted-foreground">Must match <code>PLUGIN_API_SECRET</code> in Vercel</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl mb-6">Security</h2>

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Copy Assistant is designed with security in mind. Here&apos;s how your credentials are protected:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="font-medium mb-2">OpenAI API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Stored only in Vercel environment variables. Never sent to or visible from the client.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="font-medium mb-2">Plugin API Secret</h4>
                <p className="text-sm text-muted-foreground">
                  Required for all API requests. Prevents unauthorized users from using your API endpoint
                  even if they know the URL.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="font-medium mb-2">Local Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  <code>figma-plugin/ui.html</code> is gitignored. Your secrets stay on your machine and
                  are never committed to the repository.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Section */}
        <section id="usage" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl mb-6">Usage Guide</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl mb-4 font-serif">Setting Project Context</h3>
              <p className="text-muted-foreground mb-4">
                Project context provides AI with specific information about the current Figma file.
                This context is stored in the file and shared with anyone who opens it.
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Open the plugin in Figma</li>
                <li>Navigate to the <strong>Project Context</strong> tab</li>
                <li>Describe your project, audience, and any specific terminology</li>
                <li>Click <strong>Save Context</strong></li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl mb-4 font-serif">Generating Copy</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Select a text layer in your Figma design</li>
                <li>Open the plugin (it will show the current text and element context)</li>
                <li>Select the <strong>audience</strong>: Learner or Admin</li>
                <li>Either type your request or use a quick shortcut</li>
                <li>Click <strong>Generate Copy</strong></li>
                <li>Review the suggestion and click <strong>Apply</strong> or <strong>Copy</strong></li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl mb-4 font-serif">Audience Tones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <span className="font-medium text-sm block mb-2">Learner</span>
                  <span className="text-xs text-muted-foreground">Motivating Mentor tone: warm, vibrant, honest, playful. Celebrates progress and encourages growth.</span>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <span className="font-medium text-sm block mb-2">Admin</span>
                  <span className="text-xs text-muted-foreground">Trusted Partner tone: professional, caring, clear, confident. Guides with expertise and anticipates needs.</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-4 font-serif">Quick Shortcuts</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: "✂️", label: "Concise", desc: "Make it shorter" },
                  { icon: "😊", label: "Friendly", desc: "Warmer tone" },
                  { icon: "👔", label: "Formal", desc: "Professional tone" },
                  { icon: "💡", label: "Clearer", desc: "Easier to understand" },
                  { icon: "🚀", label: "Action", desc: "More action-oriented" },
                  { icon: "✏️", label: "Fix", desc: "Grammar and spelling" },
                ].map((shortcut) => (
                  <div key={shortcut.label} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <span className="text-lg mb-2 block">{shortcut.icon}</span>
                    <span className="font-medium text-sm block">{shortcut.label}</span>
                    <span className="text-xs text-muted-foreground">{shortcut.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Customization Section */}
        <section id="customization" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl mb-6">Customization</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl mb-4 font-serif">Modifying the System Prompt</h3>
              <p className="text-muted-foreground mb-4">
                The system prompt is the foundation of all AI responses. Customize it to match your team&apos;s voice:
              </p>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border/50">
                <code className="text-sm">figma-plugin/src/code.ts → SYSTEM_PROMPT constant</code>
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-4 font-serif">Adding Custom Shortcuts</h3>
              <p className="text-muted-foreground mb-4">
                Add new quick shortcuts by editing the shortcuts section in <code>figma-plugin/ui.template.html</code>:
              </p>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 overflow-x-auto">
                <pre className="text-sm">
{`<span class="shortcut" data-prompt="Your custom prompt here">
  🎯 Label
</span>`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Remember to copy the updated template to <code>ui.html</code> after making changes.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-4 font-serif">Changing the AI Model</h3>
              <p className="text-muted-foreground mb-4">
                By default, the plugin uses <code>gpt-4o-mini</code>. To change the model, edit <code>app/api/generate/route.ts</code>:
              </p>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border/50">
                <code className="text-sm">model: &apos;gpt-4o-mini&apos;  // Change to &apos;gpt-4o&apos; or other models</code>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference Section */}
        <section id="api-reference" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl mb-6">API Reference</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl mb-4 font-serif">POST /api/generate</h3>
              <p className="text-muted-foreground mb-4">
                Generates copy based on the provided context and user request.
              </p>

              <h4 className="font-medium mb-2">Headers</h4>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 overflow-x-auto mb-4">
                <pre className="text-sm">
{`Authorization: Bearer <PLUGIN_API_SECRET>
Content-Type: application/json`}
                </pre>
              </div>

              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 overflow-x-auto mb-4">
                <pre className="text-sm">
{`{
  "systemPrompt": "string",    // Brand writing guidelines
  "projectContext": "string",  // Project-specific context
  "currentText": "string",     // Existing text (if any)
  "userRequest": "string"      // What the user wants
}`}
                </pre>
              </div>

              <h4 className="font-medium mb-2">Response</h4>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border/50 overflow-x-auto">
                <pre className="text-sm">
{`{
  "text": "string"  // Generated copy
}`}
                </pre>
              </div>

              <h4 className="font-medium mb-2 mt-4">Error Responses</h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>401</code></td>
                      <td className="p-4 text-muted-foreground">Invalid or missing API secret</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>400</code></td>
                      <td className="p-4 text-muted-foreground">Missing user request</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-4"><code>500</code></td>
                      <td className="p-4 text-muted-foreground">OpenAI API error</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-border/50 pt-8 mt-16">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>✦</span>
              <span>Copy Assistant</span>
            </div>
            <a href="https://github.com/boraalapgh/figma-copy-assistant" className="hover:text-foreground transition-colors">
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
