// server/src/services/linkedinService.ts
import Profile from '../models/Profile';
import { InternalServerError } from '../utils/errors/AppError';
import { getApifyToken } from '../utils/apiKeyHelpers';
import fs from 'fs';
import path from 'path';
import { uploadImageToCloudinary } from '../config/cloudinary';

interface LinkedInProfileData {
  basic_info?: {
    fullname?: string;
    headline?: string;
    about?: string;
    location?: {
      full?: string;
      city?: string;
      country?: string;
    };
    profile_picture_url?: string;
    profileImageUrl?: string;
    profilePicture?: string;
    image?: string;
    photo?: string;
    profile_image?: string;
  };
  profile_picture_url?: string;
  profileImageUrl?: string;
  profilePicture?: string;
  image?: string;
  photo?: string;
  profile_image?: string;
  summary?: string;
  bio?: string;
  description?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    description?: string;
    location?: string;
    start_date?: {
      year?: number;
      month?: string;
    };
    end_date?: {
      year?: number;
      month?: string;
    };
    is_current?: boolean;
    skills?: string[];
  }>;
  skills?: Array<string | { name?: string; title?: string }>;
  languages?: Array<{
    language?: string;
    proficiency?: string;
  }>;
}


/**
 * Helper to download and save an image locally
 */
const downloadAndSaveImage = async (url: string, userId: string): Promise<string> => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads/profile-images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    let ext = '.jpg';
    if (contentType === 'image/png') ext = '.png';
    else if (contentType === 'image/jpeg') ext = '.jpg';
    else if (contentType === 'image/webp') ext = '.webp';

    const filename = `profile_${userId}_${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);

    return `/uploads/profile-images/${filename}`;
  } catch (error) {
    console.error(`[LinkedIn API] Failed to download image: ${error}`);
    throw error;
  }
};

/**
 * Extract username from LinkedIn URL
 */
export const getUsernameFromUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split('/').filter((part) => part.length > 0);
    if (parts[0] === 'in' && parts[1]) {
      return parts[1];
    }
  } catch (e) {
    console.error('[LinkedIn API] Invalid LinkedIn URL:', url);
    return null;
  }
  return null;
};

/**
 * Fetch LinkedIn profile using RapidAPI "Fresh LinkedIn Profile Data" endpoint.
 * Uses the same JSEARCH_API_KEY (RapidAPI key) already used for job search.
 * @param userId - User ID (used to retrieve the API key)
 * @param username - LinkedIn username (e.g. "johndoe")
 */
export const fetchLinkedInProfile = async (userId: string, username: string): Promise<LinkedInProfileData | null> => {
  const rapidApiKey = await getApifyToken(userId);

  const linkedInUrl = `https://www.linkedin.com/in/${username}/`;
  const apiUrl = `https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile?linkedin_url=${encodeURIComponent(linkedInUrl)}&include_skills=true&include_certifications=false&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=false&include_organizations=false`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
      'x-rapidapi-key': rapidApiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new InternalServerError(
      `LinkedIn profile fetch failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  const profile = data?.data ?? data;

  if (!profile || typeof profile !== 'object') {
    return null;
  }

  // Normalise Fresh LinkedIn Profile Data response to LinkedInProfileData shape
  return {
    basic_info: {
      fullname: profile.full_name ?? profile.fullName ?? profile.name,
      headline: profile.headline ?? profile.title,
      about: profile.about ?? profile.summary,
      location: {
        full: profile.location ?? profile.geo?.full,
        city: profile.city ?? profile.geo?.city,
        country: profile.country ?? profile.geo?.country,
      },
      profile_picture_url:
        profile.profile_picture_url ?? profile.profilePicture ?? profile.photo_url,
    },
    experience: (profile.experiences ?? profile.experience ?? profile.positions ?? []).map((exp: any) => ({
      title: exp.title,
      company: exp.company ?? exp.companyName ?? exp.company_name,
      description: exp.description,
      location: exp.location,
      start_date: exp.start_date ?? (exp.start ? { year: exp.start.year, month: String(exp.start.month ?? '') } : undefined),
      end_date: exp.end_date ?? (exp.end ? { year: exp.end.year, month: String(exp.end.month ?? '') } : undefined),
      is_current: exp.is_current ?? exp.end == null,
    })),
    skills: (profile.skills ?? []).map((s: any) =>
      typeof s === 'string' ? s : s.name ?? s.title ?? ''
    ),
    languages: (profile.languages ?? []).map((l: any) => ({
      language: l.name ?? l.language,
      proficiency: l.proficiency,
    })),
  } as LinkedInProfileData;
};

/**
 * Update user profile with LinkedIn data
 */
export const updateProfileFromLinkedInData = async (
  userId: string,
  linkedinData: LinkedInProfileData,
  forceUpdate: boolean = false
): Promise<void> => {
  try {
    console.log(
      `[LinkedIn API] Updating profile for user ${userId} with LinkedIn data${forceUpdate ? ' (force update)' : ''}`
    );

    // Get current profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      console.warn(`[LinkedIn API] Profile not found for user ${userId}`);
      return;
    }

    const updates: Partial<typeof profile> = {};

    // Update basic profile fields if they're empty or if force update is enabled
    if (linkedinData.basic_info?.fullname && (!profile.name || forceUpdate)) {
      updates.name = linkedinData.basic_info.fullname;
    }

    if (linkedinData.basic_info?.headline && (!profile.title || forceUpdate)) {
      updates.title = linkedinData.basic_info.headline;
    }

    // Use about/bio in order of preference
    const bioText =
      linkedinData.basic_info?.about ||
      linkedinData.summary ||
      linkedinData.bio ||
      linkedinData.description;
    if (bioText && (!profile.bio || forceUpdate)) {
      updates.bio = bioText;
    }

    if (linkedinData.basic_info?.location && (!profile.location || forceUpdate)) {
      // Use the full location string if available, otherwise construct from city/country
      const location =
        linkedinData.basic_info.location.full ||
        linkedinData.basic_info.location.city ||
        `${linkedinData.basic_info.location.city}, ${linkedinData.basic_info.location.country}`;
      updates.location = location;
    }

    // Extract profile image from various possible field names
    const profileImageUrl =
      linkedinData.basic_info?.profile_picture_url ||
      linkedinData.basic_info?.profileImageUrl ||
      linkedinData.basic_info?.profilePicture ||
      linkedinData.basic_info?.image ||
      linkedinData.basic_info?.photo ||
      linkedinData.basic_info?.profile_image ||
      linkedinData.profile_picture_url ||
      linkedinData.profileImageUrl ||
      linkedinData.profilePicture ||
      linkedinData.image ||
      linkedinData.photo ||
      linkedinData.profile_image;


    if (profileImageUrl && (!profile.profileImageUrl || forceUpdate)) {
      try {
        // Upload to Cloudinary
        const cloudImageUrl = await uploadImageToCloudinary(profileImageUrl, `user_${userId}/profile`);
        updates.profileImageUrl = cloudImageUrl;
        console.log(`[LinkedIn API] Uploaded profile image to Cloudinary: ${cloudImageUrl}`);
      } catch (err) {
        // Fallback to original URL if upload fails
        console.warn(`[LinkedIn API] Cloudinary upload failed, falling back to remote URL: ${err}`);
        updates.profileImageUrl = profileImageUrl;
      }
    }

    // Update LinkedIn experience, skills, and languages
    if (linkedinData.experience && (forceUpdate || !profile.linkedInExperience || profile.linkedInExperience.length === 0)) {
      updates.linkedInExperience = linkedinData.experience.map((exp) => ({
        title: exp.title,
        company: exp.company,
        description: exp.description,
        location: exp.location,
        startDate: exp.start_date ? { year: exp.start_date.year, month: exp.start_date.month } : undefined,
        endDate: exp.end_date ? { year: exp.end_date.year, month: exp.end_date.month } : undefined,
        isCurrent: exp.is_current,
      }));
    }

    if (linkedinData.skills && (forceUpdate || !profile.linkedInSkills || profile.linkedInSkills.length === 0)) {
      updates.linkedInSkills = linkedinData.skills.map((skill) =>
        typeof skill === 'string' ? skill : skill.name || skill.title || ''
      ).filter(Boolean);
    }

    if (linkedinData.languages && (forceUpdate || !profile.linkedInLanguages || profile.linkedInLanguages.length === 0)) {
      updates.linkedInLanguages = linkedinData.languages.map((lang) => ({
        language: lang.language,
        proficiency: lang.proficiency,
      }));
    }

    // Update profile if we have changes
    if (Object.keys(updates).length > 0) {
      await Profile.findOneAndUpdate({ userId }, { $set: updates }, { new: true });
      console.log(`[LinkedIn API] Updated profile fields: ${Object.keys(updates).join(', ')}`);
    }

    console.log(`[LinkedIn API] Successfully updated profile for user ${userId} with LinkedIn data`);
  } catch (error: any) {
    console.error(`[LinkedIn API] Error updating profile from LinkedIn data: ${error.message}`);
    // Don't throw - we don't want to fail the sync if profile update fails
  }
};

/**
 * Extract relevant data from LinkedIn profile
 */
export const extractLinkedInData = (profileData: LinkedInProfileData): {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  profileImageUrl?: string;
  experience?: any[];
  skills?: string[];
  languages?: any[];
} => {
  // Extract profile image from various possible field names
  const profileImageUrl =
    profileData.basic_info?.profile_picture_url ||
    profileData.basic_info?.profileImageUrl ||
    profileData.basic_info?.profilePicture ||
    profileData.basic_info?.image ||
    profileData.basic_info?.photo ||
    profileData.basic_info?.profile_image ||
    profileData.profile_picture_url ||
    profileData.profileImageUrl ||
    profileData.profilePicture ||
    profileData.image ||
    profileData.photo ||
    profileData.profile_image;

  return {
    name: profileData.basic_info?.fullname,
    title: profileData.basic_info?.headline,
    bio:
      profileData.basic_info?.about ||
      profileData.summary ||
      profileData.bio ||
      profileData.description,
    location: profileData.basic_info?.location?.full || profileData.basic_info?.location?.city,
    profileImageUrl,
    experience: profileData.experience || [],
    skills: profileData.skills?.map((skill) =>
      typeof skill === 'string' ? skill : skill.name || skill.title || ''
    ) || [],
    languages: profileData.languages || [],
  };
};

