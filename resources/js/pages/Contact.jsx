import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de envío
    console.log('Formulario enviado:', formData);
    alert('Gracias por contactarnos. Te responderemos pronto.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Estamos aquí para ayudarte con todas tus necesidades tecnológicas.
              Escríbenos y te responderemos a la brevedad.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Información de Contacto</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Ubicación</h4>
                      <p className="text-gray-600">Jr. Santo Toribio con 7 de Junio</p>
                      <p className="text-gray-600">Pichanaki, Junín, Perú</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Teléfono</h4>
                      <p className="text-gray-600">+51 916 572 151</p>
                      <p className="text-gray-600">+51 946 382 589</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">ventas@logitell.com</p>
                      <p className="text-gray-600">soporte@logitell.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Horario de Atención</h4>
                      <p className="text-gray-600">Lun - Vie: 8:00 AM - 8:00 PM</p>
                      {/* <p className="text-gray-600">Sáb: 9:00 AM - 1:00 PM</p> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Mini Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <MessageSquare className="mr-2" size={20} />
                  Preguntas Frecuentes
                </h3>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-800 text-sm">¿Hacen envíos a provincia?</h5>
                    <p className="text-gray-600 text-sm mt-1">Sí, realizamos envíos a todo el Perú mediante agencias autorizadas.</p>
                  </div>
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-800 text-sm">¿Los productos tienen garantía?</h5>
                    <p className="text-gray-600 text-sm mt-1">Todos nuestros productos cuentan con garantía de fábrica de 12 meses.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                        placeholder="juan@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Consulta sobre producto"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={20} />
                    <span>Enviar Mensaje</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
              {/* Placeholder for map - In a real app, embed Google Maps iframe here */}
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Mapa de Ubicación</p>
                  <p className="text-sm">Av. Tecnología 123, Lima</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all cursor-pointer"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
