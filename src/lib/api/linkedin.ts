import { supabase } from "../supabase";

export type LinkedInProfile = {
  id: string;
  userId: string;
  headline: string | null;
  summary: string | null;
  skills: string[];
  experience: any[] | null;
  education: any[] | null;
  profileScore: number | null;
  lastUpdated: string;
};

export type ProfileOptimization = {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  implementationGuide: string;
};

export type ContentIdea = {
  id: string;
  title: string;
  description: string;
  category: string;
  template: string;
  examples: string[];
};

export const getLinkedInProfile = async (
  userId: string,
): Promise<LinkedInProfile | null> => {
  const { data, error } = await supabase
    .from("linkedin_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    headline: data.headline,
    summary: data.summary,
    skills: data.skills || [],
    experience: data.experience,
    education: data.education,
    profileScore: data.profile_score,
    lastUpdated: data.last_updated,
  };
};

export const createOrUpdateLinkedInProfile = async (
  userId: string,
  profileData: Partial<Omit<LinkedInProfile, "id" | "userId" | "lastUpdated">>,
): Promise<string> => {
  // Check if profile exists
  const existingProfile = await getLinkedInProfile(userId);

  const profileUpdateData = {
    ...profileData,
    last_updated: new Date(),
  };

  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from("linkedin_profiles")
      .update({
        headline:
          profileData.headline !== undefined
            ? profileData.headline
            : existingProfile.headline,
        summary:
          profileData.summary !== undefined
            ? profileData.summary
            : existingProfile.summary,
        skills: profileData.skills || existingProfile.skills,
        experience: profileData.experience || existingProfile.experience,
        education: profileData.education || existingProfile.education,
        profile_score: profileData.profileScore || existingProfile.profileScore,
        last_updated: new Date(),
      })
      .eq("id", existingProfile.id);

    if (error) throw error;
    return existingProfile.id;
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from("linkedin_profiles")
      .insert([
        {
          user_id: userId,
          headline: profileData.headline,
          summary: profileData.summary,
          skills: profileData.skills || [],
          experience: profileData.experience || [],
          education: profileData.education || [],
          profile_score: profileData.profileScore || 0,
          last_updated: new Date(),
        },
      ])
      .select();

    if (error) throw error;
    return data[0].id;
  }
};

export const getProfileOptimizations = async (): Promise<
  ProfileOptimization[]
> => {
  const { data, error } = await supabase
    .from("linkedin_optimizations")
    .select("*");

  if (error) throw error;

  return data.map((opt) => ({
    id: opt.id,
    category: opt.category,
    title: opt.title,
    description: opt.description,
    impact: opt.impact,
    implementationGuide: opt.implementation_guide,
  }));
};

export const getContentIdeas = async (
  category?: string,
): Promise<ContentIdea[]> => {
  let query = supabase.from("linkedin_content_ideas").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((idea) => ({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    category: idea.category,
    template: idea.template,
    examples: idea.examples,
  }));
};

export const analyzeLinkedInProfile = async (
  profileData: any,
): Promise<{
  score: number;
  recommendations: {
    category: string;
    title: string;
    description: string;
    impact: string;
  }[];
}> => {
  // In a real implementation, this would call an AI service or algorithm
  // For now, we'll return mock data
  return {
    score: 68,
    recommendations: [
      {
        category: "headline",
        title: "Enhance your headline",
        description:
          "Make your headline more compelling with keywords relevant to your industry",
        impact: "medium",
      },
      {
        category: "skills",
        title: "Add more skills",
        description:
          "You've added 12 skills, but LinkedIn allows up to 50. Add more relevant skills to appear in more searches",
        impact: "medium",
      },
      {
        category: "photo",
        title: "Add a professional profile photo",
        description:
          "Profiles with professional photos receive 14x more views. Upload a high-quality headshot with a neutral background",
        impact: "high",
      },
    ],
  };
};
