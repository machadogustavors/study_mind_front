import { Link } from 'react-router-dom'
import { BookOpen, Brain, Lightbulb, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { PageTransition } from '@/components/navigation/PageTransition'

export function LandingPage() {
    return (
        <PageTransition>
            <div className="min-h-screen">
                {/* Header */}
                <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">StudyMind</h1>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to={ROUTES.signin}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link
                            to={ROUTES.signup}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Cadastrar
                        </Link>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Transforme seus estudos com{' '}
                            <span className="text-blue-600 dark:text-blue-400">Inteligência Artificial</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            O StudyMind usa IA para criar resumos inteligentes, flashcards personalizados e planos de estudo
                            adaptados ao seu ritmo. Aprenda mais rápido e de forma mais eficiente.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to={ROUTES.signup}
                                className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Começar Gratuitamente
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to={ROUTES.signin}
                                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                Ver Demo
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-20">
                    <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Recursos Poderosos para Potencializar seus Estudos
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center">
                            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Resumos Inteligentes
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                Faça upload de PDFs e receba resumos detalhados e estruturados automaticamente.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center">
                            <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Flashcards Personalizados
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                Crie flashcards automaticamente a partir do seu conteúdo para memorização eficiente.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center">
                            <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Planos de Estudo IA
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                Receba planos de estudo personalizados baseados nos seus objetivos e disponibilidade.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center">
                            <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Acompanhamento de Progresso
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                Monitore seu progresso e veja estatísticas detalhadas do seu aprendizado.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                    <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Como Funciona
                    </h3>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex gap-6 items-start">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                1
                            </div>
                            <div className="text-center flex-1">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Faça Upload do Material
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Envie seus PDFs, documentos ou notas de aula para a plataforma.
                                </p>
                            </div>
                            <div className="w-12 flex-shrink-0"></div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                2
                            </div>
                            <div className="text-center flex-1">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    IA Processa o Conteúdo
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Nossa inteligência artificial analisa e extrai os pontos mais importantes do material.
                                </p>
                            </div>
                            <div className="w-12 flex-shrink-0"></div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                3
                            </div>
                            <div className="text-center flex-1">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Estude de Forma Inteligente
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Acesse resumos, flashcards e planos de estudo personalizados para otimizar seu aprendizado.
                                </p>
                            </div>
                            <div className="w-12 flex-shrink-0"></div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Por que escolher o StudyMind?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Economia de Tempo:</strong> Reduza horas de estudo com resumos inteligentes
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Aprendizado Eficiente:</strong> Técnicas comprovadas de memorização com flashcards
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Organização:</strong> Mantenha todo seu material de estudo em um único lugar
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Resultados Melhores:</strong> Aumente sua retenção de conhecimento e performance
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-8 rounded-2xl">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">10x</p>
                                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                                    Mais rápido para criar materiais de estudo
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">85%</p>
                                <p className="text-xl text-gray-700 dark:text-gray-300">
                                    De melhora na retenção de informações
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-3xl p-12 text-center text-white">
                        <h3 className="text-4xl font-bold mb-4">
                            Pronto para revolucionar seus estudos?
                        </h3>
                        <p className="text-xl mb-8 opacity-90">
                            Junte-se aos estudantes que já estão aprendendo de forma mais inteligente.
                        </p>
                        <Link
                            to={ROUTES.signup}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Começar Agora Gratuitamente
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">StudyMind</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            © 2025 StudyMind. Todos os direitos reservados.
                        </p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}
