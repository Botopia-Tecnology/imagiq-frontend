/**
 * Utility functions for home page configuration
 */

import type { HomeSectionConfig, HomeSectionType } from './types';

/**
 * Filters and sorts enabled sections
 *
 * @param sections - Array of section configurations
 * @returns Sorted array of enabled sections
 */
export function getEnabledSections(
  sections: HomeSectionConfig[]
): HomeSectionConfig[] {
  return sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);
}

/**
 * Gets sections by type
 *
 * @param sections - Array of section configurations
 * @param type - Section type to filter by
 * @returns Filtered array of sections
 */
export function getSectionsByType(
  sections: HomeSectionConfig[],
  type: HomeSectionType
): HomeSectionConfig[] {
  return sections.filter((section) => section.type === type && section.enabled);
}

/**
 * Validates video URL format
 *
 * @param url - Video URL to validate
 * @returns True if valid video URL
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const hasValidExtension = videoExtensions.some((ext) =>
    url.toLowerCase().includes(ext)
  );

  try {
    new URL(url);
    return hasValidExtension;
  } catch {
    return false;
  }
}

/**
 * Validates image URL format
 *
 * @param url - Image URL to validate
 * @returns True if valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const hasValidExtension = imageExtensions.some((ext) =>
    url.toLowerCase().includes(ext)
  );

  try {
    new URL(url);
    return hasValidExtension;
  } catch {
    return false;
  }
}

/**
 * Gets fallback poster image based on video URL
 * Useful when poster is not provided
 *
 * @param videoUrl - Video URL
 * @returns Fallback poster URL or empty string
 */
export function getFallbackPoster(videoUrl: string): string {
  if (!videoUrl) return '';

  // Try to get poster by replacing video extension with .jpg
  return videoUrl.replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg');
}

/**
 * Validates hex color format
 *
 * @param color - Hex color string
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  if (!color) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}
