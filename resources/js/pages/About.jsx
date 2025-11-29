import React from 'react'
import Header from '../components/Header'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import { Shield, Smartphone, Laptop, Cpu, CheckCircle, Users, Target } from 'lucide-react'

export default function About() {
  return (
    <>
      <Header />
      {/* Hero */}
      <div className="relative bg-[#1A1A1A] py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/backgrondforabaut.jpg?height=1080&width=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Innovación que <span className="text-[#0ACF83]">Conecta</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            En Logitell, transformamos la manera en que interactúas con la tecnología. 
            Desde seguridad avanzada hasta computación de alto rendimiento.
          </p>
        </div>
      </div>

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Sobre Logitell</h2>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Somos una empresa líder dedicada a la venta y distribución de soluciones tecnológicas integrales. 
                Nos especializamos en equipar hogares y empresas con lo último en cámaras de seguridad, 
                telefonía móvil, computadoras, laptops y accesorios de alta gama.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Nuestro compromiso es brindar no solo productos de calidad, sino también la asesoría 
                necesaria para que encuentres exactamente lo que necesitas para tu vida digital o tu negocio.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
               <img 
                 src="/storage/images/tecnico_reparando.jpeg?height=600&width=800" 
                 alt="Equipo Logitell" 
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* What We Sell (Icons) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Nuestras Soluciones</h2>
            <p className="text-gray-600 mt-4">Todo lo que necesitas en un solo lugar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Seguridad', desc: 'Cámaras y sistemas de vigilancia de última generación.' },
              { icon: Smartphone, title: 'Telefonía', desc: 'Smartphones de las mejores marcas y accesorios.' },
              { icon: Laptop, title: 'Computación', desc: 'Laptops y PCs de escritorio para hogar y oficina.' },
              { icon: Cpu, title: 'Accesorios', desc: 'Periféricos y componentes para potenciar tu equipo.' },
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition text-center group">
                <div className="w-16 h-16 bg-[#0ACF83]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0ACF83] transition">
                  <item.icon className="text-[#0ACF83] group-hover:text-white transition" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A1A1A] p-10 rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-[#0ACF83]" size={28} />
                  <h3 className="text-2xl font-bold">Nuestra Misión</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Proveer soluciones tecnológicas accesibles y de alta calidad que mejoren la seguridad, 
                  productividad y conectividad de nuestros clientes, respaldados por un servicio de excelencia.
                </p>
              </div>
            </div>
            <div className="bg-[#0ACF83] p-10 rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-white" size={28} />
                  <h3 className="text-2xl font-bold">Nuestra Visión</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Ser reconocidos como el referente principal en comercio electrónico de tecnología en la región, 
                  innovando constantemente para adaptarnos a las necesidades del futuro digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">¿Por qué elegir Logitell?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#0ACF83] rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Garantía Asegurada</h4>
              <p className="text-gray-400">Todos nuestros productos cuentan con garantía oficial.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#0ACF83] rounded-full flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Soporte Experto</h4>
              <p className="text-gray-400">Equipo técnico listo para resolver tus dudas.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#0ACF83] rounded-full flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Compra Segura</h4>
              <p className="text-gray-400">Plataforma confiable y envíos a todo el país.</p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </>
  )
}
