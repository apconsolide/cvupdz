import { supabase } from "../supabase";

export type CVTemplate = {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  isPopular: boolean;
  category: string;
  structure: any; // JSON structure of the template
  createdAt: string;
};

export type UserCV = {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: any; // JSON content of the CV
  lastUpdated: string;
  createdAt: string;
};

export const getCVTemplates = async (): Promise<CVTemplate[]> => {
  const { data, error } = await supabase
    .from("cv_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    thumbnailUrl: template.thumbnail_url,
    isPopular: template.is_popular,
    category: template.category,
    structure: template.structure,
    createdAt: template.created_at,
  }));
};

export const getCVTemplate = async (
  templateId: string,
): Promise<CVTemplate | null> => {
  const { data, error } = await supabase
    .from("cv_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    isPopular: data.is_popular,
    category: data.category,
    structure: data.structure,
    createdAt: data.created_at,
  };
};

export const getUserCVs = async (userId: string): Promise<UserCV[]> => {
  const { data, error } = await supabase
    .from("user_cvs")
    .select("*")
    .eq("user_id", userId)
    .order("last_updated", { ascending: false });

  if (error) throw error;

  return data.map((cv) => ({
    id: cv.id,
    userId: cv.user_id,
    title: cv.title,
    templateId: cv.template_id,
    content: cv.content,
    lastUpdated: cv.last_updated,
    createdAt: cv.created_at,
  }));
};

export const getUserCV = async (cvId: string): Promise<UserCV | null> => {
  const { data, error } = await supabase
    .from("user_cvs")
    .select("*")
    .eq("id", cvId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    templateId: data.template_id,
    content: data.content,
    lastUpdated: data.last_updated,
    createdAt: data.created_at,
  };
};

export const createUserCV = async (
  userId: string,
  templateId: string,
  title: string,
  initialContent: any,
): Promise<string> => {
  const { data, error } = await supabase
    .from("user_cvs")
    .insert([
      {
        user_id: userId,
        template_id: templateId,
        title,
        content: initialContent,
        created_at: new Date(),
        last_updated: new Date(),
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const updateUserCV = async (
  cvId: string,
  updates: { title?: string; content?: any },
) => {
  const updateData: any = {
    last_updated: new Date(),
  };

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.content !== undefined) updateData.content = updates.content;

  const { error } = await supabase
    .from("user_cvs")
    .update(updateData)
    .eq("id", cvId);

  if (error) throw error;
};

export const deleteUserCV = async (cvId: string) => {
  const { error } = await supabase.from("user_cvs").delete().eq("id", cvId);

  if (error) throw error;
};

export const getCVOptimizationScore = async (
  cvId: string,
): Promise<{
  score: number;
  feedback: {
    category: string;
    message: string;
    impact: "high" | "medium" | "low";
  }[];
}> => {
  // In a real implementation, this would call an AI service or algorithm
  // For now, we'll return mock data
  return {
    score: 75,
    feedback: [
      {
        category: "Keywords",
        message:
          "Add more industry-specific keywords to improve ATS compatibility",
        impact: "high",
      },
      {
        category: "Structure",
        message:
          "Consider reorganizing your experience section to highlight achievements",
        impact: "medium",
      },
      {
        category: "Content",
        message: "Add more quantifiable achievements to your work experience",
        impact: "high",
      },
    ],
  };
};
