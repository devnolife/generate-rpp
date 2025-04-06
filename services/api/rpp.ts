import { RPPFormData, RPPResponse, KisiKisiResponse, SoalResponse } from '@/types/rpp';
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
  generateRPP: async (formData: RPPFormData): Promise<RPPResponse> => {
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
   * @param formData The form data required to generate kisi-kisi
   * @returns The generated kisi-kisi response
   */
  generateKisiKisi: async (formData: RPPFormData): Promise<KisiKisiResponse> => {
    try {
      const response = await apiClient.post<KisiKisiResponse>(
        '/education/generate-rpp/kisi-kisi',
        formData
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
  generateSoal: async (formData: RPPFormData): Promise<SoalResponse> => {
    try {
      const response = await apiClient.post<SoalResponse>(
        '/education/generate-rpp/soal',
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Error generating Soal:', error);
      throw error;
    }
  }
}; 
