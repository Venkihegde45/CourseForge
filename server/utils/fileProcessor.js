import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import path from 'path';
import axios from 'axios';

/**
 * Process different file types and extract text content
 */
export class FileProcessor {
  /**
   * Process file based on its type
   */
  async processFile(filePath, mimeType) {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      if (mimeType.includes('pdf') || ext === '.pdf') {
        return await this.processPDF(filePath);
      } else if (mimeType.includes('image') || ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
        return await this.processImage(filePath);
      } else if (mimeType.includes('word') || ext === '.docx' || ext === '.doc') {
        return await this.processDocx(filePath);
      } else if (mimeType.includes('text') || ext === '.txt') {
        return await this.processText(filePath);
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error) {
      console.error('File processing error:', error);
      throw error;
    }
  }

  /**
   * Extract text from PDF
   */
  async processPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from image using OCR
   */
  async processImage(filePath) {
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            // Progress can be tracked here
          }
        }
      });
      return text;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from Word document
   */
  async processDocx(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX processing failed: ${error.message}`);
    }
  }

  /**
   * Read plain text file
   */
  async processText(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Text file reading failed: ${error.message}`);
    }
  }

  /**
   * Extract content from a URL
   */
  async processLink(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      // Simple HTML to text extraction
      let text = response.data;
      
      // Remove HTML tags
      text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      text = text.replace(/<[^>]+>/g, ' ');
      
      // Decode HTML entities
      text = text.replace(/&nbsp;/g, ' ');
      text = text.replace(/&amp;/g, '&');
      text = text.replace(/&lt;/g, '<');
      text = text.replace(/&gt;/g, '>');
      text = text.replace(/&quot;/g, '"');
      text = text.replace(/&#39;/g, "'");
      
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();
      
      return text;
    } catch (error) {
      throw new Error(`Failed to process URL: ${error.message}`);
    }
  }

  /**
   * Get file type from mime type
   */
  getFileType(mimeType) {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'docx';
    if (mimeType.includes('text')) return 'text';
    return 'unknown';
  }
}

export default new FileProcessor();

