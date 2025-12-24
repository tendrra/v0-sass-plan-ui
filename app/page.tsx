import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, FileText, BookOpen, Headphones, BarChart3, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-cyan-600">Alfa</div>
            <div className="text-sm font-medium text-gray-600">PTE Preparation Platform</div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/questions">
              <Button variant="outline">Admin</Button>
            </Link>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Master Your <span className="text-cyan-600">PTE Exam</span> with AI-Powered Practice
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Practice speaking, writing, reading, and listening with real-time AI scoring and detailed feedback based on
            official PTE rubrics
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/test/speaking">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                Start Practicing
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Practice All Test Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/test/speaking" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-cyan-500">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Mic className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Speaking</CardTitle>
                  <CardDescription>Read Aloud, Repeat Sentence, Describe Image, and more</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">AI scoring for fluency, pronunciation, and content</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Writing</CardTitle>
                <CardDescription>Summarize Written Text, Write Essay</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Detailed grammar, vocabulary, and coherence analysis</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Reading</CardTitle>
                <CardDescription>Multiple Choice, Fill in Blanks, Reorder Paragraphs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">1500+ practice questions with instant feedback</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Headphones className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Listening</CardTitle>
                <CardDescription>Summarize Spoken Text, Multiple Choice, Fill in Blanks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Real exam audio with comprehension analysis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Scoring Feature */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">AI-Powered Scoring</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get instant, detailed feedback on your performance with our advanced AI scoring system. Our algorithms
                analyze your responses based on official PTE criteria.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div>
                    <strong>Detailed Rubric Scores</strong>
                    <p className="text-sm text-muted-foreground">
                      Content, Fluency, Pronunciation, Grammar, Vocabulary
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div>
                    <strong>Speech-to-Text Analysis</strong>
                    <p className="text-sm text-muted-foreground">See exactly what you said with accuracy tracking</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div>
                    <strong>Personalized Feedback</strong>
                    <p className="text-sm text-muted-foreground">Get specific suggestions for improvement</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">78</div>
                <p className="text-cyan-100">Out of 90</p>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Content</span>
                    <span>85/90</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Fluency</span>
                    <span>75/90</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "83%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Pronunciation</span>
                    <span>72/90</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your PTE Exam?</h2>
          <p className="text-xl mb-8 text-cyan-100">
            Join thousands of students who have improved their scores with our AI-powered platform
          </p>
          <Link href="/test/speaking">
            <Button size="lg" variant="secondary" className="bg-white text-cyan-600 hover:bg-cyan-50">
              Start Free Practice
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Alfa PTE</h3>
              <p className="text-sm">AI-powered PTE preparation platform with real-time scoring and feedback.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Practice</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Speaking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Writing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Reading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Listening
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Study Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Alfa Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
