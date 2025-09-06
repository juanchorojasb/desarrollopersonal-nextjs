'use client';

import { useState } from 'react';
import { Play, CheckCircle, Star, Users, Clock, BookOpen, Zap, Crown, Calendar, Heart, Shield, Award, Brain, Target, Lightbulb } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');

  const courses = [
    {
      title: "Navegando la Tormenta Interior",
      description: "Transforma la crisis emocional en crecimiento personal",
      sessions: 5,
      duration: "4h 20m",
      level: "Intermedio",
      link: "/courses/cmdw4jwty0000evpiciqvz2sl"
    },
    {
      title: "Transformando tus Emociones",
      description: "De la autocrítica a la autocompasión genuina",
      sessions: 8,
      duration: "6h 30m",
      level: "Principiante",
      link: "/cursos"
    },
    {
      title: "NeuroCalm: Mente en Equilibrio",
      description: "Neurociencia aplicada para la calma interior",
      sessions: 10,
      duration: "8h 15m",
      level: "Intermedio",
      link: "/cursos"
    },
    {
      title: "Superando la Depresión",
      description: "Un camino de esperanza respaldado en ciencia",
      sessions: 12,
      duration: "10h 45m",
      level: "Avanzado",
      link: "/cursos"
    },
    {
      title: "Emociones en Equilibrio",
      description: "Armonía interior a través del autoconocimiento",
      sessions: 6,
      duration: "5h 20m",
      level: "Intermedio",
      link: "/cursos"
    }
  ];

  const testimonials = [
    {
      name: "Ana María",
      text: "Después de años sintiéndome mi peor enemiga, finalmente aprendí a ser mi propia aliada. Cada sesión fue como encender una luz en la oscuridad.",
      course: "Navegando la Tormenta Interior"
    },
    {
      name: "Carlos R.",
      text: "La neurociencia explicada con tanto corazón cambió mi perspectiva. Ahora entiendo que mi cerebro puede aprender nuevos patrones de calma.",
      course: "NeuroCalm"
    },
    {
      name: "María José",
      text: "Los talleres en vivo fueron transformadores. Tener respuestas a MIS preguntas específicas no tiene precio.",
      course: "Plan Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header con Navegación */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">DP</span>
              </div>
              <span className="font-bold text-xl text-gray-900">DesarrolloPersonal</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#que-hacemos" className="text-gray-700 hover:text-blue-600 transition-colors">
                ¿Qué hacemos?
              </Link>
              <Link href="#como-lo-hacemos" className="text-gray-700 hover:text-blue-600 transition-colors">
                ¿Cómo?
              </Link>
              <Link href="#por-que" className="text-gray-700 hover:text-blue-600 transition-colors">
                ¿Por qué?
              </Link>
              <Link href="/videos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Videos
              </Link>
              
              {/* Authentication Buttons */}
              <SignedOut>
                <div className="flex items-center space-x-4">
                  <SignInButton mode="modal">
                    <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <Link 
                    href="/sign-up" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Comenzar Ahora
                  </Link>
                </div>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Mi Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <SignedOut>
                <Link 
                  href="/sign-up" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Comenzar
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Transforma la Voz Interior que Te{' '}
                <span className="text-blue-600">Hiere</span> en Tu Mayor{' '}
                <span className="text-purple-600">Aliada</span>
              </h1>

              <p className="mt-6 text-lg text-gray-600">
                Descubre cómo la neurociencia y la autocompasión pueden liberarte de la autocrítica destructiva
                y guiarte hacia una vida de equilibrio emocional auténtico.
              </p>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-2">
                      ¿Alguna vez te has dicho "no sirvo para nada" o "todo es culpa mía"?
                    </p>
                    <p className="text-gray-700 text-sm">
                      Esa voz interna puede ser más dañina que cualquier crítica externa.
                      Pero aquí está la esperanza: <strong>no somos un error, somos quienes están aprendiendo</strong>
                      a transitar, regular y gestionar nuestro bienestar emocional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-x-6">
                <SignedOut>
                  <Link href="/sign-up">
                    <button className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      Comenzar Transformación - $25,000/mes
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-green-500">
                      Continuar Mi Progreso
                    </button>
                  </Link>
                </SignedIn>
                <Link href="/videos">
                  <button className="text-lg font-semibold leading-6 text-gray-900 flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Ver Lección Gratuita
                  </button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>+1,247 estudiantes transformados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 en satisfacción</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-10 max-w-sm lg:col-span-5 lg:mx-0 lg:mt-0 xl:col-span-6">
              <div className="aspect-[3/2] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-xl font-semibold">40+ Horas de Contenido</p>
                    <p className="text-blue-100">Respaldado en Neurociencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿QUÉ HACEMOS? Section */}
      <section id="que-hacemos" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Qué Hacemos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformamos la autocrítica destructiva en autocompasión constructiva 
              a través de herramientas basadas en neurociencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Regulación Emocional
              </h3>
              <p className="text-gray-600">
                Enseñamos técnicas respaldadas por neurociencia para identificar, 
                comprender y gestionar las emociones difíciles de manera saludable.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reestructuración Cognitiva
              </h3>
              <p className="text-gray-600">
                Ayudamos a identificar patrones de pensamiento negativos y 
                reemplazarlos con perspectivas más equilibradas y compasivas.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Crecimiento Auténtico
              </h3>
              <p className="text-gray-600">
                Facilitamos un proceso de autocompasión que permite el crecimiento 
                personal desde la aceptación y el amor propio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ¿CÓMO LO HACEMOS? Section */}
      <section id="como-lo-hacemos" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Lo Hacemos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra metodología combina lo mejor de la psicología moderna 
              con herramientas prácticas y fáciles de aplicar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Evaluación y Autoconocimiento
                  </h3>
                  <p className="text-gray-600">
                    Comenzamos identificando tus patrones únicos de autocrítica 
                    y los triggers emocionales que los activan.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Herramientas Neurocientíficas
                  </h3>
                  <p className="text-gray-600">
                    Aplicamos técnicas como mindfulness, respiración consciente 
                    y reestructuración cognitiva basadas en evidencia científica.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Práctica Guiada y Integración
                  </h3>
                  <p className="text-gray-600">
                    Te acompañamos en la aplicación práctica de las herramientas 
                    hasta que se conviertan en hábitos naturales y duraderos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Seguimiento y Apoyo Continuo
                  </h3>
                  <p className="text-gray-600">
                    Mantenemos un acompañamiento constante para asegurar que 
                    los cambios se sostengan en el tiempo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Herramientas Incluidas</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Videos de técnicas neurocientíficas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Ejercicios de mindfulness guiados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Workbooks y materiales descargables</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Sesiones de coaching grupal (Premium)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Talleres en vivo mensuales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Acceso a comunidad exclusiva</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿POR QUÉ LO HACEMOS? Section */}
      <section id="por-que" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué Lo Hacemos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Porque creemos que cada persona merece vivir libre de la autocrítica 
              destructiva y experimentar la paz que viene de la autocompasión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🔥 El Problema es Real
                </h3>
                <p className="text-gray-600">
                  La autocrítica destructiva afecta al <strong>85%</strong> de las personas 
                  y es la causa principal de ansiedad, depresión y baja autoestima 
                  en nuestra sociedad moderna.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🧠 La Ciencia lo Respalda
                </h3>
                <p className="text-gray-600">
                  Estudios en neuroplasticidad demuestran que podemos reentrenar 
                  nuestro cerebro para desarrollar patrones de pensamiento más 
                  compasivos y equilibrados.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ❤️ Creemos en la Transformación
                </h3>
                <p className="text-gray-600">
                  Hemos visto cómo personas que creían estar "rotas" han logrado 
                  transformar completamente su relación consigo mismas y encontrar 
                  verdadera paz interior.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Resultados Comprobados
              </h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
                  <p className="text-gray-600">Reporta reducción significativa en autocrítica</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
                  <p className="text-gray-600">Experimenta mayor autocompasión</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
                  <p className="text-gray-600">Recomendaría el programa a otros</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">30</div>
                  <p className="text-gray-600">Días promedio para ver cambios</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de Suscripción - AHORA CON 3 PLANES */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Elige Tu Camino de Transformación
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Por menos que un café al día, accede a toda nuestra biblioteca de bienestar emocional
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
            {/* Plan Básico */}
            <div className="relative rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/10">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Plan Básico</h3>
                  <p className="text-gray-600">Acceso Total - Transforma tu Vida Interior</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$25,000</span>
                  <span className="text-lg text-gray-600">/mes</span>
                </div>
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Solo $833 pesos por día ☕ • Cancela cuando quieras
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Acceso completo</strong> a todos los cursos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>40+ horas</strong> de contenido premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Nuevos cursos</strong> incluidos automáticamente</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Progreso personalizado</strong> y certificados</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Acceso móvil</strong> y descarga offline</span>
                </li>
              </ul>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💰 Valor individual de cursos: $150,000+</strong><br/>
                  Tu precio mensual: Solo $25,000 COP
                </p>
              </div>

              <Link href="/pricing">
                <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-blue-500">
                  Comenzar Plan Básico
                </button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Garantía de 7 días • Cancela cuando quieras</span>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="relative rounded-3xl bg-gradient-to-b from-purple-50 to-purple-100 p-8 shadow-2xl ring-2 ring-purple-500 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Más Popular
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Plan Premium</h3>
                  <p className="text-gray-600">Transformación con Acompañamiento Directo</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$80,000</span>
                  <span className="text-lg text-gray-600">/mes</span>
                </div>
                <p className="mt-2 text-sm text-purple-600 font-medium">
                  Valor talleres: $450,000+ • Ahorras $370,000 mensual
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Todo lo del Plan Básico +</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
                  <span className="text-gray-700"><strong>2 talleres en vivo</strong> por mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Q&A directo</strong> con expertos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-purple-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Comunidad exclusiva</strong> Premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-purple-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Casos personalizados</strong> en talleres</span>
                </li>
              </ul>

              <div className="mb-6 p-4 bg-purple-100 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-900">
                  <strong>💜 El poder del acompañamiento directo:</strong><br/>
                  Imagínate tener acceso a expertos que pueden responder TUS preguntas específicas,
                  con TUS circunstancias únicas, en tiempo real.
                </p>
              </div>

              <Link href="/pricing">
                <button className="w-full rounded-lg bg-purple-600 px-4 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-purple-500">
                  Comenzar Plan Premium
                </button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Garantía de 7 días • Acceso VIP inmediato</span>
              </div>
            </div>

            {/* Plan Individual - NUEVO */}
            <div className="relative rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/10">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Curso Individual</h3>
                  <p className="text-gray-600">Perfecto si solo te interesa un tema específico</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$20,000</span>
                  <span className="text-lg text-gray-600">/curso</span>
                </div>
                <p className="mt-2 text-sm text-orange-600 font-medium">
                  Pago único • Acceso de por vida
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Acceso permanente</strong> al curso seleccionado</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Certificado</strong> de finalización</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Soporte por email</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Actualizaciones gratuitas</strong> del curso</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700"><strong>Descarga offline</strong></span>
                </li>
              </ul>

              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>🎯 Ideal para probar:</strong><br/>
                  Comienza con un curso específico y luego actualiza a plan completo
                </p>
              </div>

              <Link href="/pricing">
                <button className="w-full rounded-lg bg-orange-600 px-4 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-orange-500">
                  Ver Cursos Disponibles
                </button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Garantía de 7 días • Sin compromisos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biblioteca de Cursos */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tu Biblioteca Completa de Transformación
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Accede a TODOS estos cursos con cualquier plan de suscripción
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white opacity-70" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span className="text-gray-500 text-sm">{course.sessions} sesiones</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <Link href={course.link}>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Ver Detalles →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-6 py-3 rounded-full border border-green-200">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                Nuevos cursos se agregan mensualmente - Siempre incluidos en tu suscripción
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Historias de Transformación Real
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cada paso cuenta en tu camino de transformación
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.course}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Tu Bienestar Emocional No Puede Esperar
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Cada día que pases con autocrítica destructiva es un día menos de paz interior.
            <br />
            <strong>Mereces tu propia compasión y apoyo.</strong>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <Link href="/sign-up">
                <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-50">
                  Comenzar Transformación Hoy - $25,000/mes
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/pricing">
                <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-50">
                  Upgrade Mi Plan
                </button>
              </Link>
            </SignedIn>
            <Link href="/videos">
              <button className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-600">
                Ver Lección Gratuita Primero
              </button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Garantía 7 días</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>+1,247 estudiantes</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
