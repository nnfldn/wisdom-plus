import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { MapPin, Phone, Mail, ChevronDown, Send, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const { props: pageProps } = usePage();
  const salesWhatsapp = pageProps?.public?.salesWhatsapp || '6281234567890';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const nama = form.querySelector('[name="nama"]').value;
    const wa = form.querySelector('[name="wa"]').value;
    const tujuan = form.querySelector('[name="tujuan"]').value;
    const pesan = form.querySelector('[name="pesan"]').value;

    const text = `Halo Wisma Domba Farm 🐑\n\nNama: ${nama}\nWhatsApp: ${wa}\nKeperluan: ${tujuan}\n\nPesan:\n${pesan}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${salesWhatsapp}?text=${encoded}`, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <PublicLayout currentRoute="contact">
      <Head title="Hubungi Kami" />
      <div className="bg-m3-surface min-h-screen font-sans selection:bg-m3-primary selection:text-white">
        {/* Header Section - Refined Light */}
        <section className="bg-white pt-0 pb-[37px] relative overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#2B5E41 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 relative z-10 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tighter uppercase italic">
              Hubungi <span className="text-m3-primary">Kami</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Konsultasi pembelian domba, kemitraan pakan, atau kunjungan edukasi farm.
            </p>
          </motion.div>
        </section>

        {/* Contact Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-20 pt-0 pb-[37px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Information */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-4 space-y-8"
            >
              <motion.div variants={itemVariants} className="bg-m3-secondary-container p-8 rounded-[2.5rem] border border-m3-outline/10 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-m3-primary p-2.5 rounded-xl shadow-sm">
                    <MessageSquare className="w-6 h-6 text-m3-on-primary" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-m3-on-secondary-container tracking-tight">Informasi Farm</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="flex gap-5 items-start">
                    <div className="bg-m3-primary-container p-3.5 rounded-2xl text-m3-primary shrink-0 border border-m3-outline/10">
                      <MapPin className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-m3-on-secondary-container text-lg">Lokasi Farm</h4>
                      <p className="text-m3-on-secondary-container/70 mt-1.5 leading-relaxed font-medium">
                        Wisma Domba Farm (WDF),<br/>Ciharashas, Kec. Cilaku,<br/>Kabupaten Cianjur, Jawa Barat 43285
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="bg-m3-primary-container p-3.5 rounded-2xl text-m3-primary shrink-0 border border-m3-outline/10">
                      <Phone className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-m3-on-secondary-container text-lg">Hotline / WhatsApp</h4>
                      <p className="text-m3-on-secondary-container/70 mt-1.5 leading-relaxed font-medium text-lg">+62 881-0806-75963</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] font-black text-m3-primary uppercase tracking-widest bg-m3-primary/5 px-3 py-1 rounded-full w-fit">
                        <Clock className="w-3.5 h-3.5"/> Fast Respon: 08.00 - 17.00 WIB
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="bg-m3-primary-container p-3.5 rounded-2xl text-m3-primary shrink-0 border border-m3-outline/10">
                      <Mail className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-m3-on-secondary-container text-lg">Email Perusahaan</h4>
                      <p className="text-m3-on-secondary-container/70 mt-1.5 leading-relaxed font-medium">halo@wisdomplus.id</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="rounded-[2.5rem] overflow-hidden border border-m3-outline/10 shadow-sm"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5!2d107.14!3d-6.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b5e3f1f1f1f1%3A0x0!2sWisma+Domba+Farm!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Wisma Domba Farm"
                  className="w-full"
                ></iframe>
                <a 
                  href="https://www.google.com/maps/search/Wisma+Domba+Farm+Ciharashas+Cilaku+Cianjur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-m3-on-surface text-m3-surface px-6 py-4 font-bold text-sm hover:bg-m3-primary transition-colors"
                >
                  <MapPin className="w-4 h-4"/> Buka di Google Maps
                </a>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8 bg-m3-primary-container/30 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] border border-m3-outline/10 shadow-sm"
            >
              <h3 className="text-3xl font-extrabold text-m3-on-surface mb-3 tracking-tight">Kirim Pesan Langsung</h3>
              <p className="text-m3-on-surface/60 mb-10 text-lg font-medium">Isi formulir di bawah ini dan representatif kami akan segera menghubungi Anda.</p>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[12px] font-black text-m3-primary uppercase tracking-[0.2em] ml-2">Nama Lengkap *</label>
                    <input required type="text" name="nama" className="w-full px-6 py-4 rounded-[1.5rem] bg-m3-surface border border-m3-outline/20 text-m3-on-surface focus:ring-4 focus:ring-m3-primary/10 focus:border-m3-primary outline-none transition-all font-semibold text-lg shadow-inner placeholder:text-m3-on-surface/20" placeholder="Budi Santoso" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[12px] font-black text-m3-primary uppercase tracking-[0.2em] ml-2">WhatsApp Aktif *</label>
                    <input required type="tel" name="wa" className="w-full px-6 py-4 rounded-[1.5rem] bg-m3-surface border border-m3-outline/20 text-m3-on-surface focus:ring-4 focus:ring-m3-primary/10 focus:border-m3-primary outline-none transition-all font-semibold text-lg shadow-inner placeholder:text-m3-on-surface/20" placeholder="0812-xxxx-xxxx" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-[12px] font-black text-m3-primary uppercase tracking-[0.2em] ml-2">Tujuan / Keperluan *</label>
                  <div className="relative group">
                    <select name="tujuan" className="w-full px-6 py-4 rounded-[1.5rem] bg-m3-surface border border-m3-outline/20 text-m3-on-surface focus:ring-4 focus:ring-m3-primary/10 focus:border-m3-primary outline-none transition-all font-bold text-lg shadow-inner appearance-none cursor-pointer">
                      <option>Tanya Harga Domba Kurban/Aqiqah</option>
                      <option>Beli Bibit / Indukan Premium</option>
                      <option>Konsultasi Pembuatan Smart Farm</option>
                      <option>Kerja Sama Suplai Limbah Buah</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-m3-primary pointer-events-none group-hover:scale-110 transition-transform"/>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[12px] font-black text-m3-primary uppercase tracking-[0.2em] ml-2">Pesan Detail *</label>
                  <textarea required rows="5" name="pesan" className="w-full px-6 py-4 rounded-[1.5rem] bg-m3-surface border border-m3-outline/20 text-m3-on-surface focus:ring-4 focus:ring-m3-primary/10 focus:border-m3-primary outline-none transition-all font-semibold text-lg shadow-inner resize-none placeholder:text-m3-on-surface/20" placeholder="Tuliskan spesifikasi domba atau pertanyaan Anda secara detail..."></textarea>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-m3-primary text-m3-on-primary font-bold text-xl py-5 rounded-[1.5rem] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                >
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                  Kirim Pesan Sekarang
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
