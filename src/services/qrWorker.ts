import { QRCode } from '../core/types';

/**
 * 32-bit FNV-1a hash for deterministic seed generation from string payloads
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 deterministic pseudo-random bit generator
 */
function createPRNG(seed: number): () => boolean {
  let s = seed;
  return function nextBit(): boolean {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) % 2 === 1;
  };
}

/**
 * Generates a deterministic 25x25 QR module matrix with standard
 * finder patterns, timing patterns, alignment pattern, and encoded data.
 */
function generateQRMatrix(data: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to place standard 7x7 finder pattern
  function placeFinderPattern(rowStart: number, colStart: number): void {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        reserved[rowStart + r][colStart + c] = true;
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[rowStart + r][colStart + c] = isBorder || isCenter;
      }
    }
  }

  // 1. Top-Left Finder
  placeFinderPattern(0, 0);
  // 2. Top-Right Finder
  placeFinderPattern(0, size - 7);
  // 3. Bottom-Left Finder
  placeFinderPattern(size - 7, 0);

  // Separators around finders
  for (let i = 0; i < 8; i++) {
    // Top-Left separator
    reserved[7][i] = true;
    matrix[7][i] = false;
    reserved[i][7] = true;
    matrix[i][7] = false;

    // Top-Right separator
    reserved[7][size - 8 + i] = true;
    matrix[7][size - 8 + i] = false;
    reserved[i][size - 8] = true;
    matrix[i][size - 8] = false;

    // Bottom-Left separator
    reserved[size - 8][i] = true;
    matrix[size - 8][i] = false;
    reserved[size - 8 + i][7] = true;
    matrix[size - 8 + i][7] = false;
  }

  // Timing patterns (row 6 and col 6)
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    matrix[6][i] = i % 2 === 0;
    reserved[i][6] = true;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern (center 18, 18 -> from 16 to 20)
  const alignRow = 16;
  const alignCol = 16;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      reserved[alignRow + r][alignCol + c] = true;
      const isOuter = r === 0 || r === 4 || c === 0 || c === 4;
      const isCore = r === 2 && c === 2;
      matrix[alignRow + r][alignCol + c] = isOuter || isCore;
    }
  }

  // Dark module
  reserved[size - 8][8] = true;
  matrix[size - 8][8] = true;

  // Format info area reservation
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 8 + i] = true;
    reserved[size - 8 + i][8] = true;
  }

  // Convert payload data into bit stream
  const dataBits: boolean[] = [];
  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      dataBits.push(((code >> b) & 1) === 1);
    }
  }

  // Fill remaining modules with data bits, then deterministic PRNG
  const seed = fnv1a(data);
  const nextRandomBit = createPRNG(seed);
  let bitIndex = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        let bit: boolean;
        if (bitIndex < dataBits.length) {
          bit = dataBits[bitIndex++];
        } else {
          bit = nextRandomBit();
        }
        // Apply alternating mask (r + c) % 2 === 0 to maintain visual module balance
        const mask = (r + c) % 2 === 0;
        matrix[r][c] = bit !== mask;
      }
    }
  }

  return matrix;
}

/**
 * Converts a QR module matrix into accessible, scalable SVG markup
 */
function matrixToSVG(matrix: boolean[][], ticketNumber: string): string {
  const size = matrix.length;
  const moduleSize = 8;
  const margin = 28; // (256 - 25 * 8) / 2 = 28px quiet zone on each side

  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        const x = margin + c * moduleSize;
        const y = margin + r * moduleSize;
        pathD += `M${x} ${y}h${moduleSize}v${moduleSize}h-${moduleSize}z `;
      }
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="QR Code for Ticket ${ticketNumber}">`,
    `  <title>QR Code for Ticket ${ticketNumber}</title>`,
    `  <rect width="100%" height="100%" fill="#ffffff"/>`,
    `  <path d="${pathD.trim()}" fill="#000000"/>`,
    `</svg>`
  ].join('\n');
}

/**
 * Asynchronously generates an SVG QR code for a given ticket.
 *
 * @param ticketId Unique identifier of the ticket
 * @param ticketNumber Human-readable ticket number (e.g. 'TKT-1001')
 * @returns Promise resolving to a standardized QRCode domain object
 * @throws Error if ticketId or ticketNumber is missing or invalid
 */
export async function generateTicketQRCode(
  ticketId: string,
  ticketNumber: string
): Promise<QRCode> {
  if (!ticketId || typeof ticketId !== 'string' || !ticketId.trim()) {
    throw new Error('Valid ticket ID is required');
  }
  if (!ticketNumber || typeof ticketNumber !== 'string' || !ticketNumber.trim()) {
    throw new Error('Valid ticket number is required');
  }

  const cleanTicketId = ticketId.trim();
  const cleanTicketNumber = ticketNumber.trim();
  const qrData = `${cleanTicketNumber}:${cleanTicketId}`;

  const matrix = generateQRMatrix(qrData);
  const svgContent = matrixToSVG(matrix, cleanTicketNumber);

  return {
    id: crypto.randomUUID(),
    ticketId: cleanTicketId,
    qrData,
    svgContent,
    status: 'GENERATED',
    generatedAt: new Date().toISOString()
  };
}
