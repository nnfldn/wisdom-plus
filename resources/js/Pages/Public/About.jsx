import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Award, Target, ShieldCheck, ArrowRight, Activity, Users, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const IconRenderer = ({ name, size = 24, className = "" }) => {
    switch (name) {
        case 'Award': return <Award size={size} className={className} />;
        case 'Target': return <Target size={size} className={className} />;
        case 'ShieldCheck': return <ShieldCheck size={size} className={className} />;
        case 'Activity': return <Activity size={size} className={className} />;
        case 'Users': return <Users size={size} className={className} />;
        case 'Star': return <Star size={size} className={className} />;
        case 'TrendingUp': return <TrendingUp size={size} className={className} />;
        default: return <Star size={size} className={className} />;
    }
};

const SectionRenderer = ({ section, isAdmin = false }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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

    if (section.key === 'hero') {
        return (
            <section className="bg-white pt-0 pb-[37px] relative overflow-hidden border-b border-slate-100">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#2B5E41 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-7xl mx-auto px-6 relative z-10 text-center"
                >
                    <h1
                        className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tighter uppercase italic"
                        dangerouslySetInnerHTML={{ __html: section.title }}
                    />
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        {section.subtitle}
                    </p>
                </motion.div>
            </section>
        );
    }

    if (section.key === 'story') {
        return (
            <div className="pt-0 pb-[37px] max-w-7xl mx-auto px-6 mt-16 md:mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-6 bg-m3-primary/5 rounded-[3rem] -rotate-2"></div>
                        <img
                            src={section.image_url}
                            alt="Peternakan Modern"
                            className="relative z-10 rounded-[2.5rem] object-cover h-[560px] w-full border border-slate-100 shadow-sm"
                        />
                        {section.content?.stats?.length > 0 && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="absolute -bottom-10 -right-6 bg-white p-8 rounded-3xl z-20 flex items-center gap-5 border border-slate-100 shadow-xl"
                            >
                                <div className="bg-m3-primary p-3 rounded-2xl shadow-lg shadow-emerald-900/20">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-slate-800 tracking-tight">{section.content.stats[0].value}</p>
                                    <p className="text-xs font-bold text-m3-primary uppercase tracking-widest opacity-60">{section.content.stats[0].label}</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants}>
                            <span className="inline-block px-4 py-1.5 bg-m3-primary/10 text-m3-primary font-bold tracking-widest uppercase text-[10px] rounded-full mb-4 border border-m3-primary/5">
                                Kisah Kami
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-[1.1] tracking-tighter">
                                {section.title}
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                {section.content?.description}
                            </p>
                        </motion.div>

                        <motion.p variants={itemVariants} className="text-slate-500 text-lg leading-relaxed font-medium">
                            {section.subtitle}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (section.key === 'values') {
        return (
            <section className="py-24 px-6 bg-white border-y border-slate-100 mt-16 md:mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-[1.1] tracking-tighter">
                            {section.title}
                        </h2>
                        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
                            {section.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {section.content?.map((val, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[3rem] bg-m3-surface border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-m3-primary shadow-m3-soft mb-8">
                                    <IconRenderer name={val.icon} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 mb-4">{val.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return null;
};

export default function About({ aboutSections = [] }) {
    return (
        <PublicLayout currentRoute="about">
            <Head title="Tentang Kami" />
            <div className="bg-m3-surface min-h-screen font-sans selection:bg-m3-primary selection:text-white">

                {aboutSections.map((section) => (
                    <SectionRenderer key={section.id} section={section} />
                ))}

                {/* CTA Section - Fixed for now, or could be a module too */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white mx-6 mb-24 rounded-[4rem] pt-16 md:pt-24 pb-16 md:pb-24 px-6 relative overflow-hidden border border-slate-100 shadow-m3-soft mt-24"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-m3-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-m3-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight tracking-tighter uppercase italic">
                            Ingin Menjadi Bagian Dari <span className="text-m3-primary">Revolusi Kami?</span>
                        </h2>
                        <p className="text-slate-500 mb-10 text-xl font-medium max-w-2xl mx-auto">
                            Kami membuka kesempatan kemitraan suplai pakan limbah maupun pembelian bibit indukan premium.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 bg-m3-primary text-white px-10 py-5 rounded-full font-black shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all duration-300 group uppercase tracking-widest text-xs"
                            >
                                Hubungi Tim Kemitraan
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>
            </div>
        </PublicLayout>
    );
}
