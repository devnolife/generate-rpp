"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RPPForm } from "@/components/rpp-form"
import { FloatingElements } from "@/components/floating-elements"
import { HasilRPP, type RPPData } from "@/components/hasil-rpp"
import { KisiKisi, type KisiKisiData } from "@/components/kisi-kisi"
import { Soal, type SoalData } from "@/components/soal"
import { Sparkles, FileText, Grid3X3, FileQuestion, Crown, Zap } from "lucide-react"
import { HasilRPPSkeleton } from "@/components/skeletons/hasil-rpp-skeleton"
import { KisiKisiSkeleton } from "@/components/skeletons/kisi-kisi-skeleton"
import { SoalSkeleton } from "@/components/skeletons/soal-skeleton"
import { toast } from "@/components/ui/use-toast"
import { RPPService } from "@/services/api/rpp"
import { RPPFormData } from "@/types/rpp"
import { configureAxios } from "@/services/api/config"

// Configure axios
configureAxios();

export default function Home() {
  const [activeTab, setActiveTab] = useState("buat-rpp")
  const [rppData, setRppData] = useState<RPPData | null>(null)
  const [kisiKisiData, setKisiKisiData] = useState<KisiKisiData | null>(null)
  const [soalData, setSoalData] = useState<SoalData | null>(null)
  const [isLoadingRPP, setIsLoadingRPP] = useState(false)
  const [isLoadingKisiKisi, setIsLoadingKisiKisi] = useState(false)
  const [isLoadingSoal, setIsLoadingSoal] = useState(false)

  // Tambahkan state untuk melacak status pengisian form
  const [isRPPSubmitted, setIsRPPSubmitted] = useState(false)
  const [isKisiKisiGenerated, setIsKisiKisiGenerated] = useState(false)
  const [isSoalGenerated, setIsSoalGenerated] = useState(false)

  // Store form data for reuse with other API calls
  const [formData, setFormData] = useState<RPPFormData | null>(null)

  const tabs = [
    { id: "buat-rpp", label: "Buat RPP", icon: <FileText className="h-5 w-5 text-[#117554]" /> },
    { id: "hasil-generate", label: "Hasil Generate", icon: <Sparkles className="h-5 w-5 text-[#6EC207]" /> },
    { id: "kisi-kisi", label: "Kisi Kisi", icon: <Grid3X3 className="h-5 w-5 text-[#FFEB00]" /> },
    { id: "soal", label: "Soal", icon: <FileQuestion className="h-5 w-5 text-[#4379F2]" /> },
  ]

  // Fungsi untuk menangani submit form RPP
  const handleRPPSubmit = (data: RPPFormData) => {
    setFormData(data);
    setIsLoadingRPP(true);

    RPPService.generateRPP(data)
      .then(response => {
        setRppData(response as unknown as RPPData);
        setIsRPPSubmitted(true);
        setActiveTab("hasil-generate");
      })
      .catch(error => {
        console.error("Error submitting RPP data:", error);
        toast({
          title: "Error",
          description: "Gagal mengirim data RPP. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingRPP(false);
      });
  };

  // Fungsi untuk menangani pembuatan Kisi-Kisi
  const handleGenerateKisiKisi = () => {
    if (!formData) return;

    setIsLoadingKisiKisi(true);
    RPPService.generateKisiKisi(formData)
      .then(response => {
        setKisiKisiData(response as unknown as KisiKisiData);
        setIsKisiKisiGenerated(true);
        setActiveTab("kisi-kisi");
      })
      .catch(error => {
        console.error("Error generating Kisi-Kisi:", error);
        toast({
          title: "Error",
          description: "Gagal membuat Kisi-Kisi. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingKisiKisi(false);
      });
  };

  // Fungsi untuk menangani pembuatan Soal
  const handleGenerateSoal = () => {
    if (!formData) return;

    setIsLoadingSoal(true);
    RPPService.generateSoal(formData)
      .then(response => {
        setSoalData(response as unknown as SoalData);
        setIsSoalGenerated(true);
        setActiveTab("soal");
      })
      .catch(error => {
        console.error("Error generating Soal:", error);
        toast({
          title: "Error",
          description: "Gagal membuat Soal. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingSoal(false);
      });
  };

  return (
    // Ubah background gradient pada main element
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 relative overflow-hidden py-8 px-4">
      <FloatingElements />

      <div className="container mx-auto max-w-6xl relative z-10">
        <header className="mb-8 text-center">
          <div className="inline-block relative mb-3">
            <div className="absolute -top-6 -right-6">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 5, scale: 1 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 2,
                }}
              >
                <Crown className="h-8 w-8 text-primary-light drop-shadow-md" />
              </motion.div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              EduCreator
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto flex items-center justify-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-primary" />
            Platform modern untuk membuat materi pembelajaran
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg flex gap-2 border border-gray-100 max-w-full overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  // Cek apakah tab bisa diakses
                  if (tab.id === "hasil-generate" && !isRPPSubmitted) {
                    toast({
                      title: "Perhatian",
                      description: "Anda harus membuat RPP terlebih dahulu",
                      variant: "destructive",
                    })
                    return
                  }
                  if (tab.id === "kisi-kisi" && !isKisiKisiGenerated) {
                    toast({
                      title: "Perhatian",
                      description: "Anda harus membuat Kisi-Kisi terlebih dahulu",
                      variant: "destructive",
                    })
                    return
                  }
                  if (tab.id === "soal" && !isSoalGenerated) {
                    toast({
                      title: "Perhatian",
                      description: "Anda harus membuat Soal terlebih dahulu",
                      variant: "destructive",
                    })
                    return
                  }
                  setActiveTab(tab.id)
                }}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md"
                  : (
                    (tab.id === "hasil-generate" && !isRPPSubmitted) ||
                    (tab.id === "kisi-kisi" && !isKisiKisiGenerated) ||
                    (tab.id === "soal" && !isSoalGenerated)
                  )
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                whileHover={{
                  scale:
                    (tab.id === "hasil-generate" && !isRPPSubmitted) ||
                      (tab.id === "kisi-kisi" && !isKisiKisiGenerated) ||
                      (tab.id === "soal" && !isSoalGenerated)
                      ? 1
                      : 1.03,
                }}
                whileTap={{
                  scale:
                    (tab.id === "hasil-generate" && !isRPPSubmitted) ||
                      (tab.id === "kisi-kisi" && !isKisiKisiGenerated) ||
                      (tab.id === "soal" && !isSoalGenerated)
                      ? 1
                      : 0.97,
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.span layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "buat-rpp" && (
            <motion.div
              key="buat-rpp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RPPForm onSubmit={handleRPPSubmit} />
            </motion.div>
          )}

          {activeTab === "hasil-generate" && (
            <motion.div
              key="hasil-generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-[#6EC207]" />
                  <h2 className="text-2xl font-bold text-gray-800">Hasil Generate</h2>
                </div>

                {!isKisiKisiGenerated && (
                  <motion.button
                    onClick={handleGenerateKisiKisi}
                    className="bg-gradient-to-r from-[#FFEB00] to-amber-400 text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="font-medium">Buat Kisi-Kisi</span>
                  </motion.button>
                )}
              </div>

              {isLoadingRPP ? (
                <HasilRPPSkeleton />
              ) : (
                rppData ? <HasilRPP data={rppData} onGenerateKisiKisi={handleGenerateKisiKisi} /> : <div className="text-center py-8 text-gray-500">Belum ada data RPP</div>
              )}
            </motion.div>
          )}

          {activeTab === "kisi-kisi" && (
            <motion.div
              key="kisi-kisi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Grid3X3 className="h-6 w-6 text-[#FFEB00]" />
                  <h2 className="text-2xl font-bold text-gray-800">Kisi-Kisi</h2>
                </div>

                {!isSoalGenerated && (
                  <motion.button
                    onClick={handleGenerateSoal}
                    className="bg-gradient-to-r from-[#4379F2] to-blue-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FileQuestion className="h-4 w-4" />
                    <span className="font-medium">Buat Soal</span>
                  </motion.button>
                )}
              </div>

              {isLoadingKisiKisi ? (
                <KisiKisiSkeleton />
              ) : (
                kisiKisiData ? <KisiKisi data={kisiKisiData} onGenerateSoal={handleGenerateSoal} /> : <div className="text-center py-8 text-gray-500">Belum ada data Kisi-Kisi</div>
              )}
            </motion.div>
          )}

          {activeTab === "soal" && (
            <motion.div
              key="soal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileQuestion className="h-6 w-6 text-[#4379F2]" />
                <h2 className="text-2xl font-bold text-gray-800">Soal</h2>
              </div>

              {isLoadingSoal ? <SoalSkeleton /> : (
                soalData ? <Soal data={soalData} /> : <div className="text-center py-8 text-gray-500">Belum ada data Soal</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

