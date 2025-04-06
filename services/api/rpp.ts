import { FormData, RPPResponse, KisiKisiResponse, SoalResponse } from '@/types/rpp';
import { apiClient } from './config';

/**
 * RPP API service that handles all RPP-related API calls
 */
export const RPPService = {
  /**
   * Generate a new RPP based on form data
   * @param formData The form data required to generate an RPP
   * @returns The generated RPP response
   */
  generateRPP: async (formData: FormData): Promise<RPPResponse> => {
    try {
      const response = await apiClient.post<RPPResponse>(
        '/education/generate-rpp',
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Error generating RPP:', error);
      throw error;
    }
  },

  /**
   * Generate kisi-kisi based on RPP form data
   * @param formData The form data containing mata_pelajaran and kelas
   * @returns The generated kisi-kisi response
   */
  generateKisiKisi: async (formData: FormData): Promise<KisiKisiResponse> => {
    try {
      // Extract only the required fields for the kisi-kisi API
      const kisiKisiData = {
        mata_pelajaran: formData.mata_pelajaran,
        kelas: formData.kelas,
        materi: formData.konten_utama, // Using konten_utama as materi
      };

      const response = await apiClient.post<KisiKisiResponse>(
        '/education/generate-kisi-kisi',
        kisiKisiData
      );
      return response.data;
    } catch (error) {
      console.error('Error generating Kisi-Kisi:', error);
      throw error;
    }
  },

  /**
   * Generate soal based on RPP form data
   * @param formData The form data required to generate soal
   * @returns The generated soal response
   */
  generateSoal: async (formData: FormData): Promise<SoalResponse> => {
    try {
      // Extract only the required fields for the soal API
      const soalData = {
        mata_pelajaran: formData.mata_pelajaran,
        kelas: formData.kelas,
        materi: formData.konten_utama, // Using konten_utama as materi
        jumlah: "10" // Default to 10 questions
      };

      const response = await apiClient.post<SoalResponse>(
        '/english/generate-questions',
        soalData
      );
      return response.data;
    } catch (error) {
      console.error('Error generating Soal:', error);
      throw error;
    }
  }
}; 
