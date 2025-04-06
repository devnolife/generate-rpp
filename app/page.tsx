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
import { FormData as RPPFormData } from "@/types/rpp"
import { configureAxios } from "@/services/api/config"

// Configure axios
configureAxios();

// Define mapping for jenjang values (if needed for processing/display)
const jenjangMapping = {
  "Sekolah Dasar": "SD",
  "Sekolah Menengah Pertama": "SMP",
  "Sekolah Menengah Atas/Kejuruan": "SMA/SMK"
};

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

    toast({
      title: "Memproses Data RPP",
      description: "Sedang membuat RPP. Mohon tunggu sebentar...",
      className: "bg-primary-lightest text-primary border-none",
    });

    RPPService.generateRPP(data)
      .then(response => {
        setRppData(response as unknown as RPPData);
        setIsRPPSubmitted(!!response);
        setActiveTab("hasil-generate");
        toast({
          title: "Berhasil!",
          description: "RPP berhasil dibuat. Anda dapat melihat hasilnya sekarang.",
          className: "bg-green-100 text-green-800 border-green-200",
        });
      })
      .catch(error => {
        console.error("Error submitting RPP data:", error);
        toast({
          title: "Gagal Membuat RPP",
          description: error.message || "Gagal mengirim data RPP. Silakan coba lagi nanti.",
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

    toast({
      title: "Membuat Kisi-Kisi",
      description: "Sedang membuat kisi-kisi berdasarkan RPP. Mohon tunggu...",
      className: "bg-amber-50 text-amber-800 border-amber-200",
    });

    RPPService.generateKisiKisi(formData)
      .then(response => {
        setKisiKisiData(response as unknown as KisiKisiData);
        setIsKisiKisiGenerated(!!response);
        setActiveTab("kisi-kisi");
        toast({
          title: "Berhasil!",
          description: "Kisi-kisi berhasil dibuat.",
          className: "bg-amber-100 text-amber-800 border-amber-200",
        });
      })
      .catch(error => {
        console.error("Error generating Kisi-Kisi:", error);
        toast({
          title: "Gagal Membuat Kisi-Kisi",
          description: error.message || "Gagal membuat Kisi-Kisi. Silakan coba lagi nanti.",
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

    toast({
      title: "Membuat Soal",
      description: "Sedang membuat soal berdasarkan kisi-kisi. Mohon tunggu...",
      className: "bg-blue-50 text-blue-800 border-blue-200",
    });

    RPPService.generateSoal(formData)
      .then(response => {
        setSoalData(response as unknown as SoalData);
        setIsSoalGenerated(!!response);
        setActiveTab("soal");
        toast({
          title: "Berhasil!",
          description: "Soal berhasil dibuat.",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        });
      })
      .catch(error => {
        console.error("Error generating Soal:", error);
        toast({
          title: "Gagal Membuat Soal",
          description: error.message || "Gagal membuat Soal. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingSoal(false);
      });
  };

  // Update useEffect to reflect data availability in state
  useEffect(() => {
    // Update status indicators based on actual data availability
    setIsRPPSubmitted(!!rppData);
    setIsKisiKisiGenerated(!!kisiKisiData);
    setIsSoalGenerated(!!soalData);
  }, [rppData, kisiKisiData, soalData]);

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
              RppCreator
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
                    disabled={isLoadingKisiKisi}
                    className={`${isLoadingKisiKisi
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FFEB00] to-amber-400 hover:shadow-lg"
                      } text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all`}
                    whileHover={{ scale: isLoadingKisiKisi ? 1 : 1.03 }}
                    whileTap={{ scale: isLoadingKisiKisi ? 1 : 0.97 }}
                  >
                    {isLoadingKisiKisi ? (
                      <>
                        <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">Membuat...</span>
                      </>
                    ) : (
                      <>
                        <Grid3X3 className="h-4 w-4" />
                        <span className="font-medium">Buat Kisi-Kisi</span>
                      </>
                    )}
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
                    disabled={isLoadingSoal}
                    className={`${isLoadingSoal
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#4379F2] to-blue-400 hover:shadow-lg"
                      } text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all`}
                    whileHover={{ scale: isLoadingSoal ? 1 : 1.03 }}
                    whileTap={{ scale: isLoadingSoal ? 1 : 0.97 }}
                  >
                    {isLoadingSoal ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">Membuat...</span>
                      </>
                    ) : (
                      <>
                        <FileQuestion className="h-4 w-4" />
                        <span className="font-medium">Buat Soal</span>
                      </>
                    )}
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

