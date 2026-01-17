import { z } from "zod";

export const HeroSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  backgroundImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const ContentSettingsSchema = z.object({
  ourStory: z.string().min(1, "Our Story is required"),
  disclaimer: z.string().min(1, "Disclaimer is required"),
  privacyPolicy: z.string().optional(),
});

export const SocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Must be a valid URL"),
});

export const SocialsSettingsSchema = z.object({
  links: z.array(SocialLinkSchema),
});

export type HeroSettingsValues = z.infer<typeof HeroSettingsSchema>;
export type ContentSettingsValues = z.infer<typeof ContentSettingsSchema>;
export type SocialsSettingsValues = z.infer<typeof SocialsSettingsSchema>;
